"""
Base model providing common functionality for all database models.

Implements audit fields, common query methods, and serialization
helpers that every model in the system should inherit.
"""
from datetime import datetime
from typing import Dict, Any
from sqlalchemy import Column, DateTime, Integer
from src.core.extensions import db


class BaseModel(db.Model):
    """
    Abstract base model providing common functionality.
    
    All models should inherit from this to get consistent
    audit fields and common methods.
    """
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def save(self) -> 'BaseModel':
        """Persist model instance to database."""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self) -> None:
        """Remove model instance from database."""
        db.session.delete(self)
        db.session.commit()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary representation."""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
    
    @classmethod
    def find_by_id(cls, id: int):
        """Find model instance by primary key."""
        return cls.query.get(id)
    
    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(id={self.id})>"