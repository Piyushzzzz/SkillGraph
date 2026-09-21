"""
Unit tests for Ollama Client resilience and error handling.
Verifies connection errors, timeouts, invalid JSON parsing, and graceful fallback activation.
"""

from unittest.mock import patch, MagicMock
import httpx
import pytest
from pydantic import BaseModel
from ai_engine import (
    OllamaClient,
    OllamaConnectionError,
    OllamaTimeoutError,
    OllamaInvalidResponseError,
    SkillExtractor,
    GapEngine,
    MissionGenerator,
    StudentProfileInput,
    GapAnalysisResult,
)


class SampleModel(BaseModel):
    name: str
    count: int


def test_ollama_connection_error():
    """
    When Ollama server is offline, client raises OllamaConnectionError.
    """
    client = OllamaClient(base_url="http://localhost:99999", timeout_seconds=1.0)
    with patch("httpx.Client.post", side_effect=httpx.ConnectError("Connection refused")):
        with pytest.raises(OllamaConnectionError):
            client.generate("hello")


def test_ollama_timeout_error():
    """
    When Ollama times out, client raises OllamaTimeoutError.
    """
    client = OllamaClient(base_url="http://localhost:11434", timeout_seconds=0.5)
    with patch("httpx.Client.post", side_effect=httpx.TimeoutException("Read timed out")):
        with pytest.raises(OllamaTimeoutError):
            client.generate("hello")


def test_ollama_invalid_json_handling():
    """
    When Ollama outputs malformed or empty text instead of valid JSON,
    client raises OllamaInvalidResponseError.
    """
    client = OllamaClient()

    # Empty response
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"response": ""}
        mock_post.return_value = mock_resp

        with pytest.raises(OllamaInvalidResponseError):
            client.generate_json("Generate JSON", model_cls=SampleModel)

    # Malformed non-JSON
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"response": "Here is your JSON: not a json {{"}
        mock_post.return_value = mock_resp

        with pytest.raises(OllamaInvalidResponseError):
            client.generate_json("Generate JSON", model_cls=SampleModel)


def test_extractor_fallback_on_ollama_failure():
    """
    Verifies that when Ollama raises an error during extraction,
    the SkillExtractor automatically activates deterministic fallback without crashing.
    """
    mock_ollama = MagicMock()
    mock_ollama.is_available.return_value = True
    mock_ollama.generate_json.side_effect = OllamaConnectionError("Offline")

    extractor = SkillExtractor(ollama_client=mock_ollama, use_fallback_on_error=True)
    profile = StudentProfileInput(
        repositories_metadata=[
            {
                "name": "api-service",
                "languages": {"Python": 5000},
                "dependencies": ["fastapi"],
                "has_dockerfile": True,
                "is_author_verified": True,
            }
        ]
    )

    result = extractor.extract(profile)
    skill_names = {s.name for s in result.skills}
    assert "Python" in skill_names
    assert "FastAPI" in skill_names
    assert "Docker" in skill_names


def test_gap_engine_fallback_on_ollama_failure():
    """
    Verifies that GapEngine activates deterministic fallback on Ollama failure.
    """
    mock_ollama = MagicMock()
    mock_ollama.is_available.return_value = True
    mock_ollama.generate_json.side_effect = OllamaTimeoutError("Timed out")

    gap_engine = GapEngine(ollama_client=mock_ollama, use_fallback_on_error=True)
    extractor = SkillExtractor()
    profile = StudentProfileInput(claimed_skills=["Python"])
    extracted = extractor.extract_with_fallback(profile)

    result = gap_engine.analyze_gaps(extracted, target_role="Backend Developer")
    assert "Backend Developer" == result.target_role
    assert len(result.missing) > 0


def test_mission_generator_fallback_on_ollama_failure():
    """
    Verifies that MissionGenerator activates deterministic fallback on Ollama failure.
    """
    mock_ollama = MagicMock()
    mock_ollama.is_available.return_value = True
    mock_ollama.generate_json.side_effect = OllamaInvalidResponseError("Bad schema")

    mission_gen = MissionGenerator(ollama_client=mock_ollama, use_fallback_on_error=True)
    gap_result = GapAnalysisResult(
        target_role="Frontend Developer",
        strong=["JavaScript"],
        developing=[],
        missing=["React", "Testing"],
    )

    mission = mission_gen.generate_mission("Frontend Developer", gap_result)
    assert "FRONTEND" in mission.title.upper()
    assert "React" in mission.targeted_gaps
