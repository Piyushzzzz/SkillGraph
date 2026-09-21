from fastapi import APIRouter
from app.schemas.common import APIResponse
from app.schemas.integrations import GitHubStatusResponse, GitHubConnectRequest
from app.services.integration_service import get_github_status, connect_github_account

router = APIRouter(prefix="/github", tags=["GitHub Integration"])


@router.get("/status", response_model=APIResponse[GitHubStatusResponse])
def check_github_status():
    """Check current GitHub integration status and sync details."""
    status_data = get_github_status()
    return APIResponse(
        success=True,
        data=status_data,
        message="GitHub status retrieved."
    )


@router.post("/connect", response_model=APIResponse[GitHubStatusResponse])
def connect_github(data: GitHubConnectRequest):
    """Connect GitHub account using token or authorization code."""
    result = connect_github_account(token=data.github_token, code=data.code)
    return APIResponse(
        success=True,
        data=result,
        message="GitHub account connected successfully." if result["connected"] else "Connection pending credentials."
    )
