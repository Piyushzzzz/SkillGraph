"""
In-memory caching layer for iNSIGHTS requests.
Caches role and skill-gap context to avoid unnecessary repeated external HTTP requests.
"""

import time
import logging
from typing import Dict, List, Optional, Tuple, Any
from .insights_mapper import InsightsContext

logger = logging.getLogger("insights.cache")


class InsightsCache:
    """
    Thread-safe in-memory cache with time-to-live (TTL) expiration.
    Keys are generated from target_role + sorted missing_skills.
    """

    def __init__(self, default_ttl_seconds: float = 3600.0):
        self.default_ttl = default_ttl_seconds
        # Storage: key -> (InsightsContext, expiration_timestamp)
        self._store: Dict[str, Tuple[InsightsContext, float]] = {}

    @classmethod
    def make_key(cls, target_role: str, missing_skills: List[str]) -> str:
        """
        Generate a normalized, deterministic cache key.
        """
        norm_role = target_role.strip().lower()
        norm_skills = sorted([s.strip().lower() for s in missing_skills if s.strip()])
        return f"{norm_role}::gaps={','.join(norm_skills)}"

    def get(self, target_role: str, missing_skills: List[str]) -> Optional[InsightsContext]:
        """
        Retrieve cached InsightsContext if present and unexpired.
        """
        key = self.make_key(target_role, missing_skills)
        if key not in self._store:
            return None

        context, exp_time = self._store[key]
        if time.time() > exp_time:
            logger.debug(f"Cache expired for key: {key}")
            del self._store[key]
            return None

        logger.debug(f"Cache hit for key: {key}")
        return context

    def set(
        self,
        target_role: str,
        missing_skills: List[str],
        context: InsightsContext,
        ttl_seconds: Optional[float] = None,
    ) -> None:
        """
        Store InsightsContext in cache with TTL.
        """
        key = self.make_key(target_role, missing_skills)
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        expiration = time.time() + ttl
        self._store[key] = (context, expiration)
        logger.debug(f"Cached context for key: {key} (TTL: {ttl}s)")

    def clear(self) -> None:
        """
        Clear all entries from cache.
        """
        self._store.clear()

    def size(self) -> int:
        """
        Return count of currently active (non-expired) cached entries.
        """
        now = time.time()
        # Clean expired keys on size check
        expired = [k for k, (_, exp) in self._store.items() if now > exp]
        for k in expired:
            del self._store[k]
        return len(self._store)
