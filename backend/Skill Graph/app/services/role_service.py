from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.skill import Role, RoleSkill


def get_all_roles(db: Session) -> List[Dict[str, Any]]:
    """Retrieves all roles with count of associated skills."""
    roles = db.query(Role).all()
    results = []
    for r in roles:
        results.append({
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "skills_count": len(r.role_skills),
        })
    return results


def get_role_by_id(db: Session, role_id: str) -> Dict[str, Any]:
    """Retrieves single role with its full list of required skills and importance levels."""
    clean_id = role_id.strip().lower()
    role = db.query(Role).filter(Role.id == clean_id).first()
    if not role:
        # Try matching by name
        role = db.query(Role).filter(Role.name.ilike(clean_id)).first()

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role '{role_id}' not found."
        )

    skills_data = []
    for rs in role.role_skills:
        if rs.skill:
            skills_data.append({
                "skill_id": rs.skill.id,
                "skill_name": rs.skill.name,
                "category": rs.skill.category,
                "importance": rs.importance,
            })

    return {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "skills": skills_data,
    }
