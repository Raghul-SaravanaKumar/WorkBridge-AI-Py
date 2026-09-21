from app.models.schemas import MatchResult, MatchScoreBreakdown, JobResponse, WorkerResponse
from app.services.skill_normalizer import normalize_skill
from typing import List

def calculate_match(job: dict, worker: dict) -> MatchResult:
    skill_score = 0.0
    location_score = 0.0
    experience_score = 0.0
    budget_score = 0.0
    reasons = []

    # 1. Skill Match (50 points)
    req_skill = normalize_skill(job.get("requiredSkill", ""))
    w_skill = normalize_skill(worker.get("skill", ""))
    
    if req_skill and req_skill == w_skill:
        skill_score = 50.0
        reasons.append("Exact skill match")
    elif w_skill and req_skill and (w_skill in req_skill or req_skill in w_skill):
        skill_score = 25.0
        reasons.append("Partial skill compatibility")
    else:
        reasons.append("Skill is unrelated")

    # 2. Location Match (25 points)
    job_loc = job.get("location", "").strip().lower()
    w_loc = worker.get("location", "").strip().lower()
    if job_loc and job_loc == w_loc:
        location_score = 25.0
        reasons.append("Same service location")
    else:
        reasons.append("Different service location")

    # 3. Experience Match (15 points)
    exp = worker.get("experience", 0)
    if exp >= 5:
        experience_score = 15.0
        reasons.append("Excellent experience level")
    elif exp > 0:
        experience_score = round((exp / 5.0) * 15.0, 1)
        reasons.append("Experience partially satisfies the requirement")
    else:
        reasons.append("No experience listed")

    # 4. Budget Match (10 points)
    budget = job.get("budget", 0.0)
    salary = worker.get("expectedSalary", 0.0)
    if salary <= budget:
        budget_score = 10.0
        reasons.append("Expected wage is within budget")
    else:
        margin = budget * 0.3
        if margin > 0 and salary <= (budget + margin):
            budget_score = round(10.0 * (1.0 - ((salary - budget) / margin)), 1)
            reasons.append("Expected wage is slightly above the requested budget")
        else:
            reasons.append("Expected wage exceeds budget significantly")

    total_score = skill_score + location_score + experience_score + budget_score
    total_score = round(total_score, 1)

    breakdown = MatchScoreBreakdown(
        skill=skill_score,
        location=location_score,
        experience=experience_score,
        budget=budget_score
    )

    return MatchResult(
        worker_id=str(worker["_id"]),
        name=worker.get("name", "Unknown"),
        email=worker.get("email", ""),
        skill=worker.get("skill", ""),
        experience=worker.get("experience", 0),
        location=worker.get("location", ""),
        expectedSalary=worker.get("expectedSalary", 0.0),
        score=total_score,
        score_breakdown=breakdown,
        reasons=reasons
    )

def recommend_workers(job: dict, workers: List[dict]) -> List[MatchResult]:
    results = []
    for w in workers:
        match = calculate_match(job, w)
        results.append(match)
    
    # Sort descending by score
    results.sort(key=lambda x: x.score, reverse=True)
    return results
