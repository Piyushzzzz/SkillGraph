"""
Unit tests for Hackathon Evidence interpretation.
Verifies strict separation of event participation from technical contribution.
"""

import pytest
from ai_engine import (
    SkillExtractor,
    StudentProfileInput,
    HackathonRecord,
    EvidenceType,
    ConfidenceLevel,
)


def test_hackathon_participation_without_technical_contribution_yields_no_skills():
    """
    Hackathon participation alone (empty technical_evidence) must NEVER
    confer technical skills like Python or FastAPI to the student.
    """
    profile = StudentProfileInput(
        hackathon_records=[
            HackathonRecord(
                hackathon_name="National Hackathon 2026",
                participation=True,
                technical_evidence=[],  # No technical contribution recorded
                project_name="IdeaPitch",
                role="Attendee / Presenter",
            )
        ]
    )

    extractor = SkillExtractor()
    result = extractor.extract_with_fallback(profile)

    # No skills should be inferred from mere attendance
    assert len(result.skills) == 0


def test_hackathon_technical_contribution_generates_verified_evidence():
    """
    Concrete technical contributions during a hackathon produce verified
    hackathon evidence.
    """
    profile = StudentProfileInput(
        hackathon_records=[
            HackathonRecord(
                hackathon_name="Smart India Hackathon",
                participation=True,
                technical_evidence=["FastAPI", "PostgreSQL"],
                project_name="AI Campus Hub",
                role="Backend Lead",
            )
        ]
    )

    extractor = SkillExtractor()
    result = extractor.extract_with_fallback(profile)

    skill_names = {s.name for s in result.skills}
    assert "FastAPI" in skill_names
    assert "PostgreSQL" in skill_names

    fastapi_skill = next(s for s in result.skills if s.name == "FastAPI")
    hackathon_ev = next(e for e in fastapi_skill.evidence if e.type == EvidenceType.HACKATHON)
    assert hackathon_ev.verified is True
    assert "Smart India Hackathon" in hackathon_ev.source
    assert fastapi_skill.confidence == ConfidenceLevel.HIGH
