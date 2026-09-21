from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.utils.validators import validate_cgpa_value, validate_semester_value, validate_grade_value

try:
    from pydantic import field_validator
    def validator_compat(*fields):
        return field_validator(*fields, mode="after")
except ImportError:
    from pydantic import validator
    def validator_compat(*fields):
        return validator(*fields, allow_reuse=True)


class UserProfileBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full name of student")
    email: str = Field(..., min_length=3, max_length=255, description="Student email address")
    university: Optional[str] = Field(None, max_length=255)
    degree: Optional[str] = Field(None, max_length=255)
    branch: Optional[str] = Field(None, max_length=255)
    semester: Optional[int] = Field(None, description="Current semester (1 to 12)")
    cgpa: Optional[float] = Field(None, description="Cumulative GPA (0.0 to 10.0)")

    @validator_compat("cgpa")
    def check_cgpa(cls, v):
        return validate_cgpa_value(v)

    @validator_compat("semester")
    def check_semester(cls, v):
        return validate_semester_value(v)


class UserProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[str] = Field(None, min_length=3, max_length=255)
    university: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None

    @validator_compat("cgpa")
    def check_cgpa(cls, v):
        return validate_cgpa_value(v)

    @validator_compat("semester")
    def check_semester(cls, v):
        return validate_semester_value(v)


class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


class SubjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    grade: str = Field(..., min_length=1, max_length=10)
    credits: float = Field(..., ge=0.5, le=30.0)

    @validator_compat("grade")
    def check_grade(cls, v):
        return validate_grade_value(v)


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
        orm_mode = True


class AcademicSummaryResponse(BaseModel):
    user_id: int
    cgpa: Optional[float] = None
    semester: Optional[int] = None
    total_credits: float = 0.0
    subjects: List[SubjectResponse] = []

    class Config:
        from_attributes = True
        orm_mode = True
