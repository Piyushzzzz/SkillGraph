from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class SkillBase(BaseModel):
    id: str = Field(..., description="Unique skill slug ID, e.g. 'python'")
    name: str = Field(..., description="Display name of the skill, e.g. 'Python'")
    category: str = Field(..., description="Category, e.g. 'programming', 'database', 'ai_ml'")
    description: Optional[str] = None


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    model_config = ConfigDict(from_attributes=True)


class SkillDetailResponse(SkillResponse):
    evidence_count: int = 0
    related_skills: List[str] = []


# --- React Flow Schemas ---
class ReactFlowNode(BaseModel):
    id: str
    label: str
    category: str
    evidence_count: int = 0


class ReactFlowEdge(BaseModel):
    source: str
    target: str
    relationship: str


class SkillGraphResponse(BaseModel):
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]


# --- Role Schemas ---
class RoleSkillItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    importance: str = "required"


class RoleBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None


class RoleResponse(RoleBase):
    skills_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class RoleDetailResponse(RoleBase):
    skills: List[RoleSkillItem] = []

    model_config = ConfigDict(from_attributes=True)
