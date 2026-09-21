"""
Unit tests for Gap Reasoning Engine.
Verifies categorical breakdown (strong, developing, missing), granular gap details,
and strict avoidance of fake precision percentages.
"""

import pytest
from ai_engine import (
    GapEngine,
    SkillExtractionResult,
    ExtractedSkill,
    EvidenceItem,
    EvidenceType,
    ConfidenceLevel,
    SkillCategory,
    GapAnalysisResult,
)


def test_gap_analysis_categorization_and_details():
    """
    Test that gap engine accurately sorts skills into:
    - strong (verified code repository evidence)
    - developing (academic or limited evidence)
    - missing (no evidence)
    """
    extracted = SkillExtractionResult(
        skills=[
            ExtractedSkill(
                name="Python",
                category=SkillCategory.PROGRAMMING,
                confidence=ConfidenceLevel.HIGH,
                evidence=[
                    EvidenceItem(
                        type=EvidenceType.GITHUB,
                        reason="Python repository backend-api",
                        source="backend-api",
                        verified=True,
                    )
                ],
            ),
            ExtractedSkill(
                name="FastAPI",
                category=SkillCategory.BACKEND,
                confidence=ConfidenceLevel.HIGH,
                evidence=[
                    EvidenceItem(
                        type=EvidenceType.GITHUB,
                        reason="FastAPI dependency declared in repo",
                        source="backend-api",
                        verified=True,
                    )
                ],
            ),
            ExtractedSkill(
                name="Docker",
                category=SkillCategory.CLOUD,
                confidence=ConfidenceLevel.LOW,
                evidence=[
                    EvidenceItem(
                        type=EvidenceType.CLAIMED,
                        reason="Self-claimed on profile",
                        source="Claim",
                        verified=False,
                    )
                ],
            ),
        ]
    )

    gap_engine = GapEngine()
    result = gap_engine._analyze_with_fallback(
        extraction_result=extracted,
        target_role="Backend Developer",
    )

    assert isinstance(result, GapAnalysisResult)
    assert "Python" in result.strong
    assert "FastAPI" in result.strong
    assert "Docker" in result.developing

    # Testing should be missing because no evidence exists
    assert "Testing" in result.missing

    # Check gap detail for Testing
    testing_detail = next(d for d in result.gap_details if d.skill == "Testing")
    assert testing_detail is not None
    assert "no repository, dependency" in testing_detail.reason.lower()
    assert len(testing_detail.required_evidence) > 0


def test_no_fake_precision_in_output():
    """
    Verifies that the gap analysis result does NOT output numerical fake precision
    such as '83.7% match' or 'readiness_percentage'.
    """
    extracted = SkillExtractionResult(skills=[])
    gap_engine = GapEngine()
    result = gap_engine._analyze_with_fallback(
        extraction_result=extracted,
        target_role="Backend Developer",
    )

    result_dict = result.model_dump()
    # Confirm no numeric percentage fields exist in the schema
    assert "percentage" not in result_dict
    assert "match_score" not in result_dict
    assert "readiness_score" not in result_dict
    # Confirm summary does not claim a decimal percentage
    if result.summary:
        assert "%" not in result.summary
