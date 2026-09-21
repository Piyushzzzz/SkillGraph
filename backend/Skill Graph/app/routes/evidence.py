from typing import Optional, List
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.evidence import (
    EvidenceResponse,
    EvidenceCreateGeneral,
    ProjectCreate,
    HackathonCreate,
    CertificateCreate,
)
from app.services.evidence_service import (
    get_all_evidence,
    get_evidence_by_id,
    delete_evidence,
    create_general_evidence,
    create_project_evidence,
    create_hackathon_evidence,
    create_certificate_evidence,
)

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.get("", response_model=APIResponse[List[EvidenceResponse]])
def list_evidence(
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """List all evidence items for the student."""
    items = get_all_evidence(db, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=items,
        message=f"Retrieved {len(items)} evidence items."
    )


@router.post("", response_model=APIResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
def post_general_evidence(
    data: EvidenceCreateGeneral,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Create a general evidence item."""
    item = create_general_evidence(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=item,
        message="Evidence created successfully."
    )


@router.post("/project", response_model=APIResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
def post_project_evidence(
    data: ProjectCreate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Create a project-based evidence item with role, technologies, and repos."""
    item = create_project_evidence(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=item,
        message="Project evidence recorded and skills linked successfully."
    )


@router.post("/hackathon", response_model=APIResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
def post_hackathon_evidence(
    data: HackathonCreate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Create a hackathon-based evidence item with team details and achievement."""
    item = create_hackathon_evidence(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=item,
        message="Hackathon evidence recorded successfully."
    )


@router.post("/certificate", response_model=APIResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
def post_certificate_evidence(
    data: CertificateCreate,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Create a certificate evidence item with issuer and credential URL."""
    item = create_certificate_evidence(db, data=data, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=item,
        message="Certificate evidence recorded successfully."
    )


@router.get("/{id}", response_model=APIResponse[EvidenceResponse])
def get_single_evidence(
    id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Retrieve specific evidence by ID."""
    item = get_evidence_by_id(db, evidence_id=id, user_id=x_user_id)
    return APIResponse(
        success=True,
        data=item,
        message="Evidence details retrieved."
    )


@router.delete("/{id}", response_model=APIResponse[dict])
def delete_single_evidence(
    id: int,
    x_user_id: Optional[int] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Delete specific evidence by ID."""
    delete_evidence(db, evidence_id=id, user_id=x_user_id)
    return APIResponse(
        success=True,
        data={"id": id, "deleted": True},
        message=f"Evidence {id} deleted successfully."
    )
