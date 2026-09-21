from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.skill import Skill, SkillEvidence, SkillGraphEdge
from app.models.evidence import Evidence
from app.services.profile_service import get_user_profile


def get_all_skills(db: Session) -> List[Skill]:
    """Retrieves all registered skills ordered by category and name."""
    return db.query(Skill).order_by(Skill.category, Skill.name).all()


def get_skill_by_id(db: Session, skill_id: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Retrieves detailed skill information, evidence count, and related connected skills.
    """
    clean_id = skill_id.strip().lower()
    skill = db.query(Skill).filter(Skill.id == clean_id).first()
    if not skill:
        # Fallback search by name
        skill = db.query(Skill).filter(Skill.name.ilike(clean_id)).first()
        
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill '{skill_id}' not found."
        )

    user = get_user_profile(db, user_id)
    evidence_count = (
        db.query(func.count(SkillEvidence.id))
        .join(Evidence, SkillEvidence.evidence_id == Evidence.id)
        .filter(SkillEvidence.skill_id == skill.id, Evidence.user_id == user.id)
        .scalar() or 0
    )

    # Connected skills via graph edges
    outgoing = [edge.target_skill_id for edge in skill.outgoing_edges]
    incoming = [edge.source_skill_id for edge in skill.incoming_edges]
    related_skills = list(set(outgoing + incoming))

    return {
        "id": skill.id,
        "name": skill.name,
        "category": skill.category,
        "description": skill.description,
        "evidence_count": evidence_count,
        "related_skills": related_skills,
    }


def get_skill_graph(db: Session, user_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Constructs the complete Skill Graph with nodes and edges.
    Nodes and Edges match React Flow specification directly:
    {
      "nodes": [
        { "id": "python", "label": "Python", "category": "programming", "evidence_count": 3 }
      ],
      "edges": [
        { "source": "python", "target": "fastapi", "relationship": "used_with" }
      ]
    }
    """
    user = get_user_profile(db, user_id)

    # 1. Count evidence per skill for the active user
    counts_query = (
        db.query(SkillEvidence.skill_id, func.count(SkillEvidence.id))
        .join(Evidence, SkillEvidence.evidence_id == Evidence.id)
        .filter(Evidence.user_id == user.id)
        .group_by(SkillEvidence.skill_id)
        .all()
    )
    evidence_counts = {skill_id: count for skill_id, count in counts_query}

    # 2. Fetch all skills to create nodes
    skills = db.query(Skill).all()
    nodes = []
    for s in skills:
        nodes.append({
            "id": s.id,
            "label": s.name,
            "category": s.category,
            "evidence_count": evidence_counts.get(s.id, 0),
        })

    # 3. Fetch all graph edges
    edges_orm = db.query(SkillGraphEdge).all()
    edges = []
    for e in edges_orm:
        edges.append({
            "source": e.source_skill_id,
            "target": e.target_skill_id,
            "relationship": e.relationship,
        })

    return {
        "nodes": nodes,
        "edges": edges,
    }
