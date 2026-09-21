"""
Unit tests for GitHub Service.
Verifies repo analysis, dependency extraction, and contribution verification.
"""

from unittest.mock import patch, MagicMock
import pytest
from services.github_service import GitHubService


def test_dependency_extraction_from_requirements_txt():
    gh = GitHubService()
    reqs = """
    fastapi==0.110.0
    psycopg2-binary>=2.9.0
    pytest>=8.0
    # comments
    httpx
    """
    deps = gh.detect_dependencies_from_text("requirements.txt", reqs)
    assert "fastapi" in deps
    assert "psycopg2-binary" in deps
    assert "pytest" in deps
    assert "httpx" in deps


def test_dependency_extraction_from_package_json():
    gh = GitHubService()
    pkg_json = """
    {
      "dependencies": {
        "react": "^18.2.0",
        "next": "14.1.0"
      },
      "devDependencies": {
        "typescript": "^5.0.0"
      }
    }
    """
    deps = gh.detect_dependencies_from_text("package.json", pkg_json)
    assert "react" in deps
    assert "next" in deps
    assert "typescript" in deps


def test_dockerfile_detection():
    gh = GitHubService()
    dockerfile = """
    FROM python:3.11-slim
    WORKDIR /app
    COPY . .
    CMD ["uvicorn", "main:app"]
    """
    deps = gh.detect_dependencies_from_text("Dockerfile", dockerfile)
    assert "Docker" in deps


def test_verify_author_contribution_verified():
    gh = GitHubService()
    with patch("httpx.Client.get") as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"sha": "abc1234", "commit": {"message": "feat: add api"}}]
        mock_get.return_value = mock_response

        verified, reason = gh.verify_author_contribution("testuser", "my-repo", "testuser")
        assert verified is True
        assert reason == "verified contribution"


def test_verify_author_contribution_unverified():
    gh = GitHubService()
    with patch("httpx.Client.get") as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = []  # No commits found for user
        mock_get.return_value = mock_response

        verified, reason = gh.verify_author_contribution("upstream-owner", "forked-repo", "otheruser")
        assert verified is False
        assert reason == "unverified contribution"
