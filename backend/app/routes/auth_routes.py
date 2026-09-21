from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserRegister, UserLogin, TokenResponse
from app.core.database import users_collection, workers_collection
from app.core.security import get_password_hash, verify_password, create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        return {"success": False, "message": "Email is already registered."}

    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role.upper()
    }

    result = await users_collection.insert_one(user_dict)
    
    if user.role.upper() == "WORKER":
        worker_dict = {
            "name": user.name,
            "email": user.email,
            "skill": user.skill,
            "experience": user.experience,
            "location": user.location,
            "expectedSalary": user.expectedSalary,
            "user_id": str(result.inserted_id) # For robust linking
        }
        await workers_collection.insert_one(worker_dict)

    return {"success": True, "message": "Registration successful."}

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        return {"success": False, "message": "User not found."}

    if not verify_password(credentials.password, user["password"]):
        return {"success": False, "message": "Incorrect password."}

    token = create_access_token(data={"email": user["email"], "role": user["role"]})
    
    return {
        "success": True,
        "token": token,
        "role": user["role"],
        "email": user["email"],
        "id": str(user["_id"]),
        "name": user["name"]
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "name": current_user["name"]
    }
