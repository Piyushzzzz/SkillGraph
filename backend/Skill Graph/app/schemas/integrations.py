from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class GitHubStatusResponse(BaseModel):
    connected: bool
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    public_repos_count: int = 0
    synced_at: Optional[str] = None


class GitHubConnectRequest(BaseModel):
    github_token: Optional[str] = Field(None, description="Personal Access Token")
    code: Optional[str] = Field(None, description="OAuth callback temporary code")


class InsightsStatusResponse(BaseModel):
    service: str = "Insights Engine"
    status: str = "healthy"
    api_key_configured: bool
    version: str = "1.0.0"
    details: Dict[str, Any] = {}
