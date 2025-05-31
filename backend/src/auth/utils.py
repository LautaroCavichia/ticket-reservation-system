# backend/src/auth/utils.py - Updated token creation function
"""
Authentication utility functions.

Provides helper functions for password validation, token generation,
and other authentication-related operations.
"""
import re
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from flask_jwt_extended import create_access_token, decode_token
from flask_bcrypt import generate_password_hash, check_password_hash


def create_access_token_with_claims(user_id: int, additional_claims: Dict[str, Any] = None) -> str:
    """
    Create JWT access token with additional claims.
    
    Args:
        user_id: User ID to include in token
        additional_claims: Additional claims to include
        
    Returns:
        JWT token string
    """
    # Ensure user_id is properly set as identity
    identity = str(user_id)  # Convert to string for consistency
    
    # Add standard claims
    claims = additional_claims or {}
    claims.update({
        'user_id': user_id,
        'issued_at': datetime.utcnow().isoformat(),
        'type': 'access'
    })
    
    # Create token with proper expiration
    token = create_access_token(
        identity=identity,
        additional_claims=claims,
        expires_delta=timedelta(hours=1)  # Explicitly set expiration
    )
    
    return token


def validate_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Validate and decode JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        decoded = decode_token(token)
        return decoded
    except Exception as e:
        print(f"Token validation error: {e}")  # Debug logging
        return None


def hash_password(password: str) -> str:
    """
    Hash password using secure algorithm.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return generate_password_hash(password).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify password against hash.
    
    Args:
        password: Plain text password
        password_hash: Stored password hash
        
    Returns:
        True if password matches, False otherwise
    """
    return check_password_hash(password_hash, password)


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength according to security requirements.
    
    Args:
        password: Password string to validate
        
    Returns:
        Dictionary with validation result and specific errors
    """
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if len(password) > 128:
        errors.append("Password must be less than 128 characters")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    return {
        'is_valid': len(errors) == 0,
        'errors': errors,
        'strength_score': calculate_password_strength_score(password)
    }


def calculate_password_strength_score(password: str) -> int:
    """
    Calculate password strength score from 0-100.
    
    Args:
        password: Password to evaluate
        
    Returns:
        Strength score (0-100)
    """
    score = 0
    
    # Length bonus
    if len(password) >= 8:
        score += 20
    if len(password) >= 12:
        score += 10
    if len(password) >= 16:
        score += 10
    
    # Character variety bonus
    if re.search(r'[a-z]', password):
        score += 10
    if re.search(r'[A-Z]', password):
        score += 10
    if re.search(r'\d', password):
        score += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 15
    
    return max(0, min(100, score))


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.
    
    Args:
        length: Length of token to generate
        
    Returns:
        Secure random token string
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))