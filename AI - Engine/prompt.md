You are STUDENT 3 in a 3-person team developing "SkillGraph".

YOUR RESPONSIBILITY:

You own the intelligence layer:

1. Ollama LLM integration
2. AI skill extraction
3. Evidence interpretation
4. GitHub analysis
5. Skill mapping
6. Gap reasoning
7. iNSIGHTS integration
8. Mission generation

You DO NOT build the frontend.

You DO NOT redesign the database.

You DO NOT change the API contract without coordinating with Student 2.

--------------------------------------------------
LLM
--------------------------------------------------

Use Ollama locally.

Architecture:

FastAPI
   ↓
Ollama
   ↓
Local LLM
   ↓
Structured JSON
   ↓
Pydantic validation
   ↓
Database

Do NOT hardcode one model throughout the application.

Use:

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=<model-name>

The model should be configurable through .env.

--------------------------------------------------
AI PRINCIPLE
--------------------------------------------------

SkillGraph must be evidence-backed.

Never claim:

"Hackathon participation means the student has Python."

Instead:

Hackathon
↓
Project
↓
Contribution
↓
Technology
↓
Evidence
↓
Skill

Separate:

1. Claimed skill
2. Academic exposure
3. Project exposure
4. Demonstrated practical evidence

--------------------------------------------------
SKILL EXTRACTION
--------------------------------------------------

Input:

Project description
README
GitHub metadata
Hackathon contribution
Resume
Academic information

Output structured JSON:

{
  "skills": [
    {
      "name": "Python",
      "evidence": [
        {
          "type": "github",
          "reason": "Python detected in repository"
        }
      ],
      "confidence": "high"
    }
  ]
}

The LLM MUST return structured JSON.

Validate the output before storing it.

--------------------------------------------------
GITHUB
--------------------------------------------------

Create:

services/github_service.py

Functions:

get_user()
get_repositories()
get_repository()
get_repository_languages()
get_readme()

Analyze:

Repository name
Description
Languages
README
Topics
Dependencies
Recent activity

Do not claim that a student personally implemented code unless contribution evidence exists.

If contribution cannot be verified:

mark it as:

"unverified contribution"

--------------------------------------------------
SKILL ONTOLOGY
--------------------------------------------------

Use these categories:

Programming
Frontend
Backend
Database
Cloud
AI/ML
Cybersecurity
Computer Science Fundamentals
Development Practices

Examples:

Python
→ FastAPI
→ REST API
→ Backend Development

SQL
→ PostgreSQL
→ Database Development

React
→ Next.js
→ Frontend Development

Git
→ Version Control

DSA
→ Problem Solving

--------------------------------------------------
ACADEMIC EVIDENCE
--------------------------------------------------

Academic grades are evidence of academic exposure.

Example:

DBMS A+
↓
Academic evidence
↓
DBMS exposure

Do NOT automatically convert:

A+ = expert

Academic evidence should be combined with project/code evidence.

--------------------------------------------------
HACKATHON EVIDENCE
--------------------------------------------------

Separate:

Participation

from:

Technical contribution

Example:

{
  "participation": true,

  "technical_evidence": [
    "FastAPI backend",
    "PostgreSQL schema"
  ]
}

--------------------------------------------------
GAP ENGINE
--------------------------------------------------

Input:

Student evidence
Target role

Output:

strong
developing
missing

Example:

{
  "strong": [
    "Python",
    "SQL",
    "REST API"
  ],

  "developing": [
    "Docker"
  ],

  "missing": [
    "Testing",
    "Cloud"
  ]
}

For every missing skill provide:

skill
reason
current_evidence
required_evidence

Example:

{
  "skill": "Docker",

  "reason":
  "No Docker project or repository evidence was found.",

  "current_evidence": [],

  "required_evidence": [
    "Dockerized project"
  ]
}

IMPORTANT:

Do not create fake precision like:

"Student is 83.7% ready."

Use explainable categories instead.

--------------------------------------------------
iNSIGHTS
--------------------------------------------------

Create:

services/insights_service.py

Use iNSIGHTS for contextual information such as:

Role requirements
Technology context
Industry information
Project ideas
Learning resources

Do NOT use iNSIGHTS as proof of a student's personal skills.

--------------------------------------------------
MISSION GENERATOR
--------------------------------------------------

Input:

Target role
Strong skills
Developing skills
Missing skills
Contextual information

Generate a practical project mission.

Example:

Missing:

Docker
Testing
Cloud

Generate:

BUILD AND DEPLOY A PRODUCTION REST API

Requirements:

FastAPI
PostgreSQL
Authentication
Docker
Testing
Cloud

Expected evidence:

GitHub repository
README
Deployment URL
Test results
Architecture diagram

The mission should create evidence that can later be added to SkillGraph.

--------------------------------------------------
CLOSED LOOP
--------------------------------------------------

The system must support:

Student

↓
Evidence

↓
SkillGraph

↓
Target Role

↓
Skill Gap

↓
Mission

↓
Project

↓
New Evidence

↓
Updated SkillGraph

--------------------------------------------------
FALLBACK MODE
--------------------------------------------------

The system MUST work even if Ollama is unavailable.

Create deterministic fallback rules.

Example:

Python repository
→ Python evidence

FastAPI dependency
→ FastAPI evidence

PostgreSQL dependency
→ PostgreSQL evidence

React dependency
→ React evidence

Dockerfile
→ Docker evidence

This ensures the hackathon demo does not fail because of the LLM.

--------------------------------------------------
AI STRUCTURE
--------------------------------------------------

Create:

ai-engine/

extractor.py
skill_mapper.py
gap_engine.py
mission_generator.py
prompts.py
validators.py
ollama_client.py

services/

github_service.py
insights_service.py

--------------------------------------------------
OLLAMA CLIENT
--------------------------------------------------

Create a reusable client.

Do NOT call Ollama directly from every function.

Use:

ollama_client.py

Functions:

generate()
generate_json()

Handle:

timeouts
connection errors
invalid JSON
empty responses

--------------------------------------------------
PROMPT ENGINEERING
--------------------------------------------------

Keep prompts in:

prompts.py

Create separate prompts for:

skill extraction
evidence classification
gap explanation
mission generation

Do not duplicate prompts throughout the code.

--------------------------------------------------
VALIDATION
--------------------------------------------------

Pipeline:

User data
↓
Prompt
↓
Ollama
↓
JSON
↓
Pydantic
↓
Business validation
↓
Database

Never directly trust LLM output.

--------------------------------------------------
TESTS
--------------------------------------------------

Create tests for:

Skill extraction
GitHub parsing
Academic evidence
Hackathon evidence
Gap analysis
Mission generation
Ollama failure
Invalid JSON

--------------------------------------------------
DELIVERABLE
--------------------------------------------------

Provide:

• Ollama integration
• AI extraction
• GitHub analysis
• Skill mapping
• Gap engine
• Mission generator
• iNSIGHTS service
• Fallback rules
• Tests
• README
• .env.example

The system should run even without an external paid LLM API.