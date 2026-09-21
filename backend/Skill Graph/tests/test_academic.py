def test_get_academic_summary(client):
    response = client.get("/api/academic")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "subjects" in data["data"]
    assert "cgpa" in data["data"]
    assert "total_credits" in data["data"]
    assert len(data["data"]["subjects"]) >= 1


def test_add_subject_success(client):
    payload = {
        "name": "Cloud Architecture",
        "grade": "A+",
        "credits": 3.0,
    }
    response = client.post("/api/academic", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Cloud Architecture"
    assert data["data"]["grade"] == "A+"
    assert data["data"]["credits"] == 3.0


def test_add_subject_invalid_grade(client):
    payload = {
        "name": "Invalid Grade Course",
        "grade": "XYZ999",  # Invalid grade format
        "credits": 3.0,
    }
    response = client.post("/api/academic", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "Invalid grade" in data["message"]
