from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # 'project', 'hackathon', 'certificate'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=True)
    date = Column(Date, nullable=True)
    verification_status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="evidence_items")
    project = relationship("Project", uselist=False, back_populates="evidence", cascade="all, delete-orphan")
    hackathon = relationship("Hackathon", uselist=False, back_populates="evidence", cascade="all, delete-orphan")
    certificate = relationship("Certificate", uselist=False, back_populates="evidence", cascade="all, delete-orphan")
    skill_links = relationship("SkillEvidence", back_populates="evidence", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), unique=True, nullable=False)
    project_name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    contribution = Column(Text, nullable=False)
    technologies = Column(JSON, nullable=False, default=list)  # list of strings
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)

    # Relationship
    evidence = relationship("Evidence", back_populates="project")


class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), unique=True, nullable=False)
    hackathon_name = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    project_name = Column(String(255), nullable=False)
    team_name = Column(String(255), nullable=True)
    role = Column(String(255), nullable=False)
    contribution = Column(Text, nullable=False)
    technologies = Column(JSON, nullable=False, default=list)
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    achievement = Column(String(255), nullable=True)

    # Relationship
    evidence = relationship("Evidence", back_populates="hackathon")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), unique=True, nullable=False)
    issuer = Column(String(255), nullable=False)
    certificate_name = Column(String(255), nullable=False)
    certificate_url = Column(String(500), nullable=True)

    # Relationship
    evidence = relationship("Evidence", back_populates="certificate")
