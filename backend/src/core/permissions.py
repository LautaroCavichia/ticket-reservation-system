"""
Permission definitions and validation logic.

Centralizes permission constants and validation logic for
the role-based access control system.
"""
from enum import Enum
from typing import Dict, Set
from src.auth.models import UserRole


class Permission(Enum):
    """
    Enumeration of all available permissions in the system.
    
    Defines the complete set of permissions that can be
    assigned to user roles for access control.
    """
    VIEW_EVENTS = "view_events"
    MANAGE_RESERVATIONS = "manage_reservations"
    MANAGE_EVENTS = "manage_events"
    ADMIN_ACCESS = "admin_access"


# Permission mapping for user roles (implements 2 different permission levels)
ROLE_PERMISSIONS: Dict[UserRole, Set[Permission]] = {
    UserRole.ANONYMOUS: {
        Permission.VIEW_EVENTS,
    },
    UserRole.REGISTERED: {
        Permission.VIEW_EVENTS,
        Permission.MANAGE_RESERVATIONS,
    }
}


def user_has_permission(user_role: UserRole, permission: str) -> bool:
    """
    Check if user role has specific permission.
    
    Args:
        user_role: User's role enum value
        permission: Permission string to check
    
    Returns:
        True if user has permission, False otherwise
    """
    try:
        perm_enum = Permission(permission)
        return perm_enum in ROLE_PERMISSIONS.get(user_role, set())
    except ValueError:
        # Permission doesn't exist
        return False


def get_user_permissions(user_role: UserRole) -> Set[str]:
    """
    Get all permissions for a user role.
    
    Args:
        user_role: User's role enum value
    
    Returns:
        Set of permission strings
    """
    permissions = ROLE_PERMISSIONS.get(user_role, set())
    return {perm.value for perm in permissions}


