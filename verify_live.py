"""
End-to-End Live Verification Script for Integrated SkillGraph.
Tests all routers, AI Engine integration, gap analysis, and mission synthesis.
"""

import sys
from pathlib import Path

# Add paths
root_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(root_dir / "backend" / "Skill Graph"))
sys.path.insert(0, str(root_dir / "AI - Engine"))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    print("=" * 70)
    print("  VERIFYING INTEGRATED SKILLGRAPH SYSTEM")
    print("=" * 70)

    with TestClient(app) as client:
        # 1. Profile
        r = client.get("/api/profile")
        assert r.status_code == 200, f"Profile status: {r.status_code}"
        data = r.json()
        print(f"[PASS] GET /api/profile -> 200 OK | Student: {data['data']['name']} (CGPA: {data['data']['cgpa']})")

        # 2. Skills Graph
        r = client.get("/api/skills/graph")
        assert r.status_code == 200, f"Skills graph status: {r.status_code}"
        graph = r.json()
        print(f"[PASS] GET /api/skills/graph -> 200 OK | Nodes: {len(graph['data']['nodes'])}, Edges: {len(graph['data']['edges'])}")

        # 3. Roles
        r = client.get("/api/roles")
        assert r.status_code == 200, f"Roles status: {r.status_code}"
        roles = r.json()
        print(f"[PASS] GET /api/roles -> 200 OK | Available Roles: {len(roles['data'])}")

        # 4. AI Gap Analysis (Student 3 Integration)
        r = client.get("/api/gap-analysis/backend-developer")
        assert r.status_code == 200, f"Gap analysis status: {r.status_code}"
        gap = r.json()
        print(f"[PASS] GET /api/gap-analysis/backend-developer -> 200 OK")
        print(f"       Strong Skills:     {gap['data']['strong']}")
        print(f"       Developing Skills: {gap['data']['developing']}")
        print(f"       Missing Skills:    {gap['data']['missing']}")

        # 5. Closed-Loop Mission Generation (AI Synthesis)
        r = client.post("/api/mission/generate", json={"role_id": "backend-developer"})
        assert r.status_code == 201, f"Mission generate status: {r.status_code}"
        mission = r.json()
        print(f"[PASS] POST /api/mission/generate -> 201 Created")
        print(f"       Mission Title: {mission['data']['title']}")
        print(f"       Requirements Count: {len(mission['data']['requirements'])}")
        print(f"       Expected Deliverables: {len(mission['data']['expected_evidence'])}")

        # 6. iNSIGHTS Subsystem Status
        r = client.get("/api/insights/status")
        assert r.status_code == 200, f"Insights status: {r.status_code}"
        insights = r.json()
        print(f"[PASS] GET /api/insights/status -> 200 OK | Service: {insights['data']['service']} ({insights['data']['status']})")

        # 7. GitHub Integration Status
        r = client.get("/api/github/status")
        assert r.status_code == 200, f"GitHub status: {r.status_code}"
        gh = r.json()
        print(f"[PASS] GET /api/github/status -> 200 OK | Connected: {gh['data']['connected']}")

        print("\n" + "=" * 70)
        print("  ALL SUBSYSTEMS FULLY INTEGRATED & VERIFIED!")
        print("=" * 70)

if __name__ == "__main__":
    run_tests()
