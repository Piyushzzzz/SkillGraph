"""
Pydantic validation schemas for SkillGraph AI Engine.
All LLM and fallback outputs are strictly validated against these schemas.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class EvidenceType(str, Enum):
    GITHUB = "github"
    ACADEMIC = "academic"
    HACKATHON = "hackathon"
    PROJECT = "project"
    CLAIMED = "claimed"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SkillCategory(str, Enum):
    PROGRAMMING = "Programming"
    FRONTEND = "Frontend"
    BACKEND = "Backend"
    DATABASE = "Database"
    CLOUD = "Cloud"
    AI_ML = "AI/ML"
    CYBERSECURITY = "Cybersecurity"
    CS_FUNDAMENTALS = "Computer Science Fundamentals"
    DEV_PRACTICES = "Development Practices"
    OTHER = "Other"


class EvidenceItem(BaseModel):
    """
    Evidence item supporting a skill claim.
    Must clearly specify source, verified state, and reason.
    """
    type: EvidenceType = Field(..., description="Source of the evidence")
    reason: str = Field(..., min_length=3, description="Why this evidence supports the skill")
    source: Optional[str] = Field(None, description="Identifier such as repo name, course code, or hackathon name")
    verified: bool = Field(False, description="Whether personal contribution is confirmed")
    details: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary additional context")


class ExtractedSkill(BaseModel):
    """
    Individual extracted skill backed by evidence.
    """
    name: str = Field(..., min_length=1, description="Standardized name of the skill")
    category: SkillCategory = Field(default=SkillCategory.OTHER, description="Taxonomy category")
    confidence: ConfidenceLevel = Field(..., description="Confidence rating")
    evidence: List[EvidenceItem] = Field(default_factory=list, description="All supporting evidence items")

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return v.strip()


class SkillExtractionResult(BaseModel):
    """
    Collection of extracted skills. The primary output schema of extractor.py.
    """
    skills: List[ExtractedSkill] = Field(default_factory=list)


class AcademicRecord(BaseModel):
    """
    Academic evidence representation.
    Academic performance proves exposure, not automatic expertise.
    """
    course_name: str
    grade: str
    skills_exposed: List[str] = Field(default_factory=list)
    institution: Optional[str] = None
    exposure_level: str = "academic exposure"


class HackathonRecord(BaseModel):
    """
    Hackathon evidence representation.
    Explicitly separates participation from concrete technical contributions.
    """
    hackathon_name: str
    participation: bool = True
    technical_evidence: List[str] = Field(
        default_factory=list,
        description="Specific technologies or features personally built during the hackathon"
    )
    project_name: Optional[str] = None
    role: Optional[str] = None


class SkillGapDetail(BaseModel):
    """
    Detailed explanation for a missing or developing skill.
    Never relies on fake precision percentages.
    """
    skill: str
    reason: str
    current_evidence: List[str] = Field(default_factory=list)
    required_evidence: List[str] = Field(default_factory=list)


class GapAnalysisResult(BaseModel):
    """
    Categorized gap analysis result:
    - strong: high confidence, practical code/project evidence
    - developing: academic exposure or early/unverified practice
    - missing: required by target role but no evidence found
    """
    target_role: str
    strong: List[str] = Field(default_factory=list)
    developing: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)
    gap_details: List[SkillGapDetail] = Field(
        default_factory=list,
        description="Granular reasons and required evidence for missing or developing skills"
    )
    summary: Optional[str] = None


class ProjectMission(BaseModel):
    """
    Closed-loop practical project mission designed to close skill gaps
    and generate verifiable evidence.
    """
    title: str = Field(..., description="Action-oriented mission title (e.g., BUILD AND DEPLOY A PRODUCTION REST API)")
    target_role: str
    description: str
    targeted_gaps: List[str] = Field(default_factory=list, description="Skills this mission intends to build and prove")
    requirements: List[str] = Field(default_factory=list, description="Technical requirements to implement")
    expected_evidence: List[str] = Field(
        default_factory=list,
        description="Tangible artifacts to produce (GitHub repo, README, tests, deployment URL)"
    )
    milestones: List[str] = Field(default_factory=list, description="Step-by-step development phases")


class StudentProfileInput(BaseModel):
    """
    Combined input payload submitted to the intelligence layer for analysis.
    """
    student_id: Optional[str] = None
    claimed_skills: List[str] = Field(default_factory=list)
    github_username: Optional[str] = None
    repositories_metadata: List[Dict[str, Any]] = Field(default_factory=list)
    academic_records: List[AcademicRecord] = Field(default_factory=list)
    hackathon_records: List[HackathonRecord] = Field(default_factory=list)
    project_descriptions: List[str] = Field(default_factory=list)
    resume_text: Optional[str] = None
