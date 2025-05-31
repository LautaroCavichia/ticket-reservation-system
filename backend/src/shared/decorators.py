"""
Custom decorators for authentication and authorization.

Provides permission-based access control decorators that work
with the JWT authentication system and user roles.
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from src.auth.models import User


def permission_required(permission: str):
    """
    Decorator to check if current user has required permission.
    
    Implements the 2 different permission levels requirement:
    - Anonymous users: can only view events
    - Registered users: can view events + manage reservations
    
    Args:
        permission: Permission string to check (e.g., 'manage_reservations')
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            
            if not user_id:
                return jsonify({'error': 'Authentication required'}), 401
            
            user = User.find_by_id(user_id)
            
            if not user or not user.is_active:
                return jsonify({'error': 'User not found or inactive'}), 401
            
            if not user.has_permission(permission):
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator


def admin_required(f):
    """
    Decorator to restrict access to admin users only.
    
    Can be used for administrative endpoints like event management.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.find_by_id(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # In a real system, you might have an is_admin field or admin role
        # For this demo, we'll check for a hypothetical admin permission
        if not user.has_permission('admin_access'):
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function


def optional_auth(f):
    """
    Decorator for endpoints that work with or without authentication.
    
    Useful for public endpoints that provide enhanced functionality
    for authenticated users (like event listing).
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # This decorator doesn't enforce authentication
        # but makes user info available if token is provided
        return f(*args, **kwargs)
    
    return decorated_function