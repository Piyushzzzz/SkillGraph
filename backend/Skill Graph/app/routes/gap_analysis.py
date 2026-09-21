from typing import Optional
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.gap_analysis import GapAnalysisResponse
from app.services.gap_service import perform_gap_analysis

router = APIRouter(prefix="/gap-analysis", tags=["Gap Analysis"])


@router.get("/{role_id}", response_model=APIResponse[GapAnalysisResponse])
def get_gap_analysis(
    role_id: str,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Compares student evidence against role required skills.
    Categorizes skills into 'strong', 'developing', and 'missing' without arbitrary AI scores.
    """
    analysis = perform_gap_analysis(db, role_id=role_id, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=analysis,
        message=f"Gap analysis for '{analysis['role']}' completed successfully."
    )
