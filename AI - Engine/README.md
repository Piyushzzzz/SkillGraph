# SkillGraph - Intelligence Layer (Student 3)

The **Intelligence Layer** of SkillGraph powers evidence-backed skill extraction, skill ontology mapping, gap reasoning, contextual market intelligence, and closed-loop project mission generation.

Built with a local, zero-cost architecture utilizing **Ollama** and robust **deterministic fallback engines**, ensuring the system never fails during live demonstrations or offline evaluation.

---

## 🏛️ System Architecture

```
FastAPI (Student 2)
       │
       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  SkillGraph Intelligence Layer (Student 3)                                │
│                                                                           │
│  ┌───────────────────────────────┐       ┌─────────────────────────────┐  │
│  │ services/                     │       │ ai-engine/                  │  │
│  │  • github_service.py          │       │  • ollama_client.py         │  │
│  │  • insights_service.py        │       │  • validators.py            │  │
│  └───────────────┬───────────────┘       │  • prompts.py               │  │
│                  │                       │  • skill_mapper.py          │  │
│                  ▼                       │  • extractor.py             │  │
│          Raw Evidence Data               │  • gap_engine.py            │  │
│                  │                       │  • mission_generator.py     │  │
│                  └──────────────────────►│  • fallback_rules.py        │  │
│                                          └──────────────┬──────────────┘  │
│  ┌───────────────────────────────┐                      │                 │
│  │ insights/ (Extension Layer)   │                      │                 │
│  │  • insights_client.py         │◄─────────────────────┘                 │
│  │  • insights_service.py        │                                        │
│  │  • insights_mapper.py         │─────────────────────► Enriched Mission │
│  │  • insights_cache.py          │                                        │
│  │  • insights_router.py         │                                        │
│  └───────────────────────────────┘                                        │
└─────────────────────────────────────────────────────────┼─────────────────┘

                                                          ▼
                                         Validated Pydantic Data Contract
                                                          ▼
                                                Database (Student 2)
```

---

## 💎 Core AI Principles

1. **Evidence-Backed Skills Only**:
   - Never infer skills from passive participation (e.g. hackathon attendance alone never confers programming proficiency).
   - Trace path: `Event` ➔ `Project` ➔ `Contribution` ➔ `Technology` ➔ `Evidence` ➔ `Skill`.
2. **Four-Tier Evidence Classification**:
   - `claimed`: User self-declaration without audited code or course records.
   - `academic`: Academic courses and grades (e.g., DBMS A+ confirms academic exposure, not production mastery).
   - `project`: Documented project usage and README mentions.
   - `github`: Concrete repositories, language breakdowns, dependencies, and Dockerfiles.
3. **Contribution Verification**:
   - Repositories where student commit history cannot be verified are flagged as `"unverified contribution"`.
4. **No Fake Precision**:
   - Strictly avoids pseudo-metrics like *"Student is 83.7% ready"*.
   - Uses explainable, evidence-backed categories: `strong`, `developing`, and `missing`.
5. **Closed-Loop Mission Design**:
   - Skill gaps directly generate targeted project missions.
   - Each mission mandates tangible deliverables (GitHub repo, README, test suites, deployment URL) that can be ingested back into SkillGraph to close the gap.
6. **Zero-Failure Fallback Mode**:
   - Complete deterministic fallback engine for all components. If Ollama is offline or uninstalled, the entire pipeline executes deterministically without crashing.

---

## 📂 Project Structure

```
SkillGraph/
├── ai-engine/
│   ├── __init__.py            # Module exports and paths
│   ├── ollama_client.py       # Reusable Ollama client with timeout & error handling
│   ├── validators.py          # Pydantic validation schemas
│   ├── prompts.py             # Centralized system and user prompts
│   ├── skill_mapper.py        # Ontology taxonomy, normalizations, and relations
│   ├── extractor.py           # Skill extraction engine (LLM + Fallback)
│   ├── gap_engine.py          # Gap reasoning engine (strong, developing, missing)
│   └── mission_generator.py   # Closed-loop project mission generator
├── services/
│   ├── __init__.py            # Services exports
│   ├── github_service.py      # GitHub repo, language, README, and dependency parser
│   └── insights_service.py    # Role requirements, tech context, and project ideas
├── tests/
│   ├── test_skill_extraction.py
│   ├── test_github_service.py
│   ├── test_academic_evidence.py
│   ├── test_hackathon_evidence.py
│   ├── test_gap_engine.py
│   ├── test_mission_generator.py
│   └── test_ollama_resilience.py
├── demo_closed_loop.py        # End-to-end integration demo script
├── .env.example               # Configurable LLM model and API parameters
├── requirements.txt           # Python dependencies
├── pytest.ini                 # Pytest path and runner configuration
└── README.md                  # Complete technical documentation
```

---

## 🚀 Setup & Quickstart

### 1. Environment Setup

```bash
# 1. Create and activate a Python virtual environment
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Linux / macOS:
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
cp .env.example .env
```

### 2. Configure Local Ollama (Optional)

SkillGraph works with any local Ollama model (e.g., `llama3`, `mistral`, `qwen2.5`):

```bash
# In your terminal (if Ollama is installed):
ollama pull llama3
ollama run llama3
```

In `.env`:
```ini
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
OLLAMA_TIMEOUT_SECONDS=30
```

> **Note**: If Ollama is NOT running, SkillGraph automatically switches to its deterministic fallback engine.

---

## 🧪 Running the Tests

Execute the automated test suite with pytest:

```bash
pytest -v tests
```

### Test Coverage Highlights:
- **Skill Extraction**: Verifies evidence item creation, source tracking, and confidence ratings.
- **GitHub Parsing**: Verifies dependency detection (`requirements.txt`, `package.json`, `Dockerfile`) and contribution verification.
- **Academic Evidence**: Proves DBMS A+ yields academic exposure, not automatic expert status.
- **Hackathon Evidence**: Verifies separation of participation from technical contribution.
- **Gap Reasoning**: Confirms classification into `strong`, `developing`, `missing` without fake percentages.
- **Mission Generation**: Confirms targeted gap closure and closed-loop artifact specifications.
- **Ollama Resilience**: Confirms timeout, offline connection, and invalid JSON recovery.

---

## 🔄 Running the Closed-Loop Demo

Run the end-to-end integration demo:

```bash
python demo_closed_loop.py
```

Output highlights:
```text
[Step 1] Ingesting Student Profile
[Step 2] Extracted Evidence-Backed Skills
[Step 3] iNSIGHTS Role Context
[Step 4] Gap Reasoning (Explainable Categories - No Fake Precision)
  [STRONG]     : ['Python', 'FastAPI', 'REST API']
  [DEVELOPING] : ['PostgreSQL', 'SQL', 'DBMS', 'Docker']
  [MISSING]    : ['Testing', 'Git']
[Step 5] Generated Closed-Loop Project Mission
  TITLE: BUILD AND DEPLOY A PRODUCTION BACKEND DEVELOPER SYSTEM
  TARGETED GAPS: ['Testing', 'Git', 'PostgreSQL', 'SQL', 'DBMS', 'Docker']
  EXPECTED EVIDENCE: GitHub repo, README, Pytest results, Live deployment URL
```

---

## 🤝 Integration Contract for Student 2 (FastAPI)

Student 2 can integrate the intelligence layer in FastAPI route handlers as follows:

```python
from fastapi import FastAPI, HTTPException
from ai_engine import (
    SkillExtractor,
    GapEngine,
    MissionGenerator,
    StudentProfileInput,
)
from services import GitHubService, InsightsService

app = FastAPI(title="SkillGraph API")

extractor = SkillExtractor()
gap_engine = GapEngine()
mission_gen = MissionGenerator()
github_svc = GitHubService()
insights_svc = InsightsService()

@app.post("/api/v1/analyze-student")
async def analyze_student(profile: StudentProfileInput, target_role: str = "Backend Developer"):
    # 1. Extract verified skills
    skills_result = extractor.extract(profile)
    
    # 2. Get role requirements
    role_info = insights_svc.get_role_requirements(target_role)
    
    # 3. Analyze skill gaps
    gap_result = gap_engine.analyze_gaps(
        extraction_result=skills_result,
        target_role=target_role,
        role_requirements=role_info["core_skills"],
    )
    
    # 4. Generate closed-loop mission
    mission = mission_gen.generate_mission(
        target_role=target_role,
        gap_result=gap_result,
        context_info=role_info["summary"],
    )
    
    return {
        "extracted_skills": skills_result.model_dump(),
        "gap_analysis": gap_result.model_dump(),
        "mission": mission.model_dump(),
    }
```
