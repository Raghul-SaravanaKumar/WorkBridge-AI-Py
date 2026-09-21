from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import WorkerUpdate, WorkerResponse
from app.core.database import workers_collection
from app.dependencies.auth import get_current_user, get_current_worker
from bson import ObjectId

router = APIRouter()

@router.get("", response_model=list[WorkerResponse])
async def get_all_workers():
    workers = await workers_collection.find().to_list(1000)
    return [{**w, "id": str(w["_id"])} for w in workers]

@router.get("/me", response_model=WorkerResponse)
async def get_my_worker_profile(current_user: dict = Depends(get_current_worker)):
    worker = await workers_collection.find_one({"email": current_user["email"]})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return {**worker, "id": str(worker["_id"])}

@router.post("", response_model=WorkerResponse)
async def create_worker_profile(worker_update: WorkerUpdate, current_user: dict = Depends(get_current_worker)):
    existing = await workers_collection.find_one({"email": current_user["email"]})
    if existing:
        raise HTTPException(status_code=400, detail="Worker profile already exists")
    
    new_worker = worker_update.dict(exclude_unset=True)
    new_worker["email"] = current_user["email"]
    new_worker["name"] = current_user.get("name", "Unknown Worker")
    new_worker["user_id"] = current_user["id"]
    
    result = await workers_collection.insert_one(new_worker)
    new_worker["_id"] = result.inserted_id
    return {**new_worker, "id": str(new_worker["_id"])}

@router.get("/{worker_id}", response_model=WorkerResponse)
async def get_worker(worker_id: str):
    if not ObjectId.is_valid(worker_id):
        raise HTTPException(status_code=400, detail="Invalid worker ID")
    worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {**worker, "id": str(worker["_id"])}

@router.put("/{worker_id}", response_model=WorkerResponse)
async def update_worker(worker_id: str, worker_update: WorkerUpdate, current_user: dict = Depends(get_current_worker)):
    if not ObjectId.is_valid(worker_id):
        raise HTTPException(status_code=400, detail="Invalid worker ID")
    
    worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    if worker.get("email") != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
    update_data = {k: v for k, v in worker_update.dict().items() if v is not None}
    if update_data:
        await workers_collection.update_one({"_id": ObjectId(worker_id)}, {"$set": update_data})
        
    updated_worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
    return {**updated_worker, "id": str(updated_worker["_id"])}
