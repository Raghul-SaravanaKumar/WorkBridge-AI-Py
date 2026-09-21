from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import MatchResult
from app.core.database import jobs_collection, workers_collection
from app.dependencies.auth import get_current_user, get_current_customer
from app.services.match_service import recommend_workers
from bson import ObjectId

router = APIRouter()

@router.get("/{job_id}", response_model=List[MatchResult])
async def get_matches(job_id: str, current_user: dict = Depends(get_current_customer)):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
        
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.get("customerId") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access matches for this job")
        
    workers = await workers_collection.find().to_list(1000)
    matches = recommend_workers(job, workers)
    
    return matches
