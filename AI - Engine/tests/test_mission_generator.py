"""
Unit tests for Mission Generator.
Verifies targeted gap closure, closed-loop evidence expectations, and fallback generator.
"""

import pytest
from ai_engine import (
    MissionGenerator,
    GapAnalysisResult,
    SkillGapDetail,
    ProjectMission,
)


def test_mission_generation_targets_gaps():
    """
    Test that the mission generator produces a concrete mission targeting
    the student's missing and developing competencies.
    """
    gap_result = GapAnalysisResult(
        target_role="Backend Developer",
        strong=["Python", "FastAPI"],
        developing=["Docker"],
        missing=["Testing", "PostgreSQL"],
        gap_details=[
            SkillGapDetail(
                skill="Testing",
                reason="No tests found.",
                current_evidence=[],
                required_evidence=["Pytest suite with CI"],
            ),
            SkillGapDetail(
                skill="PostgreSQL",
                reason="No database schema found.",
                current_evidence=[],
                required_evidence=["PostgreSQL database project"],
            ),
        ],
    )

    generator = MissionGenerator()
    mission = generator._generate_with_fallback(
        target_role="Backend Developer",
        gap_result=gap_result,
    )

    assert isinstance(mission, ProjectMission)
    assert "BACKEND" in mission.title.upper()

    # Must target the missing/developing gaps
    assert "Testing" in mission.targeted_gaps
    assert "PostgreSQL" in mission.targeted_gaps
    assert "Docker" in mission.targeted_gaps

    # Must have concrete requirements addressing gaps
    reqs_text = " ".join(mission.requirements).lower()
    assert "docker" in reqs_text
    assert "test" in reqs_text

    # Must expect tangible evidence for the closed loop
    ev_text = " ".join(mission.expected_evidence).lower()
    assert "github repository" in ev_text
    assert "readme" in ev_text
    assert "test" in ev_text
    assert "deployment" in ev_text
