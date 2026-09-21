from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from app.models.skill import Role, SkillEvidence
from app.models.evidence import Evidence
from app.services.profile_service import get_user_profile
from app.utils.ai_bridge import (
    get_skill_extractor,
    get_gap_engine,
    build_student_profile_input,
    AI_ENGINE_AVAILABLE,
)

logger = logging.getLogger("app.services.gap_service")


def perform_gap_analysis(db: Session, role_id: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Compares student evidence against role required skills.
    Integrates AI Engine (SkillExtractor + GapEngine) with zero-failure deterministic fallback.
    Categorizes skills into 'strong', 'developing', and 'missing' without arbitrary fake precision scores.
    """
    clean_id = role_id.strip().lower()
    role = db.query(Role).filter(Role.id == clean_id).first()
    if not role:
        role = db.query(Role).filter(Role.name.ilike(clean_id)).first()

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role '{role_id}' not found."
        )

    user = get_user_profile(db, user_id)

    # 1. Attempt AI-powered Gap Analysis using Student 3 Intelligence Layer
    if AI_ENGINE_AVAILABLE:
        try:
            profile_input = build_student_profile_input(db, user)
            extractor = get_skill_extractor()
            gap_engine = get_gap_engine()

            if profile_input and extractor and gap_engine:
                extracted = extractor.extract(profile_input)
                
                # Role required skills from database role_skills or role definition
                role_skills = [rs.skill.name for rs in role.role_skills if rs.skill]
                if not role_skills:
                    role_skills = ["Python", "FastAPI", "REST API", "SQL", "Docker", "Testing", "Git"]

                gap_result = gap_engine.analyze_gaps(
                    extraction_result=extracted,
                    target_role=role.name,
                    role_requirements=role_skills,
                )

                details = []
                for gd in getattr(gap_result, "gap_details", []):
                    details.append({
                        "skill": gd.skill,
                        "reason": gd.reason,
                        "current_evidence": getattr(gd, "current_evidence", []),
                        "required_evidence": getattr(gd, "required_evidence", []),
                    })

                return {
                    "role": role.name,
                    "role_id": role.id,
                    "roleId": role.id,
                    "roleTitle": role.name,
                    "strong": gap_result.strong,
                    "strongSkills": gap_result.strong,
                    "developing": gap_result.developing,
                    "developingSkills": gap_result.developing,
                    "missing": gap_result.missing,
                    "missingSkills": gap_result.missing,
                    "gap_details": details,
                    "summary": getattr(gap_result, "summary", None),
                }
        except Exception as e:
            logger.warning(f"AI Gap Engine encountered error: {e}. Falling back to deterministic graph check.")

    # 2. Deterministic Fallback Mechanism (Pure Database Link Assessment)
    strong: List[str] = []
    developing: List[str] = []
    missing: List[str] = []

    for rs in role.role_skills:
        skill = rs.skill
        if not skill:
            continue

        links = (
            db.query(SkillEvidence)
            .join(Evidence, SkillEvidence.evidence_id == Evidence.id)
            .filter(
                SkillEvidence.skill_id == skill.id,
                Evidence.user_id == user.id,
            )
            .all()
        )

        evidence_count = len(links)
        if evidence_count == 0:
            missing.append(skill.name)
        elif evidence_count >= 2:
            strong.append(skill.name)
        else:
            first_link = links[0]
            is_verified = (first_link.evidence.verification_status == "verified")
            if is_verified and first_link.confidence >= 0.9:
                strong.append(skill.name)
            else:
                developing.append(skill.name)

    return {
        "role": role.name,
        "role_id": role.id,
        "roleId": role.id,
        "roleTitle": role.name,
        "strong": strong,
        "strongSkills": strong,
        "developing": developing,
        "developingSkills": developing,
        "missing": missing,
        "missingSkills": missing,
        "gap_details": [],
        "summary": None,
    }
