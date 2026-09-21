# SkillGraph Backend (Student 2 Deliverable)

Enterprise-grade, modular FastAPI backend for **SkillGraph**. Provides database persistence, student evidence tracking, React Flow skill graph generation, deterministic career role gap analysis, and learning mission generation.

---

## 🏛️ Architecture

Strict three-tier separation of concerns:

```
FastAPI Routers (HTTP request validation, standard response envelopes)
       ↓
Services Layer (Deterministic gap analysis, graph assembly, evidence processing)
       ↓
Database Layer (SQLAlchemy ORM models, PostgreSQL / Supabase, Alembic migrations)
```

> [!NOTE]
> All route endpoints delegate 100% of business logic to the `app/services/` layer. This keeps the backend fully modular and enables **Student 3 (AI reasoning developer)** to easily hook in LLMs without altering routes or schemas.

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` settings will run out-of-the-box using local SQLite (`sqlite:///./skillgraph.db`) if PostgreSQL is not yet running. To connect to PostgreSQL or Supabase, update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillgraph
```

### 3. Run the Development Server
```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`.
- **Interactive OpenAPI Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🗄️ Database Migrations (Alembic)

To apply migrations against your PostgreSQL or Supabase database:
```bash
cd backend
alembic upgrade head
```

To create a new migration after modifying models:
```bash
cd backend
alembic revision --autogenerate -m "Add new columns"
```

To seed initial skills (24 items), roles (5 items), graph edges, and sample student data:
```bash
python -m app.seed.seed_data
```
*(Note: on startup, the application also automatically ensures seed data is populated!)*

---

## 📡 API Reference

All responses conform to the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 1. Profile
- `GET /api/profile` - Retrieve student profile
- `PUT /api/profile` - Update student profile (validates CGPA $\le 10.0$ and semester $1-12$)

### 2. Academic
- `GET /api/academic` - Retrieve academic history, GPA, and total credits
- `POST /api/academic` - Add subject grade and credit

### 3. Evidence Management
- `GET /api/evidence` - List all student evidence
- `POST /api/evidence` - Create generic evidence
- `POST /api/evidence/project` - Create project evidence (auto-links technologies to skills)
- `POST /api/evidence/hackathon` - Create hackathon evidence
- `POST /api/evidence/certificate` - Create certificate evidence
- `GET /api/evidence/{id}` - Get evidence details
- `DELETE /api/evidence/{id}` - Delete evidence

### 4. Skills & React Flow Graph
- `GET /api/skills` - List all registered skills
- `GET /api/skills/{id}` - Retrieve skill details and linked evidence count
- `GET /api/skills/graph` - **React Flow Graph Payload**:
  ```json
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
  ```

### 5. Career Roles & Gap Analysis
- `GET /api/roles` - List available roles (Backend Developer, Frontend Developer, etc.)
- `GET /api/roles/{id}` - Role details and required skill breakdown
- `GET /api/gap-analysis/{role_id}` - **Deterministic Gap Analysis**:
  ```json
  {
    "role": "Backend Developer",
    "strong": ["Python", "SQL"],
    "developing": ["Docker"],
    "missing": ["Testing", "Cloud"]
  }
  ```

### 6. Missions
- `POST /api/mission/generate` - Generates targeted learning mission addressing role gap
- `GET /api/mission/{id}` - Retrieve mission details

### 7. Integrations
- `GET /api/github/status` - Current GitHub connection status
- `POST /api/github/connect` - Connect GitHub account
- `GET /api/insights/status` - AI reasoning subsystem status

---

## 🧪 Automated Testing

Execute the test suite with pytest:
```bash
pytest backend/tests/ -v
```
All tests run with isolated, in-memory transactional sessions.
