def test_generate_mission(client):
    payload = {
        "role_id": "backend-developer",
    }
    response = client.post("/api/mission/generate", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "title" in data["data"]
    assert "requirements" in data["data"]
    assert len(data["data"]["requirements"]) > 0

    mission_id = data["data"]["id"]
    get_res = client.get(f"/api/mission/{mission_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == mission_id


def test_github_status_and_connect(client):
    status_res = client.get("/api/github/status")
    assert status_res.status_code == 200
    assert "connected" in status_res.json()["data"]

    connect_res = client.post("/api/github/connect", json={"github_token": "ghp_mock_token_12345"})
    assert connect_res.status_code == 200
    assert connect_res.json()["data"]["connected"] is True


def test_insights_status(client):
    res = client.get("/api/insights/status")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["data"]["status"] == "ready"
