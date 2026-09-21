from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(String(100), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(JSON, nullable=False, default=list)  # list of action requirements
    expected_evidence = Column(JSON, nullable=False, default=list)  # expected artifacts/proofs
    status = Column(String(50), default="pending", nullable=False)  # 'pending', 'in_progress', 'completed'
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="missions")
    role = relationship("Role", back_populates="missions")
