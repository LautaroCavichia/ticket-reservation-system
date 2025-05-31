"""
Authentication API endpoints.

Handles user registration, login, token management,
and provides user session information.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError

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
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    # Create response data with proper structure
    response_data = {
        'access_token': access_token,
        'user': user.to_dict(),  # Use to_dict() instead of schema dump to avoid serialization issues
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
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    # Create response data with proper structure
    response_data = {
        'access_token': access_token,
        'user': user.to_dict(),  # Use to_dict() instead of schema dump
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
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200