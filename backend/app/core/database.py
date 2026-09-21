import motor.motor_asyncio
from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

users_collection = db["users"]
workers_collection = db["workers"]
jobs_collection = db["jobs"]
