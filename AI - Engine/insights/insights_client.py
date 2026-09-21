"""
Dedicated HTTP Client for external iNSIGHTS service.
Handles endpoint requests, timeouts, authentication headers, and error mapping.
"""

import os
import logging
from typing import Optional, Dict, Any
import httpx
from dotenv import load_dotenv
from .insights_mapper import InsightsInput

load_dotenv()

logger = logging.getLogger("insights.client")


class InsightsClientError(Exception):
    """Base exception for iNSIGHTS client failures."""
    pass


class InsightsConnectionError(InsightsClientError):
    """Raised when connection to iNSIGHTS fails."""
    pass


class InsightsTimeoutError(InsightsClientError):
    """Raised when an iNSIGHTS request times out."""
    pass


class InsightsAPIError(InsightsClientError):
    """Raised when iNSIGHTS returns an HTTP error status code."""
    def __init__(self, status_code: int, message: str):
        super().__init__(f"iNSIGHTS API error {status_code}: {message}")
        self.status_code = status_code
        self.message = message


class InsightsInvalidResponseError(InsightsClientError):
    """Raised when iNSIGHTS returns malformed or non-JSON data."""
    pass


class InsightsClient:
    """
    Dedicated client for external iNSIGHTS service.
    Encapsulates all external HTTP communications and authentication.
    """

    def __init__(
        self,
        api_url: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout_seconds: Optional[float] = None,
    ):
        self.api_url = (api_url or os.getenv("INSIGHTS_API_URL", "https://api.insights.example.com")).rstrip("/")
        self.api_key = api_key or os.getenv("INSIGHTS_API_KEY", "")
        try:
            self.timeout_seconds = float(timeout_seconds or os.getenv("INSIGHTS_TIMEOUT_SECONDS", "10.0"))
        except (ValueError, TypeError):
            self.timeout_seconds = 10.0

    @property
    def is_configured(self) -> bool:
        """
        Check if an external URL is configured.
        """
        return bool(self.api_url and not self.api_url.startswith("https://api.insights.example.com"))

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "SkillGraph-iNSIGHTS-Client/1.0",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def fetch_context(self, payload: InsightsInput) -> Dict[str, Any]:
        """
        Post skill gaps to iNSIGHTS and retrieve contextual market data.
        """
        url = f"{self.api_url}/api/v1/context"
        data = payload.model_dump()

        try:
            with httpx.Client(headers=self._get_headers(), timeout=self.timeout_seconds) as client:
                res = client.post(url, json=data)
                res.raise_for_status()
                return res.json()
        except httpx.ConnectError as e:
            logger.warning(f"Failed to connect to iNSIGHTS at {self.api_url}: {e}")
            raise InsightsConnectionError(f"Could not connect to iNSIGHTS service: {e}") from e
        except httpx.TimeoutException as e:
            logger.warning(f"iNSIGHTS request timed out after {self.timeout_seconds}s: {e}")
            raise InsightsTimeoutError(f"iNSIGHTS request timed out after {self.timeout_seconds}s") from e
        except httpx.HTTPStatusError as e:
            logger.warning(f"iNSIGHTS API returned HTTP {e.response.status_code}")
            raise InsightsAPIError(e.response.status_code, e.response.text) from e
        except Exception as e:
            if isinstance(e, InsightsClientError):
                raise
            raise InsightsInvalidResponseError(f"Invalid response from iNSIGHTS: {e}") from e

    def fetch_role_details(self, role_id: str) -> Dict[str, Any]:
        """
        Retrieve industry requirements and trends for a specific role.
        """
        url = f"{self.api_url}/api/v1/roles/{role_id}"

        try:
            with httpx.Client(headers=self._get_headers(), timeout=self.timeout_seconds) as client:
                res = client.get(url)
                res.raise_for_status()
                return res.json()
        except httpx.ConnectError as e:
            raise InsightsConnectionError(f"Could not connect to iNSIGHTS: {e}") from e
        except httpx.TimeoutException as e:
            raise InsightsTimeoutError(f"iNSIGHTS request timed out: {e}") from e
        except httpx.HTTPStatusError as e:
            raise InsightsAPIError(e.response.status_code, e.response.text) from e
        except Exception as e:
            if isinstance(e, InsightsClientError):
                raise
            raise InsightsInvalidResponseError(f"Invalid role response from iNSIGHTS: {e}") from e
