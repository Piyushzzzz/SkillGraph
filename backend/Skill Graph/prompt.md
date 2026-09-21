You are STUDENT 2 in a 3-person team developing "SkillGraph".

YOUR RESPONSIBILITY:

You own:

1. FastAPI backend
2. PostgreSQL database
3. Database schema
4. SQLAlchemy models
5. API endpoints
6. Evidence management
7. Role data
8. Skill data
9. Skill graph data
10. Backend validation

You DO NOT build the frontend.

You DO NOT implement the main AI reasoning logic.

You DO NOT create a separate API architecture.

--------------------------------------------------
TECH STACK
--------------------------------------------------

Python
FastAPI
PostgreSQL
SQLAlchemy
Pydantic
Alembic

Supabase PostgreSQL can be used.

--------------------------------------------------
DATABASE
--------------------------------------------------

Create:

users

id
name
email
university
degree
branch
semester
cgpa
created_at
updated_at

subjects

id
user_id
name
grade
credits

evidence

id
user_id
type
title
description
source_url
date
verification_status
created_at

projects

id
evidence_id
project_name
role
contribution
technologies
github_url
demo_url

hackathons

id
evidence_id
hackathon_name
organization
project_name
team_name
role
contribution
technologies
github_url
demo_url
achievement

certificates

id
evidence_id
issuer
certificate_name
certificate_url

skills

id
name
category
description

skill_evidence

id
skill_id
evidence_id
confidence
reason

roles

id
name
description

role_skills

id
role_id
skill_id
importance

skill_graph_edges

id
source_skill_id
target_skill_id
relationship

missions

id
user_id
role_id
title
description
requirements
expected_evidence
status
created_at

--------------------------------------------------
API
--------------------------------------------------

PROFILE:

GET /api/profile

PUT /api/profile

ACADEMIC:

GET /api/academic

POST /api/academic

EVIDENCE:

GET /api/evidence

POST /api/evidence

GET /api/evidence/{id}

DELETE /api/evidence/{id}

PROJECT:

POST /api/evidence/project

HACKATHON:

POST /api/evidence/hackathon

CERTIFICATE:

POST /api/evidence/certificate

SKILLS:

GET /api/skills

GET /api/skills/{id}

GET /api/skills/graph

ROLES:

GET /api/roles

GET /api/roles/{id}

GAP:

GET /api/gap-analysis/{role_id}

MISSION:

POST /api/mission/generate

GET /api/mission/{id}

GITHUB:

GET /api/github/status

POST /api/github/connect

INSIGHTS:

GET /api/insights/status

--------------------------------------------------
RESPONSE FORMAT
--------------------------------------------------

Use:

{
  "success": true,
  "data": {},
  "message": "..."
}

Errors:

{
  "success": false,
  "data": null,
  "message": "..."
}

--------------------------------------------------
SKILL GRAPH
--------------------------------------------------

GET /api/skills/graph

Return:

{
  "nodes": [
    {
      "id": "python",
      "label": "Python",
      "category": "programming",
      "evidence_count": 3
    }
  ],
  "edges": [
    {
      "source": "python",
      "target": "fastapi",
      "relationship": "used_with"
    }
  ]
}

This response must be directly usable by React Flow.

--------------------------------------------------
INITIAL SKILLS
--------------------------------------------------

Seed:

Python
Java
C++
JavaScript
TypeScript
React
Next.js
FastAPI
Node.js
SQL
PostgreSQL
MongoDB
DSA
OOP
DBMS
Computer Networks
REST API
Git
Docker
Testing
Cloud
Machine Learning
LLM
Cybersecurity

--------------------------------------------------
INITIAL ROLES
--------------------------------------------------

Seed:

Software Developer
Frontend Developer
Backend Developer
AI/ML Engineer
Cybersecurity Analyst

Create role-skill relationships.

Example:

Backend Developer:

Python
FastAPI
REST API
SQL
PostgreSQL
Git
Docker
Testing
Cloud

--------------------------------------------------
GAP ANALYSIS
--------------------------------------------------

The backend should compare:

Student evidence

against

Role required skills.

Return:

strong
developing
missing

Do not create arbitrary AI scores.

Example:

{
  "role": "Backend Developer",

  "strong": [
    "Python",
    "SQL"
  ],

  "developing": [
    "Docker"
  ],

  "missing": [
    "Testing",
    "Cloud"
  ]
}

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------

backend/

app/
├── main.py
├── database.py
├── models/
├── schemas/
├── routes/
├── services/
├── seed/
└── utils/

Create:

requirements.txt
.env.example
README.md

--------------------------------------------------
ENV
--------------------------------------------------

DATABASE_URL=
GITHUB_TOKEN=
INSIGHTS_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

--------------------------------------------------
VALIDATION
--------------------------------------------------

Use Pydantic.

Validate:

CGPA
semester
grades
URLs
required fields
evidence types

Use proper HTTP status codes.

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Do not put business logic directly inside route files.

Use:

routes
↓
services
↓
database

Keep the backend modular.

The AI developer will later connect to your services.

Do not change API endpoint names without agreement with Student 1.

--------------------------------------------------
DELIVERABLE
--------------------------------------------------

Provide:

• FastAPI backend
• PostgreSQL schema
• SQLAlchemy models
• Alembic migrations
• Seed data
• API documentation
• README
• .env.example
• Sample API responses
• Basic tests

Run:

pip install -r requirements.txt

uvicorn app.main:app --reload