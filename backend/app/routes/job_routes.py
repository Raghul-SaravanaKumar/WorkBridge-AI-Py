from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import JobCreate, JobResponse
from app.core.database import jobs_collection
from app.dependencies.auth import get_current_user, get_current_customer
from bson import ObjectId

router = APIRouter()

@router.post("", response_model=JobResponse)
async def create_job(job: JobCreate, current_user: dict = Depends(get_current_customer)):
    job_dict = job.dict()
    job_dict["customerId"] = current_user["id"]
    job_dict["customerName"] = current_user.get("name", "Unknown Customer")
    job_dict["status"] = "OPEN"
    
    result = await jobs_collection.insert_one(job_dict)
    job_dict["id"] = str(result.inserted_id)
    return job_dict

@router.get("", response_model=list[JobResponse])
async def get_all_jobs():
    jobs = await jobs_collection.find().to_list(1000)
    return [{**j, "id": str(j["_id"])} for j in jobs]

@router.get("/my", response_model=list[JobResponse])
async def get_my_jobs(current_user: dict = Depends(get_current_customer)):
    jobs = await jobs_collection.find({"customerId": current_user["id"]}).to_list(1000)
    return [{**j, "id": str(j["_id"])} for j in jobs]

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {**job, "id": str(job["_id"])}

@router.delete("/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_customer)):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
        
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.get("customerId") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
        
    await jobs_collection.delete_one({"_id": ObjectId(job_id)})
    return {"message": "Job deleted successfully"}

from pydantic import BaseModel

class HireRequest(BaseModel):
    workerName: str
    workerEmail: str

@router.post("/{job_id}/hire")
async def hire_worker(job_id: str, req: HireRequest, current_user: dict = Depends(get_current_customer)):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
        
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.get("customerId") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to hire for this job")
        
    await jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": "HIRED", "hiredWorkerName": req.workerName, "hiredWorkerEmail": req.workerEmail}}
    )
    return {"message": "Worker hired successfully"}
