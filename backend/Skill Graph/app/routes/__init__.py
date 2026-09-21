from fastapi import APIRouter
from app.routes.profile import router as profile_router
from app.routes.academic import router as academic_router
from app.routes.evidence import router as evidence_router
from app.routes.skills import router as skills_router
from app.routes.roles import router as roles_router
from app.routes.gap_analysis import router as gap_router
from app.routes.mission import router as mission_router
from app.routes.github import router as github_router
from app.routes.insights import router as insights_router

api_router = APIRouter(prefix="/api")

api_router.include_router(profile_router)
api_router.include_router(academic_router)
api_router.include_router(evidence_router)
api_router.include_router(skills_router)
api_router.include_router(roles_router)
api_router.include_router(gap_router)
api_router.include_router(mission_router)
api_router.include_router(github_router)
api_router.include_router(insights_router)

__all__ = ["api_router"]
