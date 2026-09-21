from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class MissionGenerateRequest(BaseModel):
    role_id: str = Field(..., description="Target role ID for gap-focused mission generation")
    user_id: Optional[int] = Field(None, description="Optional student user ID (defaults to active user)")
    custom_focus_skills: Optional[List[str]] = Field(None, description="Optional skills to prioritize")


class MissionResponse(BaseModel):
    id: int
    user_id: int
    role_id: str
    title: str
    description: str
    requirements: List[str]
    expected_evidence: List[str]
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

