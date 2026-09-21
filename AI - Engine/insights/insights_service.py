"""
High-Level iNSIGHTS Service for SkillGraph.
Coordinates the external client, in-memory caching, response mapping,
and local deterministic fallbacks when external services are unavailable.
"""

import logging
from typing import List, Dict, Optional, Any
from .insights_client import InsightsClient, InsightsClientError
from .insights_mapper import (
    InsightsInput,
    InsightsContext,
    InsightsMapper,
    InsightsStatusResponse,
)
from .insights_cache import InsightsCache

logger = logging.getLogger("insights.service")

# Deterministic fallback knowledge base for local generation
FALLBACK_TECH_CONTEXT_MAP: Dict[str, Dict[str, Any]] = {
    "docker": {
        "concept": "Containerization",
        "evidence": "Dockerfile and multi-stage container build",
        "project": "Containerized Service Architecture",
    },
    "testing": {
        "concept": "Automated Testing",
        "evidence": "Pytest test suite with CI workflow",
        "project": "Test-Driven Development API",
    },
    "pytest": {
        "concept": "Automated Testing",
        "evidence": "Pytest suite with integration tests",
        "project": "Robust Backend Service with High Test Coverage",
    },
    "cloud": {
        "concept": "Cloud Deployment",
        "evidence": "Live Cloud Deployment URL",
        "project": "Cloud-Native Microservice",
    },
    "aws": {
        "concept": "Cloud Infrastructure",
        "evidence": "AWS deployment configuration or Terraform IaC",
        "project": "AWS Serverless or ECS Deployment",
    },
    "fastapi": {
        "concept": "High-Performance REST APIs",
        "evidence": "Structured OpenAPI specification and validation",
        "project": "Production REST API with Async Support",
    },
    "postgresql": {
        "concept": "Relational Data Modeling & Migrations",
        "evidence": "Relational schema design and Alembic migrations",
        "project": "Scalable Relational Database Backend",
    },
    "sql": {
        "concept": "Relational Persistence",
        "evidence": "SQL schemas and queries",
        "project": "Database-Backed Management System",
    },
    "react": {
        "concept": "Component-Driven Frontend Architecture",
        "evidence": "Interactive React component hierarchy",
        "project": "Modern SPA with State Management",
    },
    "next.js": {
        "concept": "Server-Side Rendering & App Router",
        "evidence": "Next.js pages and API routes",
        "project": "Fullstack SSR Web Application",
    },
    "git": {
        "concept": "Version Control & CI/CD",
        "evidence": "GitHub Actions workflow with passing status",
        "project": "Automated Continuous Integration Pipeline",
    },
}


class InsightsService:
    """
    Main service interface for iNSIGHTS.
    Guarantees reliable contextual intelligence with cache-first lookup
    and resilient local fallback execution.
    """

    def __init__(
        self,
        client: Optional[InsightsClient] = None,
        cache: Optional[InsightsCache] = None,
    ):
        self.client = client or InsightsClient()
        self.cache = cache or InsightsCache()

    def get_status(self) -> InsightsStatusResponse:
        """
        Check health and status of iNSIGHTS integration.
        """
        return InsightsStatusResponse(
            status="healthy",
            api_configured=self.client.is_configured,
            api_url=self.client.api_url,
            cached_items_count=self.cache.size(),
        )

    def get_context(self, payload: InsightsInput) -> InsightsContext:
        """
        Primary entry point.
        Checks cache -> attempts external client -> falls back gracefully.
        """
        # 1. Check Cache
        cached = self.cache.get(payload.target_role, payload.missing_skills)
        if cached is not None:
            return cached

        # 2. Try External Client
        try:
            logger.info(f"Querying external iNSIGHTS for role '{payload.target_role}'...")
            raw_response = self.client.fetch_context(payload)
            context = InsightsMapper.normalize_response(raw_response, fallback_role=payload.target_role)
            self.cache.set(payload.target_role, payload.missing_skills, context)
            return context
        except InsightsClientError as e:
            logger.warning(f"External iNSIGHTS call failed ({e}). Switching to local deterministic fallback.")
        except Exception as e:
            logger.error(f"Unexpected error in iNSIGHTS client ({e}). Switching to local fallback.")

        # 3. Fallback to Local Knowledge Base
        fallback_context = self.get_fallback_context(
            target_role=payload.target_role,
            missing_skills=payload.missing_skills,
            student_skills=payload.student_skills,
        )

        # Cache fallback result so repeated calls are instantaneous
        self.cache.set(payload.target_role, payload.missing_skills, fallback_context)
        return fallback_context

    def get_fallback_context(
        self,
        target_role: str,
        missing_skills: List[str],
        student_skills: Optional[List[str]] = None,
    ) -> InsightsContext:
        """
        Deterministic, local fallback context generator.
        Maps gaps (e.g. Docker, Testing, Cloud) into industry concepts:
        - Docker -> Containerization
        - Testing -> Automated Testing
        - Cloud -> Cloud Deployment
        """
        tech_context: List[str] = []
        projects: List[str] = []
        evidence: List[str] = [
            "GitHub repository with clean commit history",
            "Comprehensive README and architecture documentation",
        ]
        relevant_skills = list(missing_skills) + (student_skills[:3] if student_skills else [])

        for skill in missing_skills:
            skill_lower = skill.strip().lower()
            matched = False
            for k, info in FALLBACK_TECH_CONTEXT_MAP.items():
                if k in skill_lower:
                    tech_context.append(info["concept"])
                    evidence.append(info["evidence"])
                    projects.append(info["project"])
                    matched = True
                    break

            if not matched:
                tech_context.append(f"{skill} Best Practices")
                evidence.append(f"Practical implementation of {skill}")
                projects.append(f"{skill} Feature Module")

        # Deduplicate while preserving order
        tech_context = list(dict.fromkeys(tech_context)) or ["Production Engineering Standards"]
        projects = list(dict.fromkeys(projects)) or [f"Production-Grade {target_role} System"]
        evidence = list(dict.fromkeys(evidence))

        return InsightsContext(
            role=target_role,
            relevant_skills=list(dict.fromkeys(relevant_skills)),
            technology_context=tech_context,
            project_opportunities=projects,
            recommended_evidence=evidence,
        )

    def get_role_insights(self, role_id: str) -> InsightsContext:
        """
        Retrieve standardized market insights for a specific role ID/name.
        """
        # Try client first
        try:
            raw = self.client.fetch_role_details(role_id)
            return InsightsMapper.normalize_response(raw, fallback_role=role_id)
        except Exception as e:
            logger.info(f"Using fallback role insights for '{role_id}': {e}")
            # Map common role templates
            return self.get_fallback_context(
                target_role=role_id,
                missing_skills=["Docker", "Testing", "Cloud"],
            )
