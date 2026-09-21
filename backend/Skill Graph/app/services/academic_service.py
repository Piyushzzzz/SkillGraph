from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.user import Subject
from app.schemas.user import SubjectCreate
from app.services.profile_service import get_user_profile


def get_academic_record(db: Session, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Returns academic summary including enrolled subjects, total credits, semester, and CGPA.
    """
    user = get_user_profile(db, user_id)
    subjects = db.query(Subject).filter(Subject.user_id == user.id).all()
    
    total_credits = sum(s.credits for s in subjects)
    
    return {
        "user_id": user.id,
        "cgpa": user.cgpa,
        "semester": user.semester,
        "total_credits": round(total_credits, 2),
        "subjects": subjects,
    }


def add_subject(db: Session, data: SubjectCreate, user_id: Optional[int] = None) -> Subject:
    """
    Adds a new completed academic course/subject to the student's record.
    """
    user = get_user_profile(db, user_id)
    
    subject = Subject(
        user_id=user.id,
        name=data.name.strip(),
        grade=data.grade.strip().upper(),
        credits=data.credits,
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject
