from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, ContactMessage, Report, QuizResult, CareerSearch, Bookmark
from security import hash_password, verify_password, get_current_user
from datetime import datetime

router = APIRouter()

# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user["email"]).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email exists")

    new_user = User(
        name=user["name"],
        email=user["email"],
        password=hash_password(user["password"])
    )

    db.add(new_user)
    db.commit()

    return {"message": "Registered successfully"}


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user["email"]).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user["password"], db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    return {
        "token": db_user.email,  # IMPORTANT
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

from pydantic import BaseModel

# =========================
# QUIZ SCHEMA
# =========================
class CareerQuiz(BaseModel):
    likes_programming: bool
    likes_math: bool
    likes_design: bool


# =========================
# CAREER QUIZ API
# =========================
@router.post("/career-quiz")
def career_quiz(
    data: CareerQuiz,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # LOGIC
    if data.likes_programming and data.likes_math:
        career = "AI Engineer"
        stream = "Science"
    elif data.likes_design:
        career = "UI/UX Designer"
        stream = "Arts"
    else:
        career = "Business Analyst"
        stream = "Commerce"

    # 🔥 SAVE QUIZ RESULT
    quiz = QuizResult(
        user_id=current_user.id,
        stream=stream,
        confidence=80,
        answers=[data.likes_programming, data.likes_math, data.likes_design]
    )

    db.add(quiz)
    db.commit()

    # 🔥 SAVE REPORT
    report = Report(
        user_id=current_user.id,
        stream=stream,
        interests="Based on quiz",
        skills="Auto generated"
    )

    db.add(report)
    db.commit()

    return {
        "recommended_career": career,
        "stream": stream
    }
# =========================
# DASHBOARD
# =========================
@router.post("/dashboard")
def dashboard():

    return {
        "modules_used": 4,
        "reports_count": 2,
        "career_recommendations": 6,
        "streak": 5
    }


# =========================
# REPORT (MAIN)
# =========================
@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reports = db.query(Report).filter(
        Report.user_id == current_user.id
    ).all()

    # 🔥 AUTO CREATE IF EMPTY
    if not reports:
        new_report = Report(
            user_id=current_user.id,
            stream="Science",
            interests="AI, Technology",
            skills="Problem Solving"
        )
        db.add(new_report)
        db.commit()

        reports = [new_report]

    return {
        "reports": [
            {
                "title": "Career Recommendation",
                "summary": f"Recommended Stream: {r.stream}",
                "date": r.created_at.strftime("%Y-%m-%d")
            }
            for r in reports
        ]
    }


# =========================
# SAVE REPORT
# =========================
@router.post("/reports/save")
def save_report(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    report = Report(
        user_id=current_user.id,
        stream=data.get("stream"),
        interests=data.get("interests"),
        skills=data.get("skills")
    )

    db.add(report)
    db.commit()

    return {"message": "Report saved"}


# =========================
# CONTACT
# =========================
@router.post("/contact")
def contact(data: dict, db: Session = Depends(get_db)):

    msg = ContactMessage(
        name=data.get("name"),
        email=data.get("email"),
        message=data.get("message")
    )

    db.add(msg)
    db.commit()

    return {"message": "Message sent"}

 
