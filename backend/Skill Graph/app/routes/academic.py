from typing import Optional
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.user import AcademicSummaryResponse, SubjectCreate, SubjectResponse
from app.services.academic_service import get_academic_record, add_subject

router = APIRouter(prefix="/academic", tags=["Academic"])


@router.get("", response_model=APIResponse[AcademicSummaryResponse])
def get_academic(
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Retrieve academic history, course subjects, credit totals, and GPA."""
    summary = get_academic_record(db, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=summary,
        message="Academic summary retrieved successfully."
    )


@router.post("", response_model=APIResponse[SubjectResponse], status_code=status.HTTP_201_CREATED)
def post_academic(
    data: SubjectCreate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Add a new subject grade and credit record."""
    new_subject = add_subject(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=new_subject,
        message="Subject added successfully."
    )
