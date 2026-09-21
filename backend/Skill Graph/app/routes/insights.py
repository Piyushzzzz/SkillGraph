from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from app.schemas.common import APIResponse
from app.schemas.integrations import InsightsStatusResponse
from app.services.integration_service import get_insights_status
from app.utils.ai_bridge import get_insights_service, AI_ENGINE_AVAILABLE

router = APIRouter(prefix="/insights", tags=["Insights Integration"])


@router.get("/status", response_model=APIResponse[InsightsStatusResponse])
def check_insights_status():
    """Check AI Insights subsystem readiness, Ollama configuration, and cache."""
    status_data = get_insights_status()
    return APIResponse(
        success=True,
        data=status_data,
        message="Insights subsystem status retrieved."
    )


@router.post("/context")
def get_insights_context(payload: Dict[str, Any]):
    """
    Generate contextual market intelligence for a given target role and skill gaps.
    """
    if not AI_ENGINE_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI Engine is not loaded.")

    try:
        from insights import InsightsInput
        srv = get_insights_service()
        inp = InsightsInput(
            target_role=payload.get("target_role", "Software Developer"),
            student_skills=payload.get("student_skills", []),
            developing_skills=payload.get("developing_skills", []),
            missing_skills=payload.get("missing_skills", []),
        )
        ctx = srv.get_context(inp)
        return APIResponse(
            success=True,
            data=ctx.model_dump() if hasattr(ctx, "model_dump") else ctx.dict(),
            message="iNSIGHTS context generated."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate context: {str(e)}")


@router.get("/role/{role_id}")
def get_role_insights(role_id: str):
    """
    Fetch market benchmarks and expectations for a role identifier.
    """
    if not AI_ENGINE_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI Engine is not loaded.")

    try:
        srv = get_insights_service()
        ctx = srv.get_role_insights(role_id)
        return APIResponse(
            success=True,
            data=ctx.model_dump() if hasattr(ctx, "model_dump") else ctx.dict(),
            message=f"iNSIGHTS benchmarks for '{role_id}' retrieved."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve role details: {str(e)}")


@router.post("/recommendations")
def get_recommendations(payload: Dict[str, Any]):
    """
    Returns tailored project recommendations and evidence guidelines for bridging gaps.
    """
    if not AI_ENGINE_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI Engine is not loaded.")

    try:
        from insights import InsightsInput
        srv = get_insights_service()
        inp = InsightsInput(
            target_role=payload.get("target_role", "Software Developer"),
            student_skills=payload.get("student_skills", []),
            developing_skills=payload.get("developing_skills", []),
            missing_skills=payload.get("missing_skills", []),
        )
        ctx = srv.get_context(inp)
        return APIResponse(
            success=True,
            data={
                "role": ctx.role,
                "project_opportunities": ctx.project_opportunities,
                "recommended_evidence": ctx.recommended_evidence,
                "technology_context": ctx.technology_context,
                "relevant_skills": ctx.relevant_skills,
            },
            message="iNSIGHTS recommendations generated."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")
