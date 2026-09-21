"""
Mission Generator for SkillGraph.
Creates targeted, closed-loop project missions designed to bridge skill gaps
and produce verifiable evidence (code repo, README, tests, deployment).
Supports contextual market intelligence injection from iNSIGHTS.
"""

import json
import logging
from typing import Dict, List, Optional, Any, Union
from validators import ProjectMission, GapAnalysisResult
from prompts import (
    MISSION_GENERATION_SYSTEM_PROMPT,
    MISSION_GENERATION_USER_PROMPT,
)
from ollama_client import OllamaClient, OllamaClientError

logger = logging.getLogger("ai_engine.mission_generator")


class MissionGenerator:
    """
    Synthesizes actionable project missions based on identified skill gaps.
    Every mission is closed-loop: it outlines explicit expected artifacts
    (GitHub repo, README, tests, deployment) that can be ingested back into SkillGraph.
    Optionally enriches missions with iNSIGHTS contextual market intelligence.
    """

    def __init__(
        self,
        ollama_client: Optional[OllamaClient] = None,
        use_fallback_on_error: bool = True,
    ):
        self.ollama_client = ollama_client or OllamaClient()
        self.use_fallback_on_error = use_fallback_on_error

    def generate_mission(
        self,
        target_role: str,
        gap_result: GapAnalysisResult,
        context_info: Optional[Union[str, Any]] = None,
        insights_context: Optional[Any] = None,
    ) -> ProjectMission:
        """
        Main entry point for mission generation.
        Accepts optional insights_context to enrich mission requirements and expected evidence.
        Tries Ollama LLM first, falling back to deterministic template generation.
        """
        # Resolve insights_context if passed in context_info or dedicated parameter
        resolved_insights = insights_context
        if resolved_insights is None and hasattr(context_info, "technology_context"):
            resolved_insights = context_info

        if self.ollama_client.is_available():
            try:
                logger.info(f"Generating mission for role '{target_role}' using Ollama...")
                return self._generate_with_llm(target_role, gap_result, context_info, resolved_insights)
            except OllamaClientError as e:
                logger.warning(f"Ollama mission generation failed: {e}. Using deterministic fallback.")
                if self.use_fallback_on_error:
                    return self._generate_with_fallback(target_role, gap_result, context_info, resolved_insights)
                raise
            except Exception as e:
                logger.error(f"Unexpected error in LLM mission generation: {e}")
                if self.use_fallback_on_error:
                    return self._generate_with_fallback(target_role, gap_result, context_info, resolved_insights)
                raise
        else:
            logger.info("Ollama unavailable. Using deterministic fallback mission generator.")
            return self._generate_with_fallback(target_role, gap_result, context_info, resolved_insights)

    def _generate_with_llm(
        self,
        target_role: str,
        gap_result: GapAnalysisResult,
        context_info: Optional[Union[str, Any]] = None,
        insights_context: Optional[Any] = None,
    ) -> ProjectMission:
        """
        Calls Ollama to generate a tailored project mission incorporating iNSIGHTS context.
        """
        # Build enriched context string
        context_parts = []
        if isinstance(context_info, str) and context_info:
            context_parts.append(context_info)

        if insights_context is not None:
            if hasattr(insights_context, "technology_context") and insights_context.technology_context:
                context_parts.append(f"iNSIGHTS Technology Context: {', '.join(insights_context.technology_context)}")
            if hasattr(insights_context, "project_opportunities") and insights_context.project_opportunities:
                context_parts.append(f"iNSIGHTS Project Opportunities: {', '.join(insights_context.project_opportunities)}")
            if hasattr(insights_context, "recommended_evidence") and insights_context.recommended_evidence:
                context_parts.append(f"iNSIGHTS Recommended Evidence: {', '.join(insights_context.recommended_evidence)}")

        final_context = "\n".join(context_parts) if context_parts else "Standard industry best practices"

        prompt = MISSION_GENERATION_USER_PROMPT.format(
            target_role=target_role,
            strong_skills=", ".join(gap_result.strong) or "None identified yet",
            developing_skills=", ".join(gap_result.developing) or "None identified yet",
            missing_skills=", ".join(gap_result.missing) or "None",
            context_info=final_context,
        )

        mission: ProjectMission = self.ollama_client.generate_json(
            prompt=prompt,
            system_prompt=MISSION_GENERATION_SYSTEM_PROMPT,
            model_cls=ProjectMission,
        )
        return mission

    def _generate_with_fallback(
        self,
        target_role: str,
        gap_result: GapAnalysisResult,
        context_info: Optional[Union[str, Any]] = None,
        insights_context: Optional[Any] = None,
    ) -> ProjectMission:
        """
        Deterministic, template-driven mission generator.
        Enriches requirements and evidence with iNSIGHTS technology concepts.
        """
        targeted_gaps = list(gap_result.missing) + [
            s for s in gap_result.developing if s not in gap_result.missing
        ]

        if not targeted_gaps:
            targeted_gaps = ["Advanced Architecture", "CI/CD & Monitoring"]

        # 1. Determine title: use iNSIGHTS project opportunity if available
        title = f"BUILD AND DEPLOY A PRODUCTION {target_role.upper()} SYSTEM"
        if insights_context and hasattr(insights_context, "project_opportunities") and insights_context.project_opportunities:
            preferred_proj = insights_context.project_opportunities[0]
            title = f"BUILD AND DEPLOY A {preferred_proj.upper()}"

        description = (
            f"A hands-on, end-to-end engineering mission specifically designed to demonstrate "
            f"practical mastery in {', '.join(targeted_gaps[:4])}."
        )

        requirements: List[str] = []
        # Leverage existing strong skills as the foundation
        foundation_skills = gap_result.strong[:2]
        if foundation_skills:
            requirements.append(f"Leverage core existing competencies: {', '.join(foundation_skills)}")

        # Build specific requirements addressing targeted gaps
        for gap in targeted_gaps:
            gap_lower = gap.lower()
            if "docker" in gap_lower:
                requirements.append("Containerize service with multi-stage Dockerfile and docker-compose")
            elif "testing" in gap_lower or "pytest" in gap_lower:
                requirements.append("Implement comprehensive unit and integration test suite (pytest/unittest) with CI runner")
            elif "cloud" in gap_lower or "aws" in gap_lower or "gcp" in gap_lower:
                requirements.append("Deploy containerized application to cloud infrastructure (Render, Fly.io, or AWS)")
            elif "fastapi" in gap_lower or "rest" in gap_lower:
                requirements.append("Design structured RESTful API with automated OpenAPI docs and input validation")
            elif "sql" in gap_lower or "postgres" in gap_lower or "database" in gap_lower:
                requirements.append("Implement relational database schema with migrations (Alembic) and ORM persistence")
            elif "react" in gap_lower or "frontend" in gap_lower:
                requirements.append("Build responsive, accessible user interface consuming backend REST endpoints")
            elif "git" in gap_lower or "ci/cd" in gap_lower:
                requirements.append("Set up automated GitHub Actions workflow for linting, testing, and continuous deployment")
            elif "ai" in gap_lower or "ml" in gap_lower or "machine learning" in gap_lower:
                requirements.append("Integrate trained machine learning inference pipeline with structured API response")
            else:
                requirements.append(f"Implement production-grade module demonstrating practical use of {gap}")

        # Inject iNSIGHTS technology context concepts if available
        if insights_context and hasattr(insights_context, "technology_context"):
            for concept in insights_context.technology_context:
                concept_lower = concept.lower()
                # Check if concept isn't already covered in requirements
                if not any(concept_lower in r.lower() for r in requirements):
                    requirements.append(f"Adhere to industry standard for {concept}")

        # Ensure we have at least 4 clear requirements
        if len(requirements) < 4:
            requirements.extend([
                "Implement structured logging, error handling, and health-check endpoints",
                "Ensure environment variable configuration via .env file",
            ])

        # Formulate expected evidence
        expected_evidence = [
            "GitHub repository containing clean, documented source code",
            "Comprehensive README with architecture diagram, local setup instructions, and API documentation",
            "Automated test suite with passing test results in CI workflow",
            "Live deployment URL with active health-check verification",
            "Demonstrated commit history with verifiable author attribution",
        ]

        # Augment with iNSIGHTS recommended evidence if provided
        if insights_context and hasattr(insights_context, "recommended_evidence"):
            for rec_ev in insights_context.recommended_evidence:
                if not any(rec_ev.lower() in ev.lower() for ev in expected_evidence):
                    expected_evidence.append(rec_ev)

        milestones = [
            "Milestone 1: Repository setup, dependencies, and core data architecture",
            "Milestone 2: Implementation of core business logic and API endpoints",
            "Milestone 3: Automated test suite integration and edge case validation",
            "Milestone 4: Containerization with Docker and deployment to production cloud",
            "Milestone 5: Verification of evidence artifacts and ingestion into SkillGraph",
        ]

        return ProjectMission(
            title=title,
            target_role=target_role,
            description=description,
            targeted_gaps=targeted_gaps,
            requirements=requirements,
            expected_evidence=expected_evidence,
            milestones=milestones,
        )
