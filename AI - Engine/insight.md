You have already completed the main Student 3 implementation for SkillGraph.

DO NOT rebuild or rewrite the existing AI system.

Your existing implementation includes:

- Ollama integration
- Skill extraction
- Evidence interpretation
- GitHub analysis
- Skill mapping
- Gap engine
- Mission generation
- Fallback rules

Now add ONLY the iNSIGHTS integration as an extension to the existing system.

==================================================
OBJECTIVE
==================================================

Integrate iNSIGHTS into the existing SkillGraph pipeline.

The final flow must become:

Student Evidence
        ↓
SkillGraph
        ↓
Target Role
        ↓
Existing Gap Engine
        ↓
iNSIGHTS
        ↓
Existing Mission Generator
        ↓
Personalized Mission

Do not replace the existing Gap Engine.

Do not replace the existing Mission Generator.

Extend them.

==================================================
WHAT iNSIGHTS DOES
==================================================

SkillGraph determines:

"What skills does this student have evidence for?"

Gap Engine determines:

"What skills are missing for the selected target role?"

iNSIGHTS provides:

"What external/contextual information is relevant to those gaps?"

Use iNSIGHTS for:

- target-role context
- relevant technologies
- industry context
- technology trends
- relevant project types
- recommended evidence types
- learning/project context

iNSIGHTS MUST NOT be treated as evidence that the student possesses a skill.

==================================================
CREATE
==================================================

Add:

insights/

    insights_client.py
    insights_service.py
    insights_mapper.py
    insights_cache.py

Integrate these into the existing Student 3 architecture.

Do not unnecessarily restructure existing files.

==================================================
iNSIGHTS CLIENT
==================================================

Create a dedicated client responsible for communicating with iNSIGHTS.

Do not call iNSIGHTS directly from:

- gap_engine.py
- mission_generator.py
- frontend
- route handlers

Use:

insights_client.py
        ↓
external iNSIGHTS service

Keep API keys in environment variables.

Never expose the API key to the frontend.

==================================================
INPUT
==================================================

The iNSIGHTS service should receive contextual information such as:

{
    "target_role": "Backend Developer",

    "student_skills": [
        "Python",
        "FastAPI",
        "SQL",
        "PostgreSQL"
    ],

    "developing_skills": [
        "Docker"
    ],

    "missing_skills": [
        "Testing",
        "Cloud"
    ]
}

Do not send unnecessary personal information.

==================================================
NORMALIZED OUTPUT
==================================================

Regardless of the exact external response format, convert it into an internal structure similar to:

{
    "role": "Backend Developer",

    "relevant_skills": [
        "Python",
        "REST API",
        "Docker",
        "Testing",
        "Cloud"
    ],

    "technology_context": [
        "Containerization",
        "Automated Testing",
        "Cloud Deployment"
    ],

    "project_opportunities": [
        "Production REST API",
        "Microservice Deployment",
        "Cloud Backend"
    ],

    "recommended_evidence": [
        "Dockerfile",
        "Automated tests",
        "Deployment URL",
        "Architecture documentation"
    ]
}

Use Pydantic models to validate this output.

==================================================
INTEGRATION WITH EXISTING GAP ENGINE
==================================================

Do NOT move the responsibility of identifying student gaps to iNSIGHTS.

The existing Gap Engine remains responsible for:

strong
developing
missing

For example:

Existing Gap Engine:

strong:
Python
FastAPI
SQL

developing:
Docker

missing:
Testing
Cloud

Then pass this result to iNSIGHTS.

iNSIGHTS adds contextual information around these gaps.

==================================================
INTEGRATION WITH EXISTING MISSION GENERATOR
==================================================

Modify the existing Mission Generator so it can optionally receive:

1. Student skills
2. Strong skills
3. Developing skills
4. Missing skills
5. iNSIGHTS context

Example:

Student skills:
Python
FastAPI
PostgreSQL

Missing:
Docker
Testing
Cloud

iNSIGHTS context:
Containerization
Automated Testing
Cloud Deployment

Mission Generator:

"Build and Deploy a Production REST API"

Requirements:

FastAPI
PostgreSQL
Docker
Automated Testing
Cloud Deployment

Expected evidence:

GitHub repository
Dockerfile
Test suite
Deployment URL
Architecture diagram

The mission should directly address the student's actual gaps.

==================================================
IMPORTANT
==================================================

Do not allow iNSIGHTS to overwrite:

- student skills
- evidence
- grades
- GitHub evidence
- verified achievements

Those remain controlled by SkillGraph's evidence system.

iNSIGHTS is contextual intelligence only.

==================================================
FALLBACK
==================================================

If iNSIGHTS is unavailable:

DO NOT break the existing application.

Use a local fallback.

Example:

Backend Developer
+
Missing Docker
+
Missing Testing
+
Missing Cloud

Fallback context:

Docker → containerization
Testing → automated testing
Cloud → deployment

Then continue to the existing Mission Generator.

The user should still be able to generate a mission.

==================================================
CACHE
==================================================

Implement basic caching where appropriate.

Possible cache key:

target_role + missing_skills

Avoid unnecessary repeated iNSIGHTS requests.

==================================================
BACKEND API
==================================================

Expose the following through the existing FastAPI backend:

GET /api/insights/status

POST /api/insights/context

GET /api/insights/role/{role_id}

POST /api/insights/recommendations

Follow the existing API response format.

Do not break existing endpoints.

==================================================
ENVIRONMENT VARIABLES
==================================================

Add only the required variables to .env.example.

For example:

INSIGHTS_API_URL=
INSIGHTS_API_KEY=

Do not hardcode credentials.

==================================================
TESTING
==================================================

Add tests for:

1. iNSIGHTS connection
2. Successful response
3. Invalid response
4. Timeout
5. API failure
6. Fallback mode
7. Mapping iNSIGHTS response
8. Mission generation using iNSIGHTS context

==================================================
DEMO REQUIREMENT
==================================================

The final system should be able to demonstrate:

Student Skills
        ↓
Skill Gaps
        ↓
iNSIGHTS Context
        ↓
Generated Mission

Example:

Skill Gap:

Docker
Testing
Cloud

iNSIGHTS:

Containerization
Automated Testing
Cloud Deployment

Mission:

Build and Deploy a Production REST API

==================================================
FINAL REQUIREMENT
==================================================

Before finishing:

1. Inspect the existing Student 3 implementation.
2. Reuse the existing classes/functions where possible.
3. Do not duplicate existing logic.
4. Do not rewrite the entire AI engine.
5. Keep backward compatibility.
6. Document exactly which existing files were modified.
7. Document all new files.
8. Provide the final integration flow.

The goal is to ADD iNSIGHTS to the existing implementation, not rebuild Student 3.