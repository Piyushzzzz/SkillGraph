from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from app.models.mission import Mission
from app.models.skill import Role
from app.services.profile_service import get_user_profile
from app.services.gap_service import perform_gap_analysis
from app.utils.ai_bridge import (
    get_skill_extractor,
    get_gap_engine,
    get_mission_generator,
    get_insights_service,
    build_student_profile_input,
    AI_ENGINE_AVAILABLE,
)

logger = logging.getLogger("app.services.mission_service")


def generate_mission_for_gap(
    db: Session,
    role_id: str,
    user_id: Optional[int] = None,
    custom_focus_skills: Optional[List[str]] = None,
) -> Mission:
    """
    Generates a targeted, closed-loop action mission based on student gap analysis.
    Powered by the full AI Intelligence Pipeline (Student 3):
    Student Skills -> Skill Gaps -> iNSIGHTS Context -> Generated Mission
    """
    user = get_user_profile(db, user_id)
    clean_id = role_id.strip().lower()
    role = db.query(Role).filter(Role.id == clean_id).first()
    if not role:
        role = db.query(Role).filter(Role.name.ilike(clean_id)).first()

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role '{role_id}' not found."
        )

    # 1. Attempt Closed-Loop AI Mission Generation
    if AI_ENGINE_AVAILABLE:
        try:
            profile_input = build_student_profile_input(db, user)
            extractor = get_skill_extractor()
            gap_engine = get_gap_engine()
            mission_generator = get_mission_generator()
            insights_service = get_insights_service()

            if profile_input and extractor and gap_engine and mission_generator:
                # Step 1: Extract evidence-backed skills
                extracted = extractor.extract(profile_input)

                # Step 2: Analyze skill gaps
                role_skills = [rs.skill.name for rs in role.role_skills if rs.skill]
                if not role_skills:
                    role_skills = ["Python", "FastAPI", "SQL", "Docker", "Testing"]

                gap_result = gap_engine.analyze_gaps(
                    extraction_result=extracted,
                    target_role=role.name,
                    role_requirements=role_skills,
                )

                # Step 3: Fetch iNSIGHTS contextual market intelligence
                insights_context = None
                if insights_service:
                    try:
                        from insights import InsightsInput
                        insights_input = InsightsInput(
                            target_role=role.name,
                            student_skills=gap_result.strong,
                            developing_skills=gap_result.developing,
                            missing_skills=gap_result.missing,
                        )
                        insights_context = insights_service.get_context(insights_input)
                    except Exception as ie:
                        logger.warning(f"Could not retrieve iNSIGHTS context: {ie}")

                # Step 4: Generate Closed-Loop Mission
                ai_mission = mission_generator.generate_mission(
                    target_role=role.name,
                    gap_result=gap_result,
                    insights_context=insights_context,
                )

                # Persist generated mission to database
                db_mission = Mission(
                    user_id=user.id,
                    role_id=role.id,
                    title=ai_mission.title,
                    description=ai_mission.description,
                    requirements=ai_mission.requirements,
                    expected_evidence=ai_mission.expected_evidence,
                    status="pending",
                )
                db.add(db_mission)
                db.commit()
                db.refresh(db_mission)
                return db_mission

        except Exception as e:
            logger.warning(f"AI Mission Generator error: {e}. Falling back to deterministic mission builder.")

    # 2. Deterministic Fallback Mission Generation
    gap = perform_gap_analysis(db, role.id, user.id)
    missing_skills = gap.get("missing", [])
    developing_skills = gap.get("developing", [])

    target_skills = []
    if custom_focus_skills:
        target_skills = custom_focus_skills
    elif missing_skills:
        target_skills = missing_skills[:2]
    elif developing_skills:
        target_skills = developing_skills[:2]
    else:
        target_skills = ["Advanced Architecture", "System Design"]

    target_str = ", ".join(target_skills)
    title = f"Bridge Skill Gap: {target_str} for {role.name}"
    description = (
        f"Hands-on project mission designed to upgrade your capabilities in {target_str}. "
        f"Successfully executing this mission will generate verifiable evidence for the {role.name} career path."
    )

    requirements = [
        f"Implement a real-world repository or microservice demonstrating hands-on mastery of {target_str}.",
        "Include automated unit or integration tests with >80% code coverage.",
        "Add a comprehensive README.md detailing architectural decisions and deployment instructions.",
        "Deploy the project to a public cloud provider or Docker container demo.",
    ]

    expected_evidence = [
        f"Public GitHub repository with {target_str} implementation",
        "CI/CD test run badge or coverage report",
        "Working live demo URL or architectural walkthrough video",
    ]

    mission = Mission(
        user_id=user.id,
        role_id=role.id,
        title=title,
        description=description,
        requirements=requirements,
        expected_evidence=expected_evidence,
        status="pending",
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


def get_mission_by_id(db: Session, mission_id: int, user_id: Optional[int] = None) -> Mission:
    """Retrieves single mission by ID."""
    user = get_user_profile(db, user_id)
    mission = db.query(Mission).filter(Mission.id == mission_id, Mission.user_id == user.id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found."
        )
    return mission
