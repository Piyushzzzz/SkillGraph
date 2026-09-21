from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.evidence import Evidence, Project, Hackathon, Certificate
from app.models.skill import Skill, SkillEvidence
from app.schemas.evidence import (
    ProjectCreate,
    HackathonCreate,
    CertificateCreate,
    EvidenceCreateGeneral,
    SkillLinkInput,
)
from app.services.profile_service import get_user_profile


def _serialize_evidence(item: Evidence) -> Dict[str, Any]:
    """Helper to convert Evidence ORM model into schema dict with details and linked skills."""
    skills_data = []
    for link in item.skill_links:
        skills_data.append({
            "skill_id": link.skill_id,
            "skill_name": link.skill.name if link.skill else link.skill_id,
            "confidence": link.confidence,
            "reason": link.reason,
        })
        
    details_data = None
    if item.type == "project" and item.project:
        details_data = {
            "id": item.project.id,
            "project_name": item.project.project_name,
            "role": item.project.role,
            "contribution": item.project.contribution,
            "technologies": item.project.technologies,
            "github_url": item.project.github_url,
            "demo_url": item.project.demo_url,
        }
    elif item.type == "hackathon" and item.hackathon:
        details_data = {
            "id": item.hackathon.id,
            "hackathon_name": item.hackathon.hackathon_name,
            "organization": item.hackathon.organization,
            "project_name": item.hackathon.project_name,
            "team_name": item.hackathon.team_name,
            "role": item.hackathon.role,
            "contribution": item.hackathon.contribution,
            "technologies": item.hackathon.technologies,
            "github_url": item.hackathon.github_url,
            "demo_url": item.hackathon.demo_url,
            "achievement": item.hackathon.achievement,
        }
    elif item.type == "certificate" and item.certificate:
        details_data = {
            "id": item.certificate.id,
            "issuer": item.certificate.issuer,
            "certificate_name": item.certificate.certificate_name,
            "certificate_url": item.certificate.certificate_url,
        }

    return {
        "id": item.id,
        "user_id": item.user_id,
        "type": item.type,
        "title": item.title,
        "description": item.description,
        "source_url": item.source_url,
        "date": item.date,
        "verification_status": item.verification_status,
        "created_at": item.created_at,
        "skills": skills_data,
        "details": details_data,
    }


def _link_skills_to_evidence(
    db: Session, 
    evidence_id: int, 
    skills: Optional[List[SkillLinkInput]], 
    technologies: Optional[List[str]] = None
):
    """
    Links explicit skills or resolves technologies to existing Skills in the database.
    """
    linked_ids = set()

    # 1. Process explicit skill inputs if provided
    if skills:
        for s in skills:
            skill = db.query(Skill).filter(Skill.id == s.skill_id.lower()).first()
            if skill and skill.id not in linked_ids:
                link = SkillEvidence(
                    skill_id=skill.id,
                    evidence_id=evidence_id,
                    confidence=s.confidence,
                    reason=s.reason or f"Linked from evidence {evidence_id}",
                )
                db.add(link)
                linked_ids.add(skill.id)

    # 2. Auto-match technologies strings to skills
    if technologies:
        for tech in technologies:
            tech_clean = tech.strip().lower()
            # Try matching by ID or name
            skill = db.query(Skill).filter(
                (Skill.id == tech_clean) | (Skill.name.ilike(tech_clean))
            ).first()
            if skill and skill.id not in linked_ids:
                link = SkillEvidence(
                    skill_id=skill.id,
                    evidence_id=evidence_id,
                    confidence=0.9,
                    reason=f"Auto-inferred from technology '{tech}'",
                )
                db.add(link)
                linked_ids.add(skill.id)


def get_all_evidence(db: Session, user_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """Retrieves all evidence records for user."""
    user = get_user_profile(db, user_id)
    items = db.query(Evidence).filter(Evidence.user_id == user.id).order_by(Evidence.created_at.desc()).all()
    return [_serialize_evidence(item) for item in items]


def get_evidence_by_id(db: Session, evidence_id: int, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Retrieves single evidence record by ID."""
    user = get_user_profile(db, user_id)
    item = db.query(Evidence).filter(Evidence.id == evidence_id, Evidence.user_id == user.id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence with ID {evidence_id} not found."
        )
    return _serialize_evidence(item)


def delete_evidence(db: Session, evidence_id: int, user_id: Optional[int] = None) -> bool:
    """Deletes evidence record and cascades child items."""
    user = get_user_profile(db, user_id)
    item = db.query(Evidence).filter(Evidence.id == evidence_id, Evidence.user_id == user.id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence with ID {evidence_id} not found."
        )
    db.delete(item)
    db.commit()
    return True


def create_project_evidence(db: Session, data: ProjectCreate, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Creates a project evidence and child project record."""
    user = get_user_profile(db, user_id)
    
    evidence = Evidence(
        user_id=user.id,
        type="project",
        title=data.title,
        description=data.description,
        source_url=data.github_url or data.demo_url or data.source_url,
        date=data.date,
        verification_status="verified" if data.github_url else "pending",
    )
    db.add(evidence)
    db.flush()

    project = Project(
        evidence_id=evidence.id,
        project_name=data.project_name,
        role=data.role,
        contribution=data.contribution,
        technologies=data.technologies,
        github_url=data.github_url,
        demo_url=data.demo_url,
    )
    db.add(project)
    
    _link_skills_to_evidence(db, evidence.id, data.skills, data.technologies)
    
    db.commit()
    db.refresh(evidence)
    return _serialize_evidence(evidence)


def create_hackathon_evidence(db: Session, data: HackathonCreate, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Creates a hackathon evidence and child hackathon record."""
    user = get_user_profile(db, user_id)
    
    evidence = Evidence(
        user_id=user.id,
        type="hackathon",
        title=data.title,
        description=data.description,
        source_url=data.demo_url or data.github_url or data.source_url,
        date=data.date,
        verification_status="verified" if data.achievement else "pending",
    )
    db.add(evidence)
    db.flush()

    hackathon = Hackathon(
        evidence_id=evidence.id,
        hackathon_name=data.hackathon_name,
        organization=data.organization,
        project_name=data.project_name,
        team_name=data.team_name,
        role=data.role,
        contribution=data.contribution,
        technologies=data.technologies,
        github_url=data.github_url,
        demo_url=data.demo_url,
        achievement=data.achievement,
    )
    db.add(hackathon)
    
    _link_skills_to_evidence(db, evidence.id, data.skills, data.technologies)

    db.commit()
    db.refresh(evidence)
    return _serialize_evidence(evidence)


def create_certificate_evidence(db: Session, data: CertificateCreate, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Creates a certificate evidence and child certificate record."""
    user = get_user_profile(db, user_id)
    
    evidence = Evidence(
        user_id=user.id,
        type="certificate",
        title=data.title,
        description=data.description,
        source_url=data.certificate_url or data.source_url,
        date=data.date,
        verification_status="verified" if data.certificate_url else "pending",
    )
    db.add(evidence)
    db.flush()

    cert = Certificate(
        evidence_id=evidence.id,
        issuer=data.issuer,
        certificate_name=data.certificate_name,
        certificate_url=data.certificate_url,
    )
    db.add(cert)
    
    _link_skills_to_evidence(db, evidence.id, data.skills, [data.certificate_name])

    db.commit()
    db.refresh(evidence)
    return _serialize_evidence(evidence)


def create_general_evidence(db: Session, data: EvidenceCreateGeneral, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Creates generic evidence item."""
    user = get_user_profile(db, user_id)
    
    evidence = Evidence(
        user_id=user.id,
        type=data.type,
        title=data.title,
        description=data.description,
        source_url=data.source_url,
        date=data.date,
        verification_status=data.verification_status,
    )
    db.add(evidence)
    db.flush()

    _link_skills_to_evidence(db, evidence.id, data.skills)

    db.commit()
    db.refresh(evidence)
    return _serialize_evidence(evidence)
