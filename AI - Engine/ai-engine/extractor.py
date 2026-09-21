"""
Skill Extraction Engine for SkillGraph.
Extracts evidence-backed skills using local Ollama LLM with strict Pydantic validation,
and provides robust deterministic fallback rules when Ollama is offline or fails.
"""

import json
import logging
from typing import Dict, List, Optional, Any, Set
from validators import (
    SkillExtractionResult,
    ExtractedSkill,
    EvidenceItem,
    EvidenceType,
    ConfidenceLevel,
    StudentProfileInput,
    AcademicRecord,
    HackathonRecord,
)
from skill_mapper import SkillMapper
from prompts import (
    SKILL_EXTRACTION_SYSTEM_PROMPT,
    SKILL_EXTRACTION_USER_PROMPT,
)
from ollama_client import OllamaClient, OllamaClientError

logger = logging.getLogger("ai_engine.extractor")


class SkillExtractor:
    """
    Extracts evidence-backed technical skills from multiple modalities:
    - GitHub repositories & dependencies
    - Academic courses & grades
    - Hackathon technical contributions
    - Project descriptions and READMEs
    - Claimed skills
    """

    def __init__(
        self,
        ollama_client: Optional[OllamaClient] = None,
        use_fallback_on_error: bool = True,
    ):
        self.ollama_client = ollama_client or OllamaClient()
        self.use_fallback_on_error = use_fallback_on_error

    def extract(self, profile: StudentProfileInput) -> SkillExtractionResult:
        """
        Primary entry point. Attempts LLM extraction first if Ollama is available,
        otherwise falls back to deterministic rule-based extraction.
        """
        if self.ollama_client.is_available():
            try:
                logger.info("Ollama is online. Attempting LLM skill extraction...")
                return self.extract_with_llm(profile)
            except OllamaClientError as e:
                logger.warning(f"Ollama extraction failed: {e}. Checking fallback setting...")
                if self.use_fallback_on_error:
                    logger.info("Activating deterministic fallback extraction.")
                    return self.extract_with_fallback(profile)
                raise
            except Exception as e:
                logger.error(f"Unexpected error in LLM extraction: {e}")
                if self.use_fallback_on_error:
                    return self.extract_with_fallback(profile)
                raise
        else:
            logger.info("Ollama offline/unavailable. Using deterministic fallback extraction.")
            return self.extract_with_fallback(profile)

    def extract_with_llm(self, profile: StudentProfileInput) -> SkillExtractionResult:
        """
        Formats student profile into a prompt, sends to Ollama,
        and validates structured response against SkillExtractionResult.
        """
        # Serialize profile into clean readable text for prompt
        profile_dict = profile.model_dump()
        formatted_profile = json.dumps(profile_dict, indent=2)

        prompt = SKILL_EXTRACTION_USER_PROMPT.format(profile_data=formatted_profile)
        result: SkillExtractionResult = self.ollama_client.generate_json(
            prompt=prompt,
            system_prompt=SKILL_EXTRACTION_SYSTEM_PROMPT,
            model_cls=SkillExtractionResult,
        )

        # Post-process: Normalize skill names and verify category mapping
        normalized_skills: List[ExtractedSkill] = []
        for s in result.skills:
            norm_name = SkillMapper.normalize_skill(s.name)
            category = SkillMapper.get_category(norm_name)
            s.name = norm_name
            s.category = category
            normalized_skills.append(s)

        result.skills = normalized_skills
        return result

    def extract_with_fallback(self, profile: StudentProfileInput) -> SkillExtractionResult:
        """
        Deterministic, rule-based extraction engine.
        Guarantees that the hackathon demo works reliably without an active LLM.
        Applies strict evidence-backed principles:
        - Python repo -> Python evidence
        - FastAPI dependency -> FastAPI evidence
        - PostgreSQL dependency -> PostgreSQL evidence
        - React dependency -> React evidence
        - Dockerfile -> Docker evidence
        - DBMS A+ -> DBMS academic exposure (NOT expert)
        - Hackathon -> separates participation from technical contribution
        - Unverified contributions are flagged
        """
        skill_evidence_map: Dict[str, Dict[str, Any]] = {}

        def add_evidence(
            skill_name: str,
            ev_type: EvidenceType,
            reason: str,
            source: Optional[str] = None,
            verified: bool = False,
            confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM,
        ):
            norm_skill = SkillMapper.normalize_skill(skill_name)
            if norm_skill not in skill_evidence_map:
                skill_evidence_map[norm_skill] = {
                    "name": norm_skill,
                    "category": SkillMapper.get_category(norm_skill),
                    "confidence": confidence,
                    "evidence": [],
                }

            # Update confidence if higher confidence evidence is observed
            current_conf = skill_evidence_map[norm_skill]["confidence"]
            if confidence == ConfidenceLevel.HIGH or (
                confidence == ConfidenceLevel.MEDIUM and current_conf == ConfidenceLevel.LOW
            ):
                skill_evidence_map[norm_skill]["confidence"] = confidence

            # Append evidence item
            evidence_item = EvidenceItem(
                type=ev_type,
                reason=reason,
                source=source,
                verified=verified,
            )
            skill_evidence_map[norm_skill]["evidence"].append(evidence_item)

        # 1. Process GitHub Repositories & Dependencies
        for repo in profile.repositories_metadata:
            repo_name = repo.get("name", "unnamed-repo")
            languages = repo.get("languages", {})
            dependencies = repo.get("dependencies", [])
            topics = repo.get("topics", [])
            has_dockerfile = repo.get("has_dockerfile", False)
            verified_author = repo.get("is_author_verified", True)

            verification_note = "" if verified_author else " (unverified contribution)"
            verified_flag = bool(verified_author)

            # Check languages
            for lang, bytes_count in languages.items():
                confidence = ConfidenceLevel.HIGH if (verified_flag and bytes_count > 1000) else ConfidenceLevel.MEDIUM
                add_evidence(
                    skill_name=lang,
                    ev_type=EvidenceType.GITHUB,
                    reason=f"{lang} detected as code language in repository '{repo_name}'{verification_note}",
                    source=repo_name,
                    verified=verified_flag,
                    confidence=confidence,
                )

            # Check dependencies
            for dep in dependencies:
                dep_lower = dep.lower()
                matched_skill = None
                if "fastapi" in dep_lower:
                    matched_skill = "FastAPI"
                elif "flask" in dep_lower:
                    matched_skill = "Flask"
                elif "django" in dep_lower:
                    matched_skill = "Django"
                elif "psycopg" in dep_lower or "asyncpg" in dep_lower or "postgres" in dep_lower:
                    matched_skill = "PostgreSQL"
                elif "react" in dep_lower:
                    matched_skill = "React"
                elif "next" in dep_lower:
                    matched_skill = "Next.js"
                elif "pytest" in dep_lower:
                    matched_skill = "Pytest"
                elif "sqlalchemy" in dep_lower:
                    matched_skill = "SQL"
                elif "torch" in dep_lower:
                    matched_skill = "PyTorch"
                elif "tensorflow" in dep_lower:
                    matched_skill = "TensorFlow"
                elif "pandas" in dep_lower:
                    matched_skill = "Pandas"

                if matched_skill:
                    add_evidence(
                        skill_name=matched_skill,
                        ev_type=EvidenceType.GITHUB,
                        reason=f"Declared dependency '{dep}' in repository '{repo_name}'{verification_note}",
                        source=repo_name,
                        verified=verified_flag,
                        confidence=ConfidenceLevel.HIGH if verified_flag else ConfidenceLevel.MEDIUM,
                    )

            # Check Dockerfile
            if has_dockerfile:
                add_evidence(
                    skill_name="Docker",
                    ev_type=EvidenceType.GITHUB,
                    reason=f"Dockerfile detected in repository '{repo_name}'{verification_note}",
                    source=repo_name,
                    verified=verified_flag,
                    confidence=ConfidenceLevel.HIGH if verified_flag else ConfidenceLevel.MEDIUM,
                )

            # Check topics
            for topic in topics:
                norm_topic = SkillMapper.normalize_skill(topic)
                if norm_topic in SkillMapper.expand_skill_graph([topic]):
                    add_evidence(
                        skill_name=norm_topic,
                        ev_type=EvidenceType.GITHUB,
                        reason=f"Repository topic tag '{topic}' in '{repo_name}'",
                        source=repo_name,
                        verified=verified_flag,
                        confidence=ConfidenceLevel.LOW,
                    )

        # 2. Process Academic Records
        for record in profile.academic_records:
            # Academic grade is EXPOSURE, not expert!
            reason = (
                f"Completed academic course '{record.course_name}' with grade '{record.grade}'. "
                f"Confirms academic exposure (does not automatically imply production mastery)."
            )
            # Default exposed skills from course name if not specified
            exposed = list(record.skills_exposed)
            c_name_lower = record.course_name.lower()
            if "dbms" in c_name_lower or "database" in c_name_lower:
                exposed.extend(["DBMS", "SQL"])
            elif "dsa" in c_name_lower or "data structures" in c_name_lower or "algorithms" in c_name_lower:
                exposed.append("Data Structures & Algorithms")
            elif "operating systems" in c_name_lower or "os" == c_name_lower:
                exposed.append("Operating Systems")
            elif "network" in c_name_lower:
                exposed.append("Computer Networks")
            elif "python" in c_name_lower:
                exposed.append("Python")

            for exp_skill in set(exposed):
                add_evidence(
                    skill_name=exp_skill,
                    ev_type=EvidenceType.ACADEMIC,
                    reason=reason,
                    source=record.course_name,
                    verified=True,
                    confidence=ConfidenceLevel.MEDIUM if record.grade in ["A+", "A", "O", "10", "9"] else ConfidenceLevel.LOW,
                )

        # 3. Process Hackathon Records
        for h in profile.hackathon_records:
            # Participation alone NEVER proves technical skills!
            if not h.technical_evidence:
                # Only attendance
                continue

            for tech in h.technical_evidence:
                add_evidence(
                    skill_name=tech,
                    ev_type=EvidenceType.HACKATHON,
                    reason=(
                        f"Technical contribution '{tech}' demonstrated in project "
                        f"'{h.project_name or 'Hackathon Project'}' during '{h.hackathon_name}'"
                    ),
                    source=h.hackathon_name,
                    verified=True,
                    confidence=ConfidenceLevel.HIGH,
                )

        # 4. Process Project Descriptions & READMEs
        for desc in profile.project_descriptions:
            desc_lower = desc.lower()
            keywords_to_check = [
                ("fastapi", "FastAPI"),
                ("flask", "Flask"),
                ("django", "Django"),
                ("react", "React"),
                ("next.js", "Next.js"),
                ("docker", "Docker"),
                ("postgresql", "PostgreSQL"),
                ("postgres", "PostgreSQL"),
                ("sqlite", "SQLite"),
                ("mongodb", "MongoDB"),
                ("redis", "Redis"),
                ("pytest", "Pytest"),
                ("git", "Git"),
            ]
            for kw, skill in keywords_to_check:
                if kw in desc_lower:
                    add_evidence(
                        skill_name=skill,
                        ev_type=EvidenceType.PROJECT,
                        reason=f"Referenced implementation of {skill} in project documentation/description",
                        source="Project Description",
                        verified=False,
                        confidence=ConfidenceLevel.MEDIUM,
                    )

        # 5. Process Claimed Skills (from resume or self-declaration)
        for claimed in profile.claimed_skills:
            norm_claimed = SkillMapper.normalize_skill(claimed)
            # Only add if not already present, or add as claimed evidence
            add_evidence(
                skill_name=norm_claimed,
                ev_type=EvidenceType.CLAIMED,
                reason=f"Self-claimed by student in profile/resume without verifiable repository or course audit",
                source="Student Claim",
                verified=False,
                confidence=ConfidenceLevel.LOW,
            )

        # Build output structure
        extracted_skills: List[ExtractedSkill] = []
        for s_data in skill_evidence_map.values():
            extracted_skills.append(
                ExtractedSkill(
                    name=s_data["name"],
                    category=s_data["category"],
                    confidence=s_data["confidence"],
                    evidence=s_data["evidence"],
                )
            )

        return SkillExtractionResult(skills=extracted_skills)
