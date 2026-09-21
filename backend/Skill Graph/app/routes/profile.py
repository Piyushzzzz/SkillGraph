from typing import Optional
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.user import UserProfileResponse, UserProfileUpdate, UserProfileBase
from app.services.profile_service import get_user_profile, update_user_profile, create_student_profile

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=APIResponse[UserProfileResponse])
def get_profile(
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Retrieve the student's profile information."""
    user = get_user_profile(db, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=user,
        message="Profile retrieved successfully."
    )


@router.post("", response_model=APIResponse[UserProfileResponse], status_code=status.HTTP_201_CREATED)
def create_profile(
    data: UserProfileBase,
    db: Session = Depends(get_db),
):
    """Create a new student account with a fresh clean slate."""
    user = create_student_profile(db, data=data)
    return APIResponse(
        success=True,
        data=user,
        message="New student account created with a clean slate."
    )


@router.put("", response_model=APIResponse[UserProfileResponse])
def update_profile(
    data: UserProfileUpdate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Update profile details such as name, university, branch, semester, CGPA."""
    updated_user = update_user_profile(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=updated_user,
        message="Profile updated successfully."
    )
