"""
GitHub integration service for SkillGraph.
Analyzes user profiles, repositories, languages, dependencies, READMEs,
and verifies author contributions.
"""

import os
import re
import base64
import logging
from typing import Dict, List, Optional, Any, Tuple
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("services.github_service")


class GitHubServiceError(Exception):
    """Base exception for GitHub service errors."""
    pass


class GitHubService:
    """
    Interacts with GitHub API to fetch and analyze student repositories.
    Supports author contribution verification to ensure claims are evidence-backed.
    """

    def __init__(self, token: Optional[str] = None, base_url: str = "https://api.github.com"):
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "SkillGraph-IntelligenceLayer/1.0",
        }
        if self.token:
            self.headers["Authorization"] = f"Bearer {self.token}"

    def get_user(self, username: str) -> Dict[str, Any]:
        """
        Fetch public GitHub user profile details.
        """
        url = f"{self.base_url}/users/{username}"
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                res = client.get(url)
                res.raise_for_status()
                return res.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"GitHub get_user HTTP error {e.response.status_code}: {e}")
            raise GitHubServiceError(f"Failed to fetch GitHub user '{username}': {e}") from e
        except Exception as e:
            raise GitHubServiceError(f"Error fetching GitHub user '{username}': {e}") from e

    def get_repositories(self, username: str) -> List[Dict[str, Any]]:
        """
        Fetch public repositories for a user.
        """
        url = f"{self.base_url}/users/{username}/repos?per_page=100&sort=updated"
        try:
            with httpx.Client(headers=self.headers, timeout=15.0) as client:
                res = client.get(url)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            logger.error(f"Failed to fetch repositories for {username}: {e}")
            raise GitHubServiceError(f"Failed to fetch repositories for '{username}': {e}") from e

    def get_repository(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Fetch specific repository details.
        """
        url = f"{self.base_url}/repos/{owner}/{repo}"
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                res = client.get(url)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            raise GitHubServiceError(f"Failed to fetch repo '{owner}/{repo}': {e}") from e

    def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """
        Fetch language breakdown (bytes count) for a repository.
        """
        url = f"{self.base_url}/repos/{owner}/{repo}/languages"
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                res = client.get(url)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            logger.warning(f"Could not fetch languages for {owner}/{repo}: {e}")
            return {}

    def get_readme(self, owner: str, repo: str) -> Optional[str]:
        """
        Fetch decoded README content for a repository.
        """
        url = f"{self.base_url}/repos/{owner}/{repo}/readme"
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                res = client.get(url)
                if res.status_code == 404:
                    return None
                res.raise_for_status()
                data = res.json()
                content = data.get("content", "")
                encoding = data.get("encoding", "")
                if encoding == "base64" and content:
                    return base64.b64decode(content).decode("utf-8", errors="replace")
                return content
        except Exception as e:
            logger.warning(f"Could not fetch README for {owner}/{repo}: {e}")
            return None

    def verify_author_contribution(self, owner: str, repo: str, username: str) -> Tuple[bool, str]:
        """
        Verifies if the student personally contributed code to this repository.
        Rule: Do not claim code unless contribution evidence exists.
        If contribution cannot be verified, returns (False, 'unverified contribution').
        """
        # If repo is a fork and user is not owner, check contributor statistics
        url = f"{self.base_url}/repos/{owner}/{repo}/commits?author={username}&per_page=1"
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                res = client.get(url)
                if res.status_code == 200:
                    commits = res.json()
                    if isinstance(commits, list) and len(commits) > 0:
                        return True, "verified contribution"
                    return False, "unverified contribution"
                elif res.status_code == 404:
                    return False, "unverified contribution"
                return False, "unverified contribution"
        except Exception as e:
            logger.warning(f"Could not verify commits for {username} in {owner}/{repo}: {e}")
            return False, "unverified contribution"

    def detect_dependencies_from_text(self, filename: str, content: str) -> List[str]:
        """
        Extract declared dependencies from dependency manifest content.
        Supports requirements.txt, package.json, Dockerfile, etc.
        """
        deps: List[str] = []
        fname = filename.lower()

        if "requirements" in fname or fname.endswith(".txt"):
            for line in content.splitlines():
                line = line.strip()
                if line and not line.startswith("#"):
                    pkg = re.split(r"[><=~;]", line)[0].strip()
                    if pkg:
                        deps.append(pkg)

        elif "package.json" in fname:
            # Simple regex parser for dependencies object in package.json
            dep_blocks = re.findall(r'"dependencies"\s*:\s*\{([^}]+)\}', content, re.DOTALL)
            dev_blocks = re.findall(r'"devDependencies"\s*:\s*\{([^}]+)\}', content, re.DOTALL)
            for block in dep_blocks + dev_blocks:
                pkgs = re.findall(r'"([^"]+)"\s*:', block)
                deps.extend(pkgs)

        elif "dockerfile" in fname:
            if "FROM " in content.upper():
                deps.append("Docker")

        return list(set(deps))

    def analyze_repository(
        self,
        owner: str,
        repo: str,
        student_username: Optional[str] = None,
        files_content: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Comprehensive repository analysis:
        Name, description, languages, README, topics, dependencies, recent activity,
        and author contribution verification.
        """
        # Fetch metadata
        repo_data = self.get_repository(owner, repo)
        languages = self.get_repository_languages(owner, repo)
        readme = self.get_readme(owner, repo)

        # Check contribution status
        is_verified = True
        status_note = "verified contribution"
        if student_username:
            # If repo belongs to another owner or is a fork, verify commits
            if repo_data.get("fork", False) or owner.lower() != student_username.lower():
                is_verified, status_note = self.verify_author_contribution(owner, repo, student_username)

        # Extract dependencies if files provided or detect Dockerfile presence
        dependencies: List[str] = []
        has_dockerfile = False
        if files_content:
            for fpath, content in files_content.items():
                if "dockerfile" in fpath.lower():
                    has_dockerfile = True
                deps = self.detect_dependencies_from_text(fpath, content)
                dependencies.extend(deps)

        return {
            "name": repo_data.get("name", repo),
            "owner": owner,
            "description": repo_data.get("description", ""),
            "topics": repo_data.get("topics", []),
            "languages": languages,
            "readme_summary": readme[:500] if readme else "",
            "has_readme": bool(readme),
            "has_dockerfile": has_dockerfile,
            "dependencies": list(set(dependencies)),
            "is_author_verified": is_verified,
            "contribution_status": status_note,
            "updated_at": repo_data.get("updated_at", ""),
        }
