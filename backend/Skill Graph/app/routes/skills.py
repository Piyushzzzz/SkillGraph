from typing import Optional, List
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.skill import SkillResponse, SkillDetailResponse, SkillGraphResponse
from app.services.skill_service import get_all_skills, get_skill_by_id, get_skill_graph

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=APIResponse[List[SkillResponse]])
def list_skills(
    db: Session = Depends(get_db),
):
    """Retrieve all available skills across programming, frameworks, tools, AI/ML, etc."""
    skills = get_all_skills(db)
    return APIResponse(
        success=True,
        data=skills,
        message=f"Retrieved {len(skills)} skills."
    )


@router.get("/graph", response_model=APIResponse[SkillGraphResponse])
def get_graph(
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Retrieve skill graph formatted directly for React Flow visualization.
    Returns nodes (with category and user evidence_count) and graph edges.
    """
    graph_data = get_skill_graph(db, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=graph_data,
        message="React Flow skill graph retrieved successfully."
    )


@router.get("/{id}", response_model=APIResponse[SkillDetailResponse])
def get_skill(
    id: str,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Retrieve single skill details, student evidence count, and related skills."""
    skill_data = get_skill_by_id(db, skill_id=id, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=skill_data,
        message="Skill details retrieved successfully."
    )
