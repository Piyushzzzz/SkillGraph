def test_gap_analysis_backend_developer(client):
    """
    CRITICAL: Validates Gap Analysis output format:
    {
      "role": "Backend Developer",
      "strong": [...],
      "developing": [...],
      "missing": [...]
    }
    """
    response = client.get("/api/gap-analysis/backend-developer")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    
    gap = data["data"]
    assert gap["role"] == "Backend Developer"
    assert "strong" in gap
    assert "developing" in gap
    assert "missing" in gap
    assert isinstance(gap["strong"], list)
    assert isinstance(gap["developing"], list)
    assert isinstance(gap["missing"], list)

    # In our seed data, student has 2 project evidences for Python and SQL certificate
    assert "Python" in gap["strong"] or "Python" in gap["developing"]
    # Cloud and Testing have no evidence in seed data
    assert "Cloud" in gap["missing"] or "Testing" in gap["missing"]


def test_gap_analysis_invalid_role(client):
    response = client.get("/api/gap-analysis/non-existent-role")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert "not found" in data["message"].lower()
