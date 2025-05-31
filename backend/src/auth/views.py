# backend/src/auth/views.py
"""
Authentication API endpoints.

Handles user registration, login, token management,
and provides user session information.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError
from datetime import timedelta

from src.auth.models import User
from src.auth.schemas import (
    UserRegistrationSchema, 
    UserLoginSchema, 
    UserResponseSchema,
    TokenResponseSchema
)
from src.core.extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Schema instances
user_registration_schema = UserRegistrationSchema()
user_login_schema = UserLoginSchema()
user_response_schema = UserResponseSchema()
token_response_schema = TokenResponseSchema()


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user account.
    
    Creates a new user with REGISTERED role by default,
    allowing them to make reservations.
    """
    try:
        data = user_registration_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    user = User(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    user.set_password(data['password'])
    user.save()
    
    # Generate access token with proper configuration
    access_token = create_access_token(
        identity=str(user.id),  # Convert to string for consistency
        expires_delta=timedelta(hours=1),
        additional_claims={
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value if user.role else 'registered'
        }
    )
    
    # Create response data
    response_data = {
        'access_token': access_token,
        'user': user.to_dict(),
        'expires_in': 3600
    }
    
    return jsonify(response_data), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate user and return access token.
    
    Validates credentials and returns JWT token for
    subsequent API requests.
    """
    try:
        data = user_login_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 401
    
    # Generate access token with proper configuration
    access_token = create_access_token(
        identity=str(user.id),  # Convert to string for consistency
        expires_delta=timedelta(hours=1),
        additional_claims={
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value if user.role else 'registered'
        }
    )
    
    # Create response data
    response_data = {
        'access_token': access_token,
        'user': user.to_dict(),
        'expires_in': 3600
    }
    
    return jsonify(response_data), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current authenticated user information.
    
    Returns user profile data for the authenticated user
    based on the JWT token.
    """
    try:
        user_id = get_jwt_identity()
        
        # Convert to int if it's a string
        if isinstance(user_id, str):
            user_id = int(user_id)
        
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        return jsonify(user.to_dict()), 200
        
    except ValueError as e:
        return jsonify({'error': 'Invalid user ID in token'}), 401
    except Exception as e:
        return jsonify({'error': 'Token validation failed'}), 401


# Add a debug endpoint to help diagnose token issues (remove in production)
@auth_bp.route('/debug/token', methods=['GET'])
@jwt_required()
def debug_token():
    """Debug endpoint to check token claims."""
    try:
        from flask_jwt_extended import get_jwt
        
        user_id = get_jwt_identity()
        claims = get_jwt()
        
        return jsonify({
            'user_id': user_id,
            'claims': claims,
            'user_id_type': type(user_id).__name__
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400