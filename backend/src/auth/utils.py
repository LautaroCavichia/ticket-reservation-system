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
    
    # Optional: Check for special characters
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password should contain at least one special character")
    
    # Check for common weak passwords
    weak_passwords = [
        'password', '123456', 'password123', 'admin', 'user',
        'qwerty', 'abc123', 'letmein', 'welcome', 'monkey'
    ]
    
    if password.lower() in weak_passwords:
        errors.append("Password is too common, please choose a stronger password")
    
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
    
    # Pattern penalties
    if re.search(r'(.)\1{2,}', password):  # Repeated characters
        score -= 10
    if re.search(r'(012|123|234|345|456|567|678|789|890)', password):  # Sequential numbers
        score -= 10
    if re.search(r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)', password.lower()):  # Sequential letters
        score -= 10
    
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


def create_access_token_with_claims(user_id: int, additional_claims: Dict[str, Any] = None) -> str:
    """
    Create JWT access token with additional claims.
    
    Args:
        user_id: User ID to include in token
        additional_claims: Additional claims to include
        
    Returns:
        JWT token string
    """
    claims = additional_claims or {}
    claims['user_id'] = user_id
    claims['issued_at'] = datetime.utcnow().isoformat()
    
    return create_access_token(
        identity=user_id,
        additional_claims=claims
    )


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
    except Exception:
        return None


def hash_password(password: str) -> str:
    """
    Hash password using secure algorithm.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return generate_password_hash(password)


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


def generate_password_reset_token(user_id: int) -> str:
    """
    Generate password reset token with expiration.
    
    Args:
        user_id: User ID for password reset
        
    Returns:
        Password reset token
    """
    expires = timedelta(hours=1)  # Reset token valid for 1 hour
    
    return create_access_token(
        identity=user_id,
        expires_delta=expires,
        additional_claims={'type': 'password_reset'}
    )


def validate_email_format(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid email format, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_user_input(input_string: str) -> str:
    """
    Sanitize user input to prevent injection attacks.
    
    Args:
        input_string: Raw user input
        
    Returns:
        Sanitized input string
    """
    if not input_string:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\';()&+]', '', input_string)
    
    # Limit length to prevent abuse
    return sanitized[:255].strip()


def check_rate_limit(user_id: int, action: str, limit: int = 5, window: int = 300) -> bool:
    """
    Simple rate limiting check (in production, use Redis or similar).
    
    Args:
        user_id: User ID to check
        action: Action being performed
        limit: Maximum number of attempts
        window: Time window in seconds
        
    Returns:
        True if within rate limit, False if exceeded
    """
    # This is a simple in-memory implementation
    # In production, use Redis or a proper rate limiting service
    from collections import defaultdict
    from time import time
    
    if not hasattr(check_rate_limit, 'attempts'):
        check_rate_limit.attempts = defaultdict(list)
    
    key = f"{user_id}:{action}"
    now = time()
    
    # Clean old attempts
    check_rate_limit.attempts[key] = [
        timestamp for timestamp in check_rate_limit.attempts[key]
        if now - timestamp < window
    ]
    
    # Check if limit exceeded
    if len(check_rate_limit.attempts[key]) >= limit:
        return False
    
    # Record this attempt
    check_rate_limit.attempts[key].append(now)
    return True


def mask_sensitive_data(data: str, show_chars: int = 4) -> str:
    """
    Mask sensitive data for logging/display.
    
    Args:
        data: Sensitive string to mask
        show_chars: Number of characters to show at the end
        
    Returns:
        Masked string
    """
    if len(data) <= show_chars:
        return '*' * len(data)
    
    return '*' * (len(data) - show_chars) + data[-show_chars:]