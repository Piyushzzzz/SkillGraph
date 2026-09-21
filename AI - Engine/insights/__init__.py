"""
iNSIGHTS Module for SkillGraph.
Provides external market intelligence, role context, technology trend mappings,
and caching for closing skill gaps.
"""

from .insights_client import (
    InsightsClient,
    InsightsClientError,
    InsightsConnectionError,
    InsightsTimeoutError,
    InsightsAPIError,
    InsightsInvalidResponseError,
)
from .insights_mapper import (
    InsightsInput,
    InsightsContext,
    InsightsStatusResponse,
    InsightsMapper,
)
from .insights_cache import InsightsCache
from .insights_service import InsightsService
from .insights_router import router as insights_router

__all__ = [
    "InsightsClient",
    "InsightsClientError",
    "InsightsConnectionError",
    "InsightsTimeoutError",
    "InsightsAPIError",
    "InsightsInvalidResponseError",
    "InsightsInput",
    "InsightsContext",
    "InsightsStatusResponse",
    "InsightsMapper",
    "InsightsCache",
    "InsightsService",
    "insights_router",
]
