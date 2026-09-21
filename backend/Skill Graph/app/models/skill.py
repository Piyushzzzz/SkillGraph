from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship as sa_relationship
from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    # slug-based ID e.g. "python", "fastapi", "docker" for direct React Flow compatibility
    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    evidence_links = sa_relationship("SkillEvidence", back_populates="skill", cascade="all, delete-orphan")
    role_links = sa_relationship("RoleSkill", back_populates="skill", cascade="all, delete-orphan")
    outgoing_edges = sa_relationship(
        "SkillGraphEdge",
        foreign_keys="SkillGraphEdge.source_skill_id",
        back_populates="source_skill",
        cascade="all, delete-orphan",
    )
    incoming_edges = sa_relationship(
        "SkillGraphEdge",
        foreign_keys="SkillGraphEdge.target_skill_id",
        back_populates="target_skill",
        cascade="all, delete-orphan",
    )


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    confidence = Column(Float, default=1.0, nullable=False)
    reason = Column(Text, nullable=True)

    # Relationships
    skill = sa_relationship("Skill", back_populates="evidence_links")
    evidence = sa_relationship("Evidence", back_populates="skill_links")


class Role(Base):
    __tablename__ = "roles"

    # slug-based ID e.g. "backend-developer", "frontend-developer"
    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    role_skills = sa_relationship("RoleSkill", back_populates="role", cascade="all, delete-orphan")
    missions = sa_relationship("Mission", back_populates="role", cascade="all, delete-orphan")


class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_id = Column(String(100), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    importance = Column(String(50), default="required", nullable=False)  # 'core', 'required', 'preferred'

    # Relationships
    role = sa_relationship("Role", back_populates="role_skills")
    skill = sa_relationship("Skill", back_populates="role_links")


class SkillGraphEdge(Base):
    __tablename__ = "skill_graph_edges"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    target_skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    relationship = Column(String(100), nullable=False)  # 'used_with', 'prerequisite_for', 'specialization_of'

    # Relationships
    source_skill = sa_relationship("Skill", foreign_keys="SkillGraphEdge.source_skill_id", back_populates="outgoing_edges")
    target_skill = sa_relationship("Skill", foreign_keys="SkillGraphEdge.target_skill_id", back_populates="incoming_edges")
