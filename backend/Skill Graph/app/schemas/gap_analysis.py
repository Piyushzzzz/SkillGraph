from typing import List
from pydantic import BaseModel


class GapAnalysisResponse(BaseModel):
    """
    Deterministic gap analysis comparing student evidence against role required skills.
    Categorized strictly into strong, developing, and missing.
    """
    role: str
    strong: List[str]
    developing: List[str]
    missing: List[str]
