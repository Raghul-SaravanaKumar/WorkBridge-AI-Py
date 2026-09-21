from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.str_schema()

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # "CUSTOMER" or "WORKER"
    skill: Optional[str] = ""
    experience: Optional[int] = 0
    location: Optional[str] = ""
    expectedSalary: Optional[float] = 0.0

class UserLogin(BaseModel):
    email: str # email, but auth frontend sends this
    password: str

class TokenResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    id: Optional[str] = None
    name: Optional[str] = None
    message: Optional[str] = None

class JobBase(BaseModel):
    title: str
    requiredSkill: str
    budget: float
    location: str
    description: str

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    customerId: str
    customerName: str
    status: str
    hiredWorkerName: Optional[str] = None
    hiredWorkerEmail: Optional[str] = None

class WorkerBase(BaseModel):
    name: str
    email: str
    skill: str
    experience: int
    location: str
    expectedSalary: float

class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    skill: Optional[str] = None
    experience: Optional[int] = None
    location: Optional[str] = None
    expectedSalary: Optional[float] = None

class WorkerResponse(WorkerBase):
    id: str

class MatchScoreBreakdown(BaseModel):
    skill: float
    location: float
    experience: float
    budget: float

class MatchResult(BaseModel):
    worker_id: str
    name: str # map worker_name to name for frontend compatibility
    email: str
    skill: str
    experience: int
    location: str
    expectedSalary: float
    score: float # map total_score to score for frontend compatibility
    score_breakdown: MatchScoreBreakdown
    reasons: List[str]
