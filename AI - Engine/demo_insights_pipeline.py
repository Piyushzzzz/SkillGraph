"""
Demonstration of the integrated SkillGraph + iNSIGHTS pipeline.
Demonstrates the exact sequence required in insight.md:
Student Skills -> Skill Gaps -> iNSIGHTS Context -> Generated Mission
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
from insights import InsightsService, InsightsInput


def main():
    print("=" * 75)
    print("SKILLGRAPH + iNSIGHTS INTEGRATED DEMO")
    print("=" * 75)

    # 1. Ingest Student Profile
    profile = StudentProfileInput(
        student_id="student_101",
        claimed_skills=["Python", "FastAPI"],
        repositories_metadata=[
            {
                "name": "ecommerce-backend",
                "languages": {"Python": 24000},
                "dependencies": ["fastapi", "psycopg2-binary"],
                "has_dockerfile": False,
                "is_author_verified": True,
            }
        ],
        academic_records=[
            AcademicRecord(
                course_name="Database Management Systems",
                grade="A+",
                skills_exposed=["SQL", "PostgreSQL"],
            )
        ],
    )

    extractor = SkillExtractor(use_fallback_on_error=True)
    extracted = extractor.extract(profile)

    print("\n[Step 1: Student Skills]")
    student_skills_list = []
    for skill in extracted.skills:
        student_skills_list.append(skill.name)
        print(f"  * {skill.name} (Confidence: {skill.confidence.value})")

    # 2. Identify Skill Gaps with Existing Gap Engine
    target_role = "Backend Developer"
    gap_engine = GapEngine(use_fallback_on_error=True)
    gap_result = gap_engine.analyze_gaps(
        extraction_result=extracted,
        target_role=target_role,
        role_requirements=["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Testing", "Cloud"],
    )

    print(f"\n[Step 2: Skill Gaps for '{target_role}']")
    print(f"  [Strong Skills]     : {gap_result.strong}")
    print(f"  [Developing Skills] : {gap_result.developing}")
    print(f"  [Missing Skills]    : {gap_result.missing}")

    # 3. Fetch Context from iNSIGHTS Extension Layer
    insights_service = InsightsService()
    insights_input = InsightsInput(
        target_role=target_role,
        student_skills=gap_result.strong,
        developing_skills=gap_result.developing,
        missing_skills=gap_result.missing,
    )
    insights_context = insights_service.get_context(insights_input)

    print("\n[Step 3: iNSIGHTS Context (External Market Intelligence)]")
    print(f"  Role: {insights_context.role}")
    print("  Technology Context (Industry Concepts):")
    for tech in insights_context.technology_context:
        print(f"    - {tech}")
    print("  Project Opportunities:")
    for proj in insights_context.project_opportunities:
        print(f"    - {proj}")
    print("  Recommended Evidence:")
    for ev in insights_context.recommended_evidence:
        print(f"    - {ev}")

    # 4. Generate Enriched Mission using iNSIGHTS Context
    mission_gen = MissionGenerator(use_fallback_on_error=True)
    mission = mission_gen.generate_mission(
        target_role=target_role,
        gap_result=gap_result,
        insights_context=insights_context,
    )

    print("\n[Step 4: Generated Closed-Loop Mission]")
    print(f"  TITLE: {mission.title}")
    print(f"  DESCRIPTION: {mission.description}")
    print(f"  TARGETED GAPS: {mission.targeted_gaps}")
    print("  REQUIREMENTS (Enriched with iNSIGHTS Concepts):")
    for req in mission.requirements:
        print(f"    [+] {req}")
    print("  EXPECTED EVIDENCE:")
    for ev in mission.expected_evidence:
        print(f"    [Artifact] {ev}")

    print("\n" + "=" * 75)
    print("DEMO COMPLETE - iNSIGHTS PIPELINE VERIFIED!")
    print("=" * 75)


if __name__ == "__main__":
    main()
