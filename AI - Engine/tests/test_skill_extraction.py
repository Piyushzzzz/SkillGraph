"""
Unit tests for Skill Extraction.
Verifies LLM extraction, deterministic fallback extraction, and evidence-backing principles.
"""

from unittest.mock import MagicMock
import pytest
from ai_engine import (
    SkillExtractor,
    StudentProfileInput,
    SkillExtractionResult,
    ExtractedSkill,
    EvidenceItem,
    EvidenceType,
    ConfidenceLevel,
    SkillCategory,
    AcademicRecord,
    HackathonRecord,
)


def test_deterministic_fallback_skill_extraction():
    """
    Test extraction using deterministic fallback rules:
    - Python repo -> Python evidence
    - FastAPI dependency -> FastAPI evidence
    - PostgreSQL dependency -> PostgreSQL evidence
    - Dockerfile -> Docker evidence
    """
    profile = StudentProfileInput(
        student_id="student-123",
        claimed_skills=["Python", "FastAPI"],
        repositories_metadata=[
            {
                "name": "backend-service",
                "languages": {"Python": 15000},
                "dependencies": ["fastapi", "psycopg2-binary"],
                "has_dockerfile": True,
                "is_author_verified": True,
                "topics": ["rest-api"],
            }
        ],
        academic_records=[
            AcademicRecord(
                course_name="Database Management Systems",
                grade="A+",
                skills_exposed=["DBMS", "SQL"],
            )
        ],
        hackathon_records=[
            HackathonRecord(
                hackathon_name="HackIndia 2026",
                participation=True,
                technical_evidence=["FastAPI backend", "PostgreSQL schema"],
                project_name="EduGraph",
            )
        ],
    )

    extractor = SkillExtractor(use_fallback_on_error=True)
    # Force fallback
    result = extractor.extract_with_fallback(profile)

    assert isinstance(result, SkillExtractionResult)
    skill_names = {s.name for s in result.skills}

    # Verify detected skills
    assert "Python" in skill_names
    assert "FastAPI" in skill_names
    assert "PostgreSQL" in skill_names
    assert "Docker" in skill_names
    assert "DBMS" in skill_names

    # Check that Python has high confidence and GitHub evidence
    python_skill = next(s for s in result.skills if s.name == "Python")
    assert python_skill.confidence in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]
    assert any(e.type == EvidenceType.GITHUB for e in python_skill.evidence)

    # Check that Docker has Dockerfile evidence
    docker_skill = next(s for s in result.skills if s.name == "Docker")
    assert any("Dockerfile" in e.reason for e in docker_skill.evidence)


def test_unverified_github_contribution():
    """
    Verify that if author contribution is unverified, it is explicitly flagged
    and not treated as verified code evidence.
    """
    profile = StudentProfileInput(
        repositories_metadata=[
            {
                "name": "forked-big-project",
                "languages": {"Rust": 50000},
                "dependencies": [],
                "has_dockerfile": False,
                "is_author_verified": False,
            }
        ]
    )

    extractor = SkillExtractor()
    result = extractor.extract_with_fallback(profile)

    rust_skill = next(s for s in result.skills if s.name == "Rust")
    assert any("unverified contribution" in e.reason for e in rust_skill.evidence)
    assert all(not e.verified for e in rust_skill.evidence)


def test_llm_skill_extraction_mocked():
    """
    Test extraction using mocked Ollama JSON response.
    """
    mock_ollama = MagicMock()
    mock_ollama.is_available.return_value = True
    mock_ollama.generate_json.return_value = SkillExtractionResult(
        skills=[
            ExtractedSkill(
                name="Python",
                category=SkillCategory.PROGRAMMING,
                confidence=ConfidenceLevel.HIGH,
                evidence=[
                    EvidenceItem(
                        type=EvidenceType.GITHUB,
                        reason="Primary language in fastapi-repo",
                        source="fastapi-repo",
                        verified=True,
                    )
                ],
            )
        ]
    )

    extractor = SkillExtractor(ollama_client=mock_ollama)
    profile = StudentProfileInput(claimed_skills=["Python"])
    result = extractor.extract(profile)

    assert len(result.skills) == 1
    assert result.skills[0].name == "Python"
    assert result.skills[0].category == SkillCategory.PROGRAMMING
    assert result.skills[0].evidence[0].verified is True
