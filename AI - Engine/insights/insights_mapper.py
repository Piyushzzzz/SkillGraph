"""
iNSIGHTS Data Mapper and Pydantic Schemas.
Defines input payloads, normalized context models, and transformation functions
for integrating external market intelligence into SkillGraph.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class InsightsInput(BaseModel):
    """
    Input payload sent to the iNSIGHTS service.
    Contains target role and skill breakdown without sensitive personal information.
    """
    target_role: str = Field(..., description="Target job role")
    student_skills: List[str] = Field(default_factory=list, description="Demonstrated student skills")
    developing_skills: List[str] = Field(default_factory=list, description="Skills under development")
    missing_skills: List[str] = Field(default_factory=list, description="Required skills with zero evidence")


class InsightsContext(BaseModel):
    """
    Normalized internal context provided by iNSIGHTS.
    Used by the Mission Generator to formulate practical project requirements.
    """
    role: str = Field(..., description="The evaluated professional role")
    relevant_skills: List[str] = Field(
        default_factory=list,
        description="Key industry skills associated with this role and gaps"
    )
    technology_context: List[str] = Field(
        default_factory=list,
        description="Core technical concepts (e.g., Containerization, Automated Testing, Cloud Deployment)"
    )
    project_opportunities: List[str] = Field(
        default_factory=list,
        description="High-value project archetypes relevant to the role and gaps"
    )
    recommended_evidence: List[str] = Field(
        default_factory=list,
        description="Concrete artifacts to establish proof (e.g., Dockerfile, Test results, Deployment URL)"
    )


class InsightsStatusResponse(BaseModel):
    """
    Health and status indicator for iNSIGHTS service.
    """
    status: str
    api_configured: bool
    api_url: Optional[str] = None
    cached_items_count: int = 0


class InsightsMapper:
    """
    Utility class to map, normalize, and validate raw external API responses
    into the canonical InsightsContext Pydantic model.
    """

    @classmethod
    def normalize_response(cls, raw_data: Dict[str, Any], fallback_role: str = "Developer") -> InsightsContext:
        """
        Takes raw dictionary (from external API or mock) and normalizes into InsightsContext.
        Handles variations in key naming (e.g. 'role' vs 'target_role', 'skills' vs 'relevant_skills').
        """
        role = raw_data.get("role") or raw_data.get("target_role") or fallback_role
        
        # Extract relevant skills
        skills = (
            raw_data.get("relevant_skills")
            or raw_data.get("skills")
            or raw_data.get("core_skills")
            or []
        )
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(",") if s.strip()]

        # Extract technology context
        tech_ctx = (
            raw_data.get("technology_context")
            or raw_data.get("tech_context")
            or raw_data.get("concepts")
            or []
        )
        if isinstance(tech_ctx, str):
            tech_ctx = [t.strip() for t in tech_ctx.split(",") if t.strip()]

        # Extract project opportunities
        projects = (
            raw_data.get("project_opportunities")
            or raw_data.get("projects")
            or raw_data.get("project_ideas")
            or []
        )
        if isinstance(projects, str):
            projects = [p.strip() for p in projects.split(",") if p.strip()]

        # Extract recommended evidence
        evidence = (
            raw_data.get("recommended_evidence")
            or raw_data.get("evidence")
            or raw_data.get("expected_artifacts")
            or []
        )
        if isinstance(evidence, str):
            evidence = [e.strip() for e in evidence.split(",") if e.strip()]

        return InsightsContext(
            role=role,
            relevant_skills=list(dict.fromkeys(skills)),
            technology_context=list(dict.fromkeys(tech_ctx)),
            project_opportunities=list(dict.fromkeys(projects)),
            recommended_evidence=list(dict.fromkeys(evidence)),
        )
