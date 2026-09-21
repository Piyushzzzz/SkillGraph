"""
FastAPI Router for iNSIGHTS endpoints.
Exposes endpoints for status, context resolution, role benchmarks, and recommendations.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from .insights_mapper import InsightsInput, InsightsContext, InsightsStatusResponse
from .insights_service import InsightsService

router = APIRouter(prefix="/api/insights", tags=["iNSIGHTS"])

# Default singleton instance
_default_service = InsightsService()


def get_insights_service() -> InsightsService:
    return _default_service


@router.get("/status", response_model=InsightsStatusResponse)
def get_status(service: InsightsService = Depends(get_insights_service)):
    """
    Check connection and cache status of the iNSIGHTS service.
    """
    return service.get_status()


@router.post("/context", response_model=InsightsContext)
def get_context(
    payload: InsightsInput,
    service: InsightsService = Depends(get_insights_service),
):
    """
    Generate contextual market intelligence for a given target role and skill gaps.
    """
    try:
        return service.get_context(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate context: {str(e)}")


@router.get("/role/{role_id}", response_model=InsightsContext)
def get_role_details(
    role_id: str,
    service: InsightsService = Depends(get_insights_service),
):
    """
    Fetch market benchmarks and expectations for a role identifier.
    """
    try:
        return service.get_role_insights(role_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve role details: {str(e)}")


@router.post("/recommendations")
def get_recommendations(
    payload: InsightsInput,
    service: InsightsService = Depends(get_insights_service),
) -> Dict[str, Any]:
    """
    Returns tailored project recommendations and evidence guidelines for bridging gaps.
    """
    try:
        context = service.get_context(payload)
        return {
            "role": context.role,
            "project_opportunities": context.project_opportunities,
            "recommended_evidence": context.recommended_evidence,
            "technology_context": context.technology_context,
            "relevant_skills": context.relevant_skills,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommendations: {str(e)}")
