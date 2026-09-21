"""
Unit tests for Academic Evidence interpretation.
Verifies that academic grades prove academic exposure, never automatic expertise.
"""

import pytest
from ai_engine import (
    SkillExtractor,
    GapEngine,
    StudentProfileInput,
    AcademicRecord,
    EvidenceType,
    ConfidenceLevel,
)


def test_academic_grade_yields_exposure_not_expert():
    """
    Verifies:
    DBMS A+ -> Academic evidence -> DBMS exposure.
    Does NOT automatically convert A+ to expert/production mastery.
    """
    profile = StudentProfileInput(
        academic_records=[
            AcademicRecord(
                course_name="Database Management Systems",
                grade="A+",
                skills_exposed=["DBMS", "SQL"],
            )
        ]
    )

    extractor = SkillExtractor()
    result = extractor.extract_with_fallback(profile)

    dbms_skill = next(s for s in result.skills if s.name == "DBMS")
    assert dbms_skill is not None

    # Evidence type must be academic
    assert any(e.type == EvidenceType.ACADEMIC for e in dbms_skill.evidence)

    # Reason must state academic exposure explicitly
    academic_ev = next(e for e in dbms_skill.evidence if e.type == EvidenceType.ACADEMIC)
    assert "academic exposure" in academic_ev.reason.lower()
    assert "does not automatically imply production mastery" in academic_ev.reason.lower()


def test_academic_evidence_alone_is_developing_in_gap_engine():
    """
    When a student only has academic coursework (even with A+),
    the Gap Engine should classify it as 'developing' rather than 'strong'.
    """
    profile = StudentProfileInput(
        academic_records=[
            AcademicRecord(
                course_name="Database Management Systems",
                grade="A+",
                skills_exposed=["SQL", "PostgreSQL"],
            )
        ]
    )

    extractor = SkillExtractor()
    extracted = extractor.extract_with_fallback(profile)

    gap_engine = GapEngine()
    gap_result = gap_engine._analyze_with_fallback(extracted, target_role="Backend Developer")

    # SQL or PostgreSQL should be in developing because it only has academic exposure
    assert "SQL" in gap_result.developing or "PostgreSQL" in gap_result.developing
    assert "SQL" not in gap_result.strong

    # The gap detail must explain the lack of independent practical code repository
    sql_detail = next(d for d in gap_result.gap_details if d.skill in ["SQL", "PostgreSQL"])
    assert "academic coursework confirms exposure" in sql_detail.reason.lower()
