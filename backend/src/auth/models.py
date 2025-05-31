"""
User authentication models.

Extended User model with role-based permissions and
custom fields for the ticket reservation system.
"""
from enum import Enum
from typing import List
from sqlalchemy import Column, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from flask_bcrypt import generate_password_hash, check_password_hash

from src.shared.base_model import BaseModel


class UserRole(Enum):
    """Enumeration of available user roles with their permission levels."""
    ANONYMOUS = "anonymous"  # Can only view events
    REGISTERED = "registered"  # Can create/manage reservations


class User(BaseModel):
    """
    Extended user model with role-based access control.
    
    Provides authentication, authorization, and user management
    functionality with customizable roles and permissions.
    """
    __tablename__ = 'users'
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.REGISTERED, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="user", cascade="all, delete-orphan")
    
    def set_password(self, password: str) -> None:
        """Hash and set user password securely."""
        self.password_hash = generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        """Verify password against stored hash."""
        return check_password_hash(self.password_hash, password)
    
    @property
    def full_name(self) -> str:
        """Get user's full name for display purposes."""
        return f"{self.first_name} {self.last_name}"
    
    def has_permission(self, permission: str) -> bool:
        """
        Check if user has specific permission based on role.
        
        Permission hierarchy:
        - ANONYMOUS: view_events
        - REGISTERED: view_events, manage_reservations
        """
        permissions = {
            UserRole.ANONYMOUS: ['view_events'],
            UserRole.REGISTERED: ['view_events', 'manage_reservations']
        }
        
        return permission in permissions.get(self.role, [])
    
    def to_dict(self) -> dict:
        """Override to exclude sensitive information."""
        data = super().to_dict()
        data.pop('password_hash', None)
        data['full_name'] = self.full_name
        return data
    
    def __repr__(self) -> str:
        return f"<User(email={self.email}, role={self.role.value})>"