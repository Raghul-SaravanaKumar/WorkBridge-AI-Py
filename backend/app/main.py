from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, worker_routes, job_routes, match_routes

app = FastAPI(title="Work Bridge AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(worker_routes.router, prefix="/workers", tags=["Workers"])
app.include_router(job_routes.router, prefix="/jobs", tags=["Jobs"])
app.include_router(match_routes.router, prefix="/recommend", tags=["Matches"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Work Bridge AI Backend"}
