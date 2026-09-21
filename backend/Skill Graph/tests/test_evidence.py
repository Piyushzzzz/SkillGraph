def test_list_evidence(client):
    response = client.get("/api/evidence")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1


def test_create_project_evidence(client):
    payload = {
        "title": "Cloud Native Ecommerce API",
        "description": "High performance ecommerce microservice using FastAPI and PostgreSQL.",
        "project_name": "Ecommerce API",
        "role": "Backend Lead",
        "contribution": "Architected database schemas and wrote REST endpoints.",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "github_url": "https://github.com/alexmercer/ecommerce-api",
        "demo_url": "https://ecommerce.api.demo.com",
    }
    response = client.post("/api/evidence/project", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["type"] == "project"
    assert data["data"]["title"] == "Cloud Native Ecommerce API"
    assert len(data["data"]["skills"]) > 0


def test_create_hackathon_evidence(client):
    payload = {
        "title": "Hackathon 2026 Winner",
        "description": "Developed an AI-driven triage system in 36 hours.",
        "hackathon_name": "Global AI Hackathon",
        "organization": "Open Tech League",
        "project_name": "HealthTriage AI",
        "team_name": "Neural Pioneers",
        "role": "Full-Stack Dev",
        "contribution": "Built backend API endpoints and data model.",
        "technologies": ["Python", "FastAPI"],
        "github_url": "https://github.com/alexmercer/health-triage",
        "achievement": "1st Place Grand Winner",
    }
    response = client.post("/api/evidence/hackathon", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["type"] == "hackathon"
    assert data["data"]["details"]["achievement"] == "1st Place Grand Winner"


def test_create_certificate_evidence(client):
    payload = {
        "title": "Docker Certified Associate",
        "description": "Enterprise container orchestration certification.",
        "issuer": "Docker Inc.",
        "certificate_name": "Docker",
        "certificate_url": "https://credentials.docker.com/verify/12345",
    }
    response = client.post("/api/evidence/certificate", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["type"] == "certificate"


def test_invalid_url_evidence(client):
    payload = {
        "title": "Invalid URL Project",
        "description": "Testing invalid url validation.",
        "project_name": "Broken URL",
        "role": "Dev",
        "contribution": "Testing",
        "technologies": ["Python"],
        "github_url": "not-a-valid-url-format",
    }
    response = client.post("/api/evidence/project", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "Invalid URL" in data["message"]
