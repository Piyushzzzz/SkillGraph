"""
AI Bridge: Integrates the AI Engine (Student 3) with the FastAPI Backend (Student 2).
Provides conversions from database ORM models to StudentProfileInput contracts,
and exposes initialized AI service instances with deterministic fallbacks.
"""

import logging
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.models.user import User, Subject
from app.models.evidence import Evidence, Project, Hackathon, Certificate
from app.config import settings

# Import AI Engine components safely (ai_engine is registered on sys.path via config)
try:
    from ai_engine import (
        SkillExtractor,
        GapEngine,
        MissionGenerator,
        StudentProfileInput,
        AcademicRecord,
        HackathonRecord,
        ExtractedSkill,
        SkillExtractionResult,
        GapAnalysisResult,
        ProjectMission as AIProjectMission,
    )
    from insights import InsightsService, InsightsInput, InsightsContext
    from services.github_service import GitHubService
    AI_ENGINE_AVAILABLE = True
except Exception as e:
    logging.getLogger("ai_bridge").error(f"Failed to import AI Engine: {e}")
    AI_ENGINE_AVAILABLE = False


logger = logging.getLogger("app.utils.ai_bridge")

# Singletons with fallback enabled
_extractor: Optional[Any] = None
_gap_engine: Optional[Any] = None
_mission_generator: Optional[Any] = None
_insights_service: Optional[Any] = None
_github_service: Optional[Any] = None


def get_skill_extractor():
    global _extractor
    if _extractor is None and AI_ENGINE_AVAILABLE:
        _extractor = SkillExtractor(use_fallback_on_error=True)
    return _extractor


def get_gap_engine():
    global _gap_engine
    if _gap_engine is None and AI_ENGINE_AVAILABLE:
        _gap_engine = GapEngine(use_fallback_on_error=True)
    return _gap_engine


def get_mission_generator():
    global _mission_generator
    if _mission_generator is None and AI_ENGINE_AVAILABLE:
        _mission_generator = MissionGenerator(use_fallback_on_error=True)
    return _mission_generator


def get_insights_service():
    global _insights_service
    if _insights_service is None and AI_ENGINE_AVAILABLE:
        _insights_service = InsightsService()
    return _insights_service


def get_github_service():
    global _github_service
    if _github_service is None and AI_ENGINE_AVAILABLE:
        _github_service = GitHubService(token=settings.GITHUB_TOKEN)
    return _github_service


def build_student_profile_input(db: Session, user: User) -> Any:
    """
    Transforms a database User entity and their evidence records into
    the StudentProfileInput contract consumed by the AI Engine.
    """
    if not AI_ENGINE_AVAILABLE:
        return None

    # 1. Academic records
    academic_records: List[AcademicRecord] = []
    subjects = db.query(Subject).filter(Subject.user_id == user.id).all()
    for subj in subjects:
        academic_records.append(
            AcademicRecord(
                course_name=subj.name,
                grade=subj.grade or "A",
                skills_exposed=[subj.name],
            )
        )

    # 2. Evidence (Projects, Hackathons, Certificates)
    evidences = db.query(Evidence).filter(Evidence.user_id == user.id).all()
    
    project_descriptions: List[str] = []
    hackathon_records: List[HackathonRecord] = []
    repositories_metadata: List[Dict[str, Any]] = []
    claimed_skills: List[str] = []

    for ev in evidences:
        if ev.type == "project":
            proj = db.query(Project).filter(Project.evidence_id == ev.id).first()
            name = proj.project_name if proj else ev.title
            desc = ev.description or (proj.contribution if proj else "")
            project_descriptions.append(f"{name}: {desc}")
            
            repo_url = (proj.github_url if proj and proj.github_url else None) or (ev.source_url if "github.com" in (ev.source_url or "") else None)
            techs = proj.technologies if (proj and isinstance(proj.technologies, list)) else []
            if repo_url:
                repo_name = repo_url.rstrip("/").split("/")[-1]
                repositories_metadata.append({
                    "name": repo_name,
                    "languages": {"Python": 10000},
                    "dependencies": [t.strip().lower() for t in techs if isinstance(t, str)],
                    "has_dockerfile": False,
                    "is_author_verified": ev.verification_status == "verified",
                    "topics": [],
                })
        elif ev.type == "hackathon":
            hack = db.query(Hackathon).filter(Hackathon.evidence_id == ev.id).first()
            techs = hack.technologies if (hack and isinstance(hack.technologies, list)) else []
            if not techs and ev.description:
                techs = [ev.description]
            hackathon_records.append(
                HackathonRecord(
                    hackathon_name=ev.title,
                    participation=True,
                    technical_evidence=techs,
                    project_name=hack.project_name if hack else ev.title,
                    role=hack.role if hack else "Developer",
                )
            )
        elif ev.type == "certificate":
            cert = db.query(Certificate).filter(Certificate.evidence_id == ev.id).first()
            claimed_skills.append(cert.certificate_name if cert else ev.title)

    # Add default claimed skills if empty
    if not claimed_skills:
        claimed_skills = ["Python", "FastAPI", "SQL"]

    return StudentProfileInput(
        student_id=str(user.id),
        claimed_skills=list(set(claimed_skills)),
        github_username="student_developer",
        repositories_metadata=repositories_metadata,
        academic_records=academic_records,
        hackathon_records=hackathon_records,
        project_descriptions=project_descriptions,
    )
