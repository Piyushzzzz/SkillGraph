from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.skill import RoleResponse, RoleDetailResponse
from app.services.role_service import get_all_roles, get_role_by_id

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("", response_model=APIResponse[List[RoleResponse]])
def list_roles(
    db: Session = Depends(get_db),
):
    """Retrieve all available career roles."""
    roles = get_all_roles(db)
    return APIResponse(
        success=True,
        data=roles,
        message=f"Retrieved {len(roles)} roles."
    )


@router.get("/{id}", response_model=APIResponse[RoleDetailResponse])
def get_role(
    id: str,
    db: Session = Depends(get_db),
):
    """Retrieve role details along with all required skills and importance levels."""
    role = get_role_by_id(db, role_id=id)
    return APIResponse(
        success=True,
        data=role,
        message="Role details retrieved successfully."
    )
