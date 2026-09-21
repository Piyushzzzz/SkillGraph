from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserProfileBase


def get_default_user(db: Session) -> User:
    """
    Retrieves the first user or creates a default demo user if the database is empty.
    """
    user = db.query(User).first()
    if not user:
        user = User(
            name="Alex Mercer",
            email="alex.mercer@university.edu",
            university="Tech State University",
            degree="Bachelor of Technology",
            branch="Computer Science & Engineering",
            semester=6,
            cgpa=8.75,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def get_user_profile(db: Session, user_id: Optional[int] = None) -> User:
    """
    Fetches user profile by ID. If user_id is None, defaults to the primary student.
    """
    if user_id is None:
        return get_default_user(db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )
    return user


def create_student_profile(db: Session, data: UserProfileBase) -> User:
    """
    Creates a brand new student profile with a clean slate (0 evidence, 0 courses).
    """
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return existing

    user = User(
        name=data.name,
        email=data.email,
        university=data.university or None,
        degree=data.degree or None,
        branch=data.branch or None,
        semester=data.semester or None,
        cgpa=data.cgpa if data.cgpa is not None else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_profile(db: Session, data: UserProfileUpdate, user_id: Optional[int] = None) -> User:
    """
    Updates user profile fields and persists changes to database.
    """
    user = get_user_profile(db, user_id)
    
    update_data = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else data.dict(exclude_unset=True)
    
    # If email changed, check uniqueness
    new_email = update_data.get("email")
    if new_email and new_email != user.email:
        existing = db.query(User).filter(User.email == new_email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{new_email}' is already registered by another user."
            )
            
    for field, value in update_data.items():
        setattr(user, field, value)
        
    db.commit()
    db.refresh(user)
    return user
