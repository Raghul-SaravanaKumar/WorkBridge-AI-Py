import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import db

@pytest.mark.asyncio
async def test_full_workflow():
    await db.users.drop()
    await db.workers.drop()
    await db.jobs.drop()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Register Customer
        response = await ac.post("/auth/register", json={
            "name": "Customer",
            "email": "customer@test.com",
            "password": "password",
            "role": "CUSTOMER"
        })
        assert response.status_code == 200
        
        login_res = await ac.post("/auth/login", json={"email": "customer@test.com", "password": "password"})
        c_token = login_res.json()["token"]

        # Register Worker
        await ac.post("/auth/register", json={
            "name": "Worker 1",
            "email": "w1@test.com",
            "password": "password",
            "role": "WORKER",
            "skill": "Plumber",
            "experience": 5,
            "location": "New York",
            "expectedSalary": 50.0
        })

        # Create Job
        job_res = await ac.post("/jobs", json={
            "title": "Fix pipe",
            "requiredSkill": "Plumbing",
            "budget": 60.0,
            "location": "New York",
            "description": "Fixing a leaky pipe"
        }, headers={"Authorization": f"Bearer {c_token}"})
        assert job_res.status_code == 200
        job_id = job_res.json()["id"]

        # Get recommendations
        rec_res = await ac.get(f"/recommend/{job_id}", headers={"Authorization": f"Bearer {c_token}"})
        assert rec_res.status_code == 200
        matches = rec_res.json()
        
        assert len(matches) == 1
        assert matches[0]["name"] == "Worker 1"
        assert matches[0]["score"] == 100.0 # 50 skill + 25 loc + 15 exp + 10 budget
        assert "score_breakdown" in matches[0]
        assert "reasons" in matches[0]
