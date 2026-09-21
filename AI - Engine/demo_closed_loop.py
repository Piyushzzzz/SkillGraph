"""
End-to-End demonstration of the SkillGraph Intelligence Layer (Student 3).
Demonstrates:
1. Profile Ingestion (GitHub + Academic + Hackathon)
2. Evidence-Backed Skill Extraction
3. iNSIGHTS Role Context
4. Gap Reasoning Engine (No Fake Precision)
5. Closed-Loop Mission Generation
"""

import json
from ai_engine import (
    SkillExtractor,
    GapEngine,
    MissionGenerator,
    StudentProfileInput,
    AcademicRecord,
    HackathonRecord,
)
from services import InsightsService


def main():
    print("=" * 70)
    print("SKILLGRAPH INTELLIGENCE LAYER (STUDENT 3) - E2E PIPELINE")
    print("=" * 70)

    # 1. Mock Student Input Data
    profile = StudentProfileInput(
        student_id="student_402",
        claimed_skills=["Python", "FastAPI", "Docker", "Machine Learning"],
        github_username="student402",
        repositories_metadata=[
            {
                "name": "fastapi-inventory",
                "languages": {"Python": 18500},
                "dependencies": ["fastapi", "uvicorn", "psycopg2-binary"],
                "has_dockerfile": False,
                "is_author_verified": True,
                "topics": ["backend", "rest-api"],
            },
            {
                "name": "forked-big-repo",
                "languages": {"C++": 40000},
                "dependencies": [],
                "has_dockerfile": False,
                "is_author_verified": False,  # Unverified contribution
                "topics": [],
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
                hackathon_name="National Fintech Hackathon",
                participation=True,
                technical_evidence=["FastAPI REST endpoints", "PostgreSQL database schema"],
                project_name="PayRoute",
                role="Backend Developer",
            )
        ],
        project_descriptions=[
            "Built a modular inventory API using FastAPI and PostgreSQL for catalog indexing."
        ],
    )

    print("\n[Step 1] Ingesting Student Profile:")
    print(f"  - Claimed: {profile.claimed_skills}")
    print(f"  - Repositories: {[r['name'] for r in profile.repositories_metadata]}")
    print(f"  - Academic: {[f'{a.course_name} ({a.grade})' for a in profile.academic_records]}")
    print(f"  - Hackathon: {[h.hackathon_name for h in profile.hackathon_records]}")

    # 2. Extract Skills
    extractor = SkillExtractor(use_fallback_on_error=True)
    extracted = extractor.extract(profile)

    print("\n[Step 2] Extracted Evidence-Backed Skills:")
    for skill in extracted.skills:
        print(f"  * {skill.name} [{skill.category.value}] (Confidence: {skill.confidence.value})")
        for ev in skill.evidence:
            ver_tag = "[VERIFIED]" if ev.verified else "[UNVERIFIED]"
            print(f"     |-- {ver_tag} ({ev.type.value}): {ev.reason}")

    # 3. Fetch iNSIGHTS for Target Role
    insights = InsightsService()
    target_role = "Backend Developer"
    role_info = insights.get_role_requirements(target_role)
    print(f"\n[Step 3] iNSIGHTS Role Context for '{target_role}':")
    print(f"  - Summary: {role_info['summary']}")
    print(f"  - Core Skills: {role_info['core_skills']}")

    # 4. Gap Reasoning Engine
    gap_engine = GapEngine(use_fallback_on_error=True)
    gap_result = gap_engine.analyze_gaps(
        extraction_result=extracted,
        target_role=target_role,
        role_requirements=role_info["core_skills"],
    )

    print("\n[Step 4] Gap Reasoning (Explainable Categories - No Fake Precision):")
    print(f"  [STRONG]     : {gap_result.strong}")
    print(f"  [DEVELOPING] : {gap_result.developing}")
    print(f"  [MISSING]    : {gap_result.missing}")
    print("\n  Detailed Gap Explanations:")
    for detail in gap_result.gap_details:
        print(f"    - Skill: {detail.skill}")
        print(f"      Reason: {detail.reason}")
        print(f"      Required Evidence: {detail.required_evidence}")

    # 5. Mission Generation (Closed Loop)
    mission_gen = MissionGenerator(use_fallback_on_error=True)
    mission = mission_gen.generate_mission(
        target_role=target_role,
        gap_result=gap_result,
        context_info=role_info["summary"],
    )

    print("\n[Step 5] Generated Closed-Loop Project Mission:")
    print(f"  TITLE: {mission.title}")
    print(f"  TARGETED GAPS: {mission.targeted_gaps}")
    print("  TECHNICAL REQUIREMENTS:")
    for req in mission.requirements:
        print(f"    [+] {req}")
    print("  EXPECTED TANGIBLE EVIDENCE (FOR SKILLGRAPH INGESTION):")
    for ev in mission.expected_evidence:
        print(f"    [Artifact] {ev}")
    print("  MILESTONES:")
    for m in mission.milestones:
        print(f"    -> {m}")

    print("\n" + "=" * 70)
    print("PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    main()
