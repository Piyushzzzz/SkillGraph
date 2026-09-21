from typing import Optional
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.mission import MissionGenerateRequest, MissionResponse
from app.services.mission_service import generate_mission_for_gap, get_mission_by_id

router = APIRouter(prefix="/mission", tags=["Missions"])


@router.post("/generate", response_model=APIResponse[MissionResponse], status_code=status.HTTP_201_CREATED)
def generate_mission(
    data: MissionGenerateRequest,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Generate an action-oriented mission targeting gaps in student skills for a role.
    Modularly connects to AI reasoning pipelines.
    """
    target_user_id = data.user_id if data.user_id is not None else x_user_id
    mission = generate_mission_for_gap(
        db=db,
        role_id=data.role_id,
        user_id=target_user_id,
        custom_focus_skills=data.custom_focus_skills,
    )
    return APIResponse(
        success=True,
        data=mission,
        message="Mission generated successfully."
    )


@router.get("/{id}", response_model=APIResponse[MissionResponse])
def get_mission(
    id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Retrieve detailed learning mission by ID."""
    mission = get_mission_by_id(db, mission_id=id, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=mission,
        message="Mission retrieved successfully."
    )
