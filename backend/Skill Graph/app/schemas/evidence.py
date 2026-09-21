import datetime as dt
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict
from app.utils.validators import validate_url_value, validate_evidence_type_value

try:
    from pydantic import field_validator
    def validator_compat(*fields):
        return field_validator(*fields, mode="after")
except ImportError:
    from pydantic import validator
    def validator_compat(*fields):
        return validator(*fields, allow_reuse=True)


class SkillLinkInput(BaseModel):
    skill_id: str
    confidence: float = Field(1.0, ge=0.0, le=1.0)
    reason: Optional[str] = None


class SkillLinkResponse(BaseModel):
    skill_id: str
    skill_name: Optional[str] = None
    confidence: float
    reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- Base Evidence ---
class EvidenceBase(BaseModel):
    type: str = Field(..., description="Evidence type: 'project', 'hackathon', or 'certificate'")
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    source_url: Optional[str] = None
    date: Optional[dt.date] = None
    verification_status: str = Field("pending", max_length=50)

    @validator_compat("type")
    def check_type(cls, v):
        return validate_evidence_type_value(v)

    @validator_compat("source_url")
    def check_url(cls, v):
        return validate_url_value(v)


class EvidenceResponse(EvidenceBase):
    id: int
    user_id: int
    created_at: dt.datetime
    skills: List[SkillLinkResponse] = []
    details: Optional[Any] = None

    model_config = ConfigDict(from_attributes=True)


# --- Project Evidence ---
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    project_name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=255)
    contribution: str = Field(..., min_length=1)
    technologies: List[str] = Field(..., min_length=1)
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    source_url: Optional[str] = None
    date: Optional[dt.date] = None
    skills: Optional[List[SkillLinkInput]] = None

    @validator_compat("github_url", "demo_url", "source_url")
    def check_urls(cls, v):
        return validate_url_value(v)


class ProjectDetailResponse(BaseModel):
    id: int
    project_name: str
    role: str
    contribution: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- Hackathon Evidence ---
class HackathonCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    hackathon_name: str = Field(..., min_length=1, max_length=255)
    organization: str = Field(..., min_length=1, max_length=255)
    project_name: str = Field(..., min_length=1, max_length=255)
    team_name: Optional[str] = Field(None, max_length=255)
    role: str = Field(..., min_length=1, max_length=255)
    contribution: str = Field(..., min_length=1)
    technologies: List[str] = Field(..., min_length=1)
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    achievement: Optional[str] = Field(None, max_length=255)
    source_url: Optional[str] = None
    date: Optional[dt.date] = None
    skills: Optional[List[SkillLinkInput]] = None

    @validator_compat("github_url", "demo_url", "source_url")
    def check_urls(cls, v):
        return validate_url_value(v)


class HackathonDetailResponse(BaseModel):
    id: int
    hackathon_name: str
    organization: str
    project_name: str
    team_name: Optional[str] = None
    role: str
    contribution: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    achievement: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- Certificate Evidence ---
class CertificateCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    issuer: str = Field(..., min_length=1, max_length=255)
    certificate_name: str = Field(..., min_length=1, max_length=255)
    certificate_url: Optional[str] = None
    source_url: Optional[str] = None
    date: Optional[dt.date] = None
    skills: Optional[List[SkillLinkInput]] = None

    @validator_compat("certificate_url", "source_url")
    def check_urls(cls, v):
        return validate_url_value(v)


class CertificateDetailResponse(BaseModel):
    id: int
    issuer: str
    certificate_name: str
    certificate_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- General Evidence Creation ---
class EvidenceCreateGeneral(EvidenceBase):
    skills: Optional[List[SkillLinkInput]] = None
