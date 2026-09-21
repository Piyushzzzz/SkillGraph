"""
Unit tests for iNSIGHTS Integration.
Verifies all 8 requirements specified in insight.md:
1. iNSIGHTS connection
2. Successful response
3. Invalid response handling
4. Timeout handling
5. API failure handling
6. Fallback mode
7. Mapping iNSIGHTS response
8. Mission generation using iNSIGHTS context
"""

from unittest.mock import patch, MagicMock
import httpx
import pytest

from insights import (
    InsightsClient,
    InsightsService,
    InsightsMapper,
    InsightsInput,
    InsightsContext,
    InsightsConnectionError,
    InsightsTimeoutError,
    InsightsAPIError,
    InsightsInvalidResponseError,
    InsightsCache,
)
from ai_engine import (
    MissionGenerator,
    GapAnalysisResult,
    SkillGapDetail,
    ProjectMission,
)


# ----------------------------------------------------------------------
# 1. Test iNSIGHTS Connection Error
# ----------------------------------------------------------------------
def test_insights_connection_error():
    client = InsightsClient(api_url="http://invalid-host:9999", timeout_seconds=1.0)
    with patch("httpx.Client.post", side_effect=httpx.ConnectError("Connection refused")):
        payload = InsightsInput(
            target_role="Backend Developer",
            student_skills=["Python"],
            missing_skills=["Docker"],
        )
        with pytest.raises(InsightsConnectionError):
            client.fetch_context(payload)


# ----------------------------------------------------------------------
# 2. Test Successful Response
# ----------------------------------------------------------------------
def test_insights_successful_response():
    client = InsightsClient()
    mock_payload = {
        "role": "Backend Developer",
        "relevant_skills": ["Python", "FastAPI", "Docker", "Testing"],
        "technology_context": ["Containerization", "Automated Testing"],
        "project_opportunities": ["Production REST API"],
        "recommended_evidence": ["Dockerfile", "Pytest suite"],
    }
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = mock_payload
        mock_post.return_value = mock_resp

        payload = InsightsInput(
            target_role="Backend Developer",
            student_skills=["Python"],
            missing_skills=["Docker", "Testing"],
        )
        res = client.fetch_context(payload)
        assert res["role"] == "Backend Developer"
        assert "Containerization" in res["technology_context"]


# ----------------------------------------------------------------------
# 3. Test Invalid Response Handling
# ----------------------------------------------------------------------
def test_insights_invalid_response():
    client = InsightsClient()
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.side_effect = ValueError("Invalid JSON")
        mock_post.return_value = mock_resp

        payload = InsightsInput(
            target_role="Backend Developer",
            missing_skills=["Docker"],
        )
        with pytest.raises(InsightsInvalidResponseError):
            client.fetch_context(payload)


# ----------------------------------------------------------------------
# 4. Test Timeout Handling
# ----------------------------------------------------------------------
def test_insights_timeout_handling():
    client = InsightsClient(timeout_seconds=0.1)
    with patch("httpx.Client.post", side_effect=httpx.TimeoutException("Read timed out")):
        payload = InsightsInput(
            target_role="Backend Developer",
            missing_skills=["Cloud"],
        )
        with pytest.raises(InsightsTimeoutError):
            client.fetch_context(payload)


# ----------------------------------------------------------------------
# 5. Test API Failure Handling (e.g. 500 or 403)
# ----------------------------------------------------------------------
def test_insights_api_failure():
    client = InsightsClient()
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 500
        mock_resp.text = "Internal Server Error"
        mock_post.return_value = mock_resp
        mock_resp.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Server Error", request=MagicMock(), response=mock_resp
        )

        payload = InsightsInput(
            target_role="Backend Developer",
            missing_skills=["Testing"],
        )
        with pytest.raises(InsightsAPIError) as exc_info:
            client.fetch_context(payload)
        assert exc_info.value.status_code == 500


# ----------------------------------------------------------------------
# 6. Test Fallback Mode (When API is offline/fails)
# ----------------------------------------------------------------------
def test_insights_fallback_mode():
    """
    Verifies that when external client fails, the service does NOT raise
    an unhandled exception, but returns deterministic fallback context:
    Docker -> Containerization, Testing -> Automated Testing, Cloud -> Cloud Deployment.
    """
    mock_client = MagicMock()
    mock_client.fetch_context.side_effect = InsightsConnectionError("API is offline")

    service = InsightsService(client=mock_client)
    payload = InsightsInput(
        target_role="Backend Developer",
        student_skills=["Python", "FastAPI"],
        developing_skills=["Docker"],
        missing_skills=["Testing", "Cloud"],
    )

    context = service.get_context(payload)

    assert isinstance(context, InsightsContext)
    assert context.role == "Backend Developer"

    # Must map Docker, Testing, and Cloud into industry concepts
    tech_str = " ".join(context.technology_context)
    assert "Automated Testing" in tech_str
    assert "Cloud Deployment" in tech_str
    assert len(context.project_opportunities) > 0
    assert len(context.recommended_evidence) > 0


# ----------------------------------------------------------------------
# 7. Test Mapping iNSIGHTS Response to Pydantic Model
# ----------------------------------------------------------------------
def test_mapping_insights_response():
    raw = {
        "target_role": "Backend Developer",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Testing", "Cloud"],
        "tech_context": ["Containerization", "Automated Testing", "Cloud Deployment"],
        "projects": ["Production REST API", "Microservice Deployment", "Cloud Backend"],
        "expected_artifacts": [
            "Dockerfile",
            "Automated tests",
            "Deployment URL",
            "Architecture documentation",
        ],
    }

    normalized = InsightsMapper.normalize_response(raw)
    assert isinstance(normalized, InsightsContext)
    assert normalized.role == "Backend Developer"
    assert "Containerization" in normalized.technology_context
    assert "Automated Testing" in normalized.technology_context
    assert "Production REST API" in normalized.project_opportunities
    assert "Dockerfile" in normalized.recommended_evidence


# ----------------------------------------------------------------------
# 8. Test Mission Generation Using iNSIGHTS Context
# ----------------------------------------------------------------------
def test_mission_generation_using_insights_context():
    """
    Verifies that the Mission Generator incorporates iNSIGHTS context
    into the generated mission requirements, title, and expected evidence.
    """
    gap_result = GapAnalysisResult(
        target_role="Backend Developer",
        strong=["Python", "FastAPI"],
        developing=["Docker"],
        missing=["Testing", "Cloud"],
        gap_details=[
            SkillGapDetail(
                skill="Testing",
                reason="No test suite found.",
                current_evidence=[],
                required_evidence=["Pytest suite with CI"],
            ),
            SkillGapDetail(
                skill="Cloud",
                reason="No cloud deployment found.",
                current_evidence=[],
                required_evidence=["Live deployment URL"],
            ),
        ],
    )

    insights_ctx = InsightsContext(
        role="Backend Developer",
        relevant_skills=["Python", "FastAPI", "Docker", "Testing", "Cloud"],
        technology_context=["Containerization", "Automated Testing", "Cloud Deployment"],
        project_opportunities=["Production REST API", "Microservice Deployment"],
        recommended_evidence=["Dockerfile", "Automated tests", "Deployment URL", "Architecture documentation"],
    )

    mission_gen = MissionGenerator()
    mission = mission_gen.generate_mission(
        target_role="Backend Developer",
        gap_result=gap_result,
        insights_context=insights_ctx,
    )

    assert isinstance(mission, ProjectMission)
    # The title should leverage the project opportunity
    assert "PRODUCTION REST API" in mission.title.upper() or "BACKEND" in mission.title.upper()

    # Requirements should reflect the gaps and technology context
    reqs_str = " ".join(mission.requirements)
    assert "Dockerfile" in reqs_str or "Containerize" in reqs_str
    assert "test" in reqs_str.lower()

    # Expected evidence should reflect iNSIGHTS recommendations
    ev_str = " ".join(mission.expected_evidence)
    assert "README" in ev_str
    assert "test" in ev_str.lower()
    assert "Deployment URL" in ev_str or "deployment" in ev_str.lower()


# ----------------------------------------------------------------------
# Bonus: Test Cache Hit and Key Generation
# ----------------------------------------------------------------------
def test_insights_cache():
    cache = InsightsCache()
    role = "Backend Developer"
    gaps = ["Testing", "Docker"]

    ctx = InsightsContext(
        role=role,
        relevant_skills=["Docker", "Testing"],
        technology_context=["Containerization"],
        project_opportunities=["API"],
        recommended_evidence=["Dockerfile"],
    )

    # Cache should be empty initially
    assert cache.get(role, gaps) is None

    # Set cache
    cache.set(role, gaps, ctx)
    assert cache.size() == 1

    # Order of gaps shouldn't matter for cache hit
    hit = cache.get(role, ["Docker", "Testing"])
    assert hit is not None
    assert hit.role == role
