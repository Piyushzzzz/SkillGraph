# SkillGraph 🚀
> **Evidence-Grounded Verified Capability Topology & Career Intelligence Platform**

SkillGraph bridges academia, developer portfolios, and industry hiring standards by computing a **cryptographically grounded capability topology (DAG)** for every student. Rather than relying on self-reported resume claims, competencies are derived directly from verified coursework, GitHub repositories, deployed production projects, and competitive hackathon achievements.

---

## 🏛️ High-Level System Architecture

SkillGraph is built as a modular, resilient multi-tier system:

```
                  ┌─────────────────────────────────────┐
                  │    React 19 + TypeScript Frontend   │
                  │       (Vite, TailwindCSS, HUD)      │
                  └──────────────────┬──────────────────┘
                                     │ REST / JSON
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      FastAPI Backend Gateway        │
                  │   (SQLAlchemy, SQLite, Pydantic v2) │
                  └──────────────────┬──────────────────┘
                                     │ Internal Bridge
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       AI Intelligence Engine        │
                  │   • SkillExtractor (Code & AST)     │
                  │   • GapEngine (Target Role Fit)     │
                  │   • iNSIGHTS / Ollama LLM + Fallback│
                  └─────────────────────────────────────┘
```

### 1. **React 19 Frontend (`forntend/`)**
- **Living SkillGraph DAG**: Interactive graph visualizing student strengths, developing skills, and target role gaps.
- **Evidence Vault**: Tamper-evident ledger capturing academic courses, GitHub repositories, and hackathon certificates.
- **Adaptive Missions**: Generates personalized project specs to close identified skill gaps.
- **Absolute Zero Policy**: New accounts start with a true clean slate (no fake 8.5 CGPA, no stock avatar, no unverified badges).

### 2. **FastAPI Backend (`backend/Skill Graph/`)**
- RESTful service exposing profile management, evidence records, graph nodes/edges, and role taxonomies.
- Database models with automatic seeding for roles, curriculum standards, and demo showcase data.
- Built-in validation conforming to Pydantic v2 with full OpenAPI/Swagger documentation at `/docs`.

### 3. **AI Engine (`AI - Engine/`)**
- Automated skill extraction from project source code, commits, and repository metadata.
- Closed-loop gap analysis matching candidate topology against target industry roles (Software Engineer, ML Engineer, Backend Specialist, etc.).
- Multi-tier LLM bridge supporting local Ollama (`qwen2.5-coder`) with instant deterministic offline fallback.

---

## ⚡ Quick Start

### Prerequisites
- **Python 3.10+** (Python 3.13 supported)
- **Node.js 18+** & `npm`
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
cd SkillGraph
```

### 2. Set Up Virtual Environment & Dependencies
```bash
# Create and activate Python virtualenv
python -m venv .venv
source .venv/bin/activate    # On Linux / macOS
.venv\Scripts\activate       # On Windows (PowerShell)

# Install Backend & AI Engine dependencies
pip install -r "backend/Skill Graph/requirements.txt"
pip install -r "AI - Engine/requirements.txt"

# Install Frontend dependencies
cd forntend
npm install
cd ..
```

### 3. Launch the Unified Full-Stack Environment
Run the unified launcher to orchestrate the AI Engine, FastAPI Backend, and Vite Frontend simultaneously:
```bash
python start_all.py
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Schema**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Testing

SkillGraph includes automated unit and integration tests across both the backend and AI engine:

```bash
# Run the 52-test automated suite
python -m pytest "backend/Skill Graph/tests" "AI - Engine/tests"
```

To validate the frontend build:
```bash
cd forntend
npm run build
```

---

## 👥 Demo Accounts
- **Showcase Demo**: Includes Alex Mercer with 8 verified proofs, 8.75 CGPA, and populated skill topology.
- **Fresh Student**: Complete clean slate (0 evidence, 0 CGPA, monogram avatar, empty taxonomy baseline ready for uploads).
Switch between accounts using the top-right toggle in the application header.

---

## 📜 License
MIT License. Created for the SkillGraph Open Architecture.
