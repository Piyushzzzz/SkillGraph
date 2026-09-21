"""
Gap Reasoning Engine for SkillGraph.
Analyzes student verified skills against target roles.
Strictly produces explainable categories (strong, developing, missing)
with clear evidence justifications, explicitly avoiding fake precision percentages.
"""

import json
import logging
from typing import Dict, List, Optional, Any, Set
from validators import (
    GapAnalysisResult,
    SkillGapDetail,
    SkillExtractionResult,
    ExtractedSkill,
    ConfidenceLevel,
    EvidenceType,
)
from skill_mapper import SkillMapper
from prompts import (
    GAP_ANALYSIS_SYSTEM_PROMPT,
    GAP_ANALYSIS_USER_PROMPT,
)
from ollama_client import OllamaClient, OllamaClientError

logger = logging.getLogger("ai_engine.gap_engine")


# Role definitions used for deterministic fallback and guidance
STANDARD_ROLE_REQUIREMENTS: Dict[str, Dict[str, Any]] = {
    "Backend Developer": {
        "core_skills": ["Python", "REST API", "FastAPI", "SQL", "PostgreSQL", "Docker", "Testing", "Git"],
        "recommended_evidence": {
            "Python": "Python repository with backend logic",
            "REST API": "Documented REST endpoints with schema validation",
            "FastAPI": "FastAPI routes and dependency injection",
            "SQL": "Database queries and relational modeling",
            "PostgreSQL": "PostgreSQL connection and migrations",
            "Docker": "Dockerfile and docker-compose setup",
            "Testing": "Automated test suite using pytest",
            "Git": "Version-controlled commits with clear history",
        },
    },
    "Frontend Developer": {
        "core_skills": ["JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS", "Testing", "Git"],
        "recommended_evidence": {
            "JavaScript": "Modern ES6+ frontend code",
            "TypeScript": "Typed components and interfaces",
            "React": "Component state management and hooks",
            "Next.js": "Server-side rendering or App router implementation",
            "HTML": "Semantic HTML layout",
            "CSS": "Responsive CSS or Tailwind layout",
            "Testing": "Component unit tests with Jest/Vitest",
            "Git": "Version-controlled frontend repository",
        },
    },
    "Fullstack Developer": {
        "core_skills": ["JavaScript", "React", "Python", "FastAPI", "SQL", "Docker", "Testing", "Git"],
        "recommended_evidence": {
            "JavaScript": "Frontend interactive UI",
            "React": "Single-page application client",
            "Python": "Backend server scripts and services",
            "FastAPI": "RESTful backend endpoints",
            "SQL": "Relational database schema and persistence",
            "Docker": "Multi-container setup with frontend and backend",
            "Testing": "Integration or end-to-end test coverage",
            "Git": "Monorepo or multi-repo version control",
        },
    },
    "AI/ML Engineer": {
        "core_skills": ["Python", "Machine Learning", "PyTorch", "Pandas", "NumPy", "Data Structures & Algorithms", "Git"],
        "recommended_evidence": {
            "Python": "Data processing and modeling scripts",
            "Machine Learning": "Trained models with evaluation metrics",
            "PyTorch": "Neural network architecture and training loop",
            "Pandas": "Dataframe transformations and cleaning",
            "NumPy": "Vectorized computations",
            "Data Structures & Algorithms": "Algorithmic problem solving and complexity optimization",
            "Git": "Reproducible model repository with code and data pipelines",
        },
    },
}


class GapEngine:
    """
    Evaluates student evidence against a target professional role.
    Categorizes skills into 'strong', 'developing', and 'missing'.
    Provides actionable reasons and required evidence for every gap.
    """

    def __init__(
        self,
        ollama_client: Optional[OllamaClient] = None,
        use_fallback_on_error: bool = True,
    ):
        self.ollama_client = ollama_client or OllamaClient()
        self.use_fallback_on_error = use_fallback_on_error

    def analyze_gaps(
        self,
        extraction_result: SkillExtractionResult,
        target_role: str,
        role_requirements: Optional[List[str]] = None,
    ) -> GapAnalysisResult:
        """
        Main entry point for gap reasoning.
        Tries LLM reasoning first, falls back to deterministic analysis.
        """
        if self.ollama_client.is_available():
            try:
                logger.info(f"Analyzing skill gaps for role '{target_role}' using Ollama...")
                return self._analyze_with_llm(extraction_result, target_role, role_requirements)
            except OllamaClientError as e:
                logger.warning(f"Ollama gap analysis failed: {e}. Falling back to deterministic rules.")
                if self.use_fallback_on_error:
                    return self._analyze_with_fallback(extraction_result, target_role, role_requirements)
                raise
            except Exception as e:
                logger.error(f"Unexpected error in LLM gap analysis: {e}")
                if self.use_fallback_on_error:
                    return self._analyze_with_fallback(extraction_result, target_role, role_requirements)
                raise
        else:
            logger.info("Ollama unavailable. Using deterministic fallback gap analysis.")
            return self._analyze_with_fallback(extraction_result, target_role, role_requirements)

    def _analyze_with_llm(
        self,
        extraction_result: SkillExtractionResult,
        target_role: str,
        role_requirements: Optional[List[str]] = None,
    ) -> GapAnalysisResult:
        """
        Uses Ollama to generate an explainable gap analysis.
        """
        student_skills_data = extraction_result.model_dump()
        formatted_skills = json.dumps(student_skills_data, indent=2)

        req_list = role_requirements or STANDARD_ROLE_REQUIREMENTS.get(target_role, {}).get("core_skills", [])
        formatted_reqs = ", ".join(req_list) if req_list else "Standard industry requirements for " + target_role

        prompt = GAP_ANALYSIS_USER_PROMPT.format(
            target_role=target_role,
            role_requirements=formatted_reqs,
            student_skills=formatted_skills,
        )

        result: GapAnalysisResult = self.ollama_client.generate_json(
            prompt=prompt,
            system_prompt=GAP_ANALYSIS_SYSTEM_PROMPT,
            model_cls=GapAnalysisResult,
        )

        # Normalize skill names in the output lists
        result.strong = [SkillMapper.normalize_skill(s) for s in result.strong]
        result.developing = [SkillMapper.normalize_skill(s) for s in result.developing]
        result.missing = [SkillMapper.normalize_skill(s) for s in result.missing]

        return result

    def _analyze_with_fallback(
        self,
        extraction_result: SkillExtractionResult,
        target_role: str,
        role_requirements: Optional[List[str]] = None,
    ) -> GapAnalysisResult:
        """
        Deterministic, rule-based gap analysis.
        Follows strict evidence evaluation:
        - Strong: verified practical code/project evidence with high/medium confidence.
        - Developing: academic exposure only, unverified contribution, or low depth.
        - Missing: role requires it, but student has no evidence.
        """
        role_info = STANDARD_ROLE_REQUIREMENTS.get(target_role, {})
        core_skills: List[str] = (
            role_requirements
            if role_requirements
            else role_info.get("core_skills", ["Programming", "Git", "Testing"])
        )
        recommended_ev = role_info.get("recommended_evidence", {})

        # Index student skills by normalized name
        student_skills_map: Dict[str, ExtractedSkill] = {}
        # Also build expanded set of implied skills from parent relationships
        for s in extraction_result.skills:
            norm_name = SkillMapper.normalize_skill(s.name)
            student_skills_map[norm_name] = s
            # If student has a specialized skill (e.g. FastAPI), also map parent (Python, REST API)
            parents = SkillMapper.get_parent_skills(norm_name)
            for p in parents:
                norm_parent = SkillMapper.normalize_skill(p)
                if norm_parent not in student_skills_map:
                    # Inherit parent skill with developing/medium confidence unless already present
                    student_skills_map[norm_parent] = ExtractedSkill(
                        name=norm_parent,
                        category=SkillMapper.get_category(norm_parent),
                        confidence=ConfidenceLevel.MEDIUM if s.confidence == ConfidenceLevel.HIGH else ConfidenceLevel.LOW,
                        evidence=s.evidence,
                    )

        strong: List[str] = []
        developing: List[str] = []
        missing: List[str] = []
        gap_details: List[SkillGapDetail] = []

        for req_skill in core_skills:
            norm_req = SkillMapper.normalize_skill(req_skill)

            if norm_req not in student_skills_map:
                # Skill is completely missing
                missing.append(norm_req)
                req_evidence = recommended_ev.get(norm_req, f"Demonstrated practical implementation of {norm_req}")
                gap_details.append(
                    SkillGapDetail(
                        skill=norm_req,
                        reason=f"No repository, dependency, hackathon, or academic evidence found for '{norm_req}'.",
                        current_evidence=[],
                        required_evidence=[req_evidence],
                    )
                )
            else:
                student_skill = student_skills_map[norm_req]
                evidence_types = {e.type for e in student_skill.evidence}
                all_unverified = all(not e.verified for e in student_skill.evidence)

                # Check if it's academic exposure only
                academic_only = evidence_types == {EvidenceType.ACADEMIC}
                claimed_only = evidence_types == {EvidenceType.CLAIMED}

                if claimed_only or all_unverified:
                    developing.append(norm_req)
                    gap_details.append(
                        SkillGapDetail(
                            skill=norm_req,
                            reason=f"Skill '{norm_req}' is claimed or unverified without audited code repositories.",
                            current_evidence=[e.reason for e in student_skill.evidence],
                            required_evidence=[f"Verified GitHub repository implementing {norm_req}"],
                        )
                    )
                elif academic_only:
                    developing.append(norm_req)
                    gap_details.append(
                        SkillGapDetail(
                            skill=norm_req,
                            reason=(
                                f"Academic coursework confirms exposure to '{norm_req}', "
                                f"but lacks independent practical project or code repository evidence."
                            ),
                            current_evidence=[e.reason for e in student_skill.evidence],
                            required_evidence=[
                                f"Hands-on project repository demonstrating practical use of {norm_req}"
                            ],
                        )
                    )
                elif student_skill.confidence in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]:
                    strong.append(norm_req)
                else:
                    developing.append(norm_req)
                    gap_details.append(
                        SkillGapDetail(
                            skill=norm_req,
                            reason=f"Limited practical depth detected for '{norm_req}'.",
                            current_evidence=[e.reason for e in student_skill.evidence],
                            required_evidence=[recommended_ev.get(norm_req, f"Production-grade project with {norm_req}")],
                        )
                    )

        summary = (
            f"Evaluated {len(core_skills)} core competencies for '{target_role}'. "
            f"Found {len(strong)} strong competencies, {len(developing)} developing competencies, "
            f"and {len(missing)} missing competencies requiring targeted projects."
        )

        return GapAnalysisResult(
            target_role=target_role,
            strong=strong,
            developing=developing,
            missing=missing,
            gap_details=gap_details,
            summary=summary,
        )
