def test_get_profile(client):
    response = client.get("/api/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["email"] == "alex.mercer@university.edu"
    assert data["data"]["cgpa"] == 8.75


def test_update_profile_success(client):
    payload = {
        "name": "Alex Mercer Updated",
        "cgpa": 9.15,
        "semester": 7,
    }
    response = client.put("/api/profile", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Alex Mercer Updated"
    assert data["data"]["cgpa"] == 9.15
    assert data["data"]["semester"] == 7


def test_update_profile_invalid_cgpa(client):
    payload = {
        "cgpa": 11.5,  # Exceeds maximum 10.0
    }
    response = client.put("/api/profile", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "CGPA must be between 0.0 and 10.0" in data["message"]


def test_update_profile_invalid_semester(client):
    payload = {
        "semester": 14,  # Exceeds maximum 12
    }
    response = client.put("/api/profile", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "Semester must be between 1 and 12" in data["message"]
