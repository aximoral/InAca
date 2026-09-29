from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import List
import uuid

from database import engine, Base, get_db
import models

try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: could not initialize database on startup. Ensure PG is running and vector extension is enabled. {e}")

app = FastAPI(title="Antigravity 2.0 API")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Antigravity 2.0 API is running."}

@app.get("/api/jobs/{job_id}/matches")
def get_job_matches(job_id: uuid.UUID, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job or job.embedding is None:
        raise HTTPException(status_code=404, detail="Job not found or no embedding")

    query = text("""
        SELECT p.user_id, p.first_name, p.last_name, p.bio,
               1 - (p.embedding <=> :job_embedding) AS match_score
        FROM profiles p
        JOIN users u ON u.id = p.user_id
        WHERE u.role = 'STUDENT' AND p.embedding IS NOT NULL
        ORDER BY p.embedding <=> :job_embedding
        LIMIT 10;
    """)
    embedding_str = str(list(job.embedding))
    results = db.execute(query, {"job_embedding": embedding_str}).fetchall()
    
    matches = [{"user_id": r[0], "first_name": r[1], "last_name": r[2], "bio": r[3], "match_score": float(r[4])} for r in results]
    return {"job_id": job_id, "matches": matches}

@app.get("/api/students/{user_id}/matches")
def get_student_matches(user_id: uuid.UUID, db: Session = Depends(get_db)):
    student_profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not student_profile or student_profile.embedding is None:
        raise HTTPException(status_code=404, detail="Profile not found or no embedding")

    query = text("""
        SELECT j.id, j.title, j.description, p.organization_name as company,
               1 - (j.embedding <=> :student_embedding) AS match_score
        FROM jobs j
        JOIN users u ON u.id = j.recruiter_id
        JOIN profiles p ON p.user_id = u.id
        WHERE j.is_active = True AND j.embedding IS NOT NULL
        ORDER BY j.embedding <=> :student_embedding
        LIMIT 10;
    """)
    embedding_str = str(list(student_profile.embedding))
    results = db.execute(query, {"student_embedding": embedding_str}).fetchall()
    
    matches = [{"job_id": r[0], "title": r[1], "description": r[2], "company": r[3], "match_score": float(r[4])} for r in results]
    return {"student_id": user_id, "job_matches": matches}

@app.get("/api/profiles/{user_id}")
def get_profile(user_id: uuid.UUID, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "bio": profile.bio,
        "organization_name": profile.organization_name
    }

@app.get("/api/users/{role}")
def get_users_by_role(role: str, db: Session = Depends(get_db)):
    # Handle pluralization (e.g. "students" -> "STUDENT")
    formatted_role = role.upper()
    if formatted_role.endswith("S"):
        formatted_role = formatted_role[:-1]
        
    users = db.query(models.User).filter(models.User.role == formatted_role).limit(15).all()
    res = []
    for u in users:
        p = db.query(models.Profile).filter(models.Profile.user_id == u.id).first()
        res.append({"id": str(u.id), "name": f"{p.first_name} {p.last_name}" if p else u.email})
    return res

@app.get("/api/recruiters/{user_id}/jobs")
def get_recruiter_jobs(user_id: uuid.UUID, db: Session = Depends(get_db)):
    jobs = db.query(models.Job).filter(models.Job.recruiter_id == user_id).all()
    return [{"id": str(j.id), "title": j.title, "description": j.description, "is_active": j.is_active} for j in jobs]

@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    res = []
    for p in projects:
        sponsor_prof = db.query(models.Profile).filter(models.Profile.user_id == p.sponsor_id).first()
        res.append({
            "id": str(p.id),
            "title": p.title,
            "description": p.description,
            "type": p.type.value,
            "sponsor": sponsor_prof.organization_name if sponsor_prof else "Unknown"
        })
    return res

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return [{"id": str(c.id), "title": c.title, "provider": c.provider, "description": c.description} for c in courses]

@app.get("/api/analytics/institution")
def get_institution_analytics(db: Session = Depends(get_db)):
    """Mock aggregate analytics for the institution dashboard."""
    # Placement Funnel
    total_apps = db.query(models.Application).count()
    shortlisted = db.query(models.Application).filter(models.Application.status == models.ApplicationStatusEnum.SHORTLISTED).count()
    
    # Skill Demand
    skill_demand = [
        {"name": "Python", "demand": 85},
        {"name": "React", "demand": 92},
        {"name": "Machine Learning", "demand": 78},
        {"name": "Cloud Computing", "demand": 65},
    ]
    
    # Placement Readiness
    readiness = [
        {"cohort": "2024", "score": 75},
        {"cohort": "2025", "score": 82},
        {"cohort": "2026", "score": 60},
    ]

    return {
        "funnel": {
            "applied": total_apps,
            "shortlisted": shortlisted,
            "hired": int(shortlisted * 0.4)
        },
        "skills": skill_demand,
        "readiness": readiness
    }
