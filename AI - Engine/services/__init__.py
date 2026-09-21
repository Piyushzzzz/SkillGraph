"""
Services package for SkillGraph.
Provides external integrations (GitHub) and market intelligence (iNSIGHTS).
"""

from .github_service import GitHubService, GitHubServiceError
from .insights_service import InsightsService

__all__ = [
    "GitHubService",
    "GitHubServiceError",
    "InsightsService",
]
