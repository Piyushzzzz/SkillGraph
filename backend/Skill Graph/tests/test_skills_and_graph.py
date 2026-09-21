def test_list_skills(client):
    response = client.get("/api/skills")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 24  # At least all 24 seeded skills


def test_get_skill_by_id(client):
    response = client.get("/api/skills/python")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "python"
    assert data["data"]["name"] == "Python"
    assert "evidence_count" in data["data"]
    assert "related_skills" in data["data"]


def test_get_react_flow_skill_graph(client):
    """
    CRITICAL: Validates React Flow structure requirement:
    {
      "nodes": [
        { "id": "python", "label": "Python", "category": "programming", "evidence_count": 3 }
      ],
      "edges": [
        { "source": "python", "target": "fastapi", "relationship": "used_with" }
      ]
    }
    """
    response = client.get("/api/skills/graph")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "nodes" in data["data"]
    assert "edges" in data["data"]

    nodes = data["data"]["nodes"]
    edges = data["data"]["edges"]

    assert len(nodes) >= 24
    assert len(edges) >= 15

    # Check first node structure
    sample_node = next((n for n in nodes if n["id"] == "python"), None)
    assert sample_node is not None
    assert sample_node["label"] == "Python"
    assert sample_node["category"] == "programming"
    assert "evidence_count" in sample_node
    assert isinstance(sample_node["evidence_count"], int)

    # Check edge structure
    sample_edge = next((e for e in edges if e["source"] == "python" and e["target"] == "fastapi"), None)
    assert sample_edge is not None
    assert sample_edge["relationship"] == "used_with"


def test_list_roles(client):
    response = client.get("/api/roles")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 5  # 5 seeded roles


def test_get_role_by_id(client):
    response = client.get("/api/roles/backend-developer")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Backend Developer"
    assert len(data["data"]["skills"]) >= 8
