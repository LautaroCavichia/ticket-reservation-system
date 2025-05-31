"""
Shared utility functions used across the application.

Provides common helper functions for validation, formatting,
and data manipulation that can be reused by multiple modules.
"""
import re
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from decimal import Decimal


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.
    
    Args:
        length: Length of the token to generate
        
    Returns:
        Secure random token string
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if email format is valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def format_currency(amount: Decimal, currency: str = 'USD') -> str:
    """
    Format decimal amount as currency string.
    
    Args:
        amount: Decimal amount to format
        currency: Currency code (default: USD)
        
    Returns:
        Formatted currency string
    """
    if currency == 'USD':
        return f"${amount:.2f}"
    else:
        return f"{amount:.2f} {currency}"


def calculate_pagination_info(page: int, per_page: int, total: int) -> Dict[str, Any]:
    """
    Calculate pagination information for API responses.
    
    Args:
        page: Current page number
        per_page: Items per page
        total: Total number of items
        
    Returns:
        Dictionary with pagination metadata
    """
    pages = (total + per_page - 1) // per_page  # Ceiling division
    
    return {
        'page': page,
        'per_page': per_page,
        'total': total,
        'pages': pages,
        'has_next': page < pages,
        'has_prev': page > 1,
        'next_page': page + 1 if page < pages else None,
        'prev_page': page - 1 if page > 1 else None
    }


def sanitize_search_term(search_term: str) -> str:
    """
    Sanitize search term for database queries.
    
    Args:
        search_term: Raw search term from user input
        
    Returns:
        Sanitized search term safe for database queries
    """
    if not search_term:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[%_\\]', '', search_term.strip())
    
    # Limit length to prevent abuse
    return sanitized[:100]


def parse_datetime_string(datetime_str: str) -> Optional[datetime]:
    """
    Parse datetime string with multiple format support.
    
    Args:
        datetime_str: Datetime string to parse
        
    Returns:
        Parsed datetime object or None if parsing fails
    """
    formats = [
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%d',
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(datetime_str, fmt)
        except ValueError:
            continue
    
    return None


def calculate_business_days(start_date: datetime, days: int) -> datetime:
    """
    Calculate business days from a start date.
    
    Args:
        start_date: Starting date
        days: Number of business days to add
        
    Returns:
        End date after adding business days
    """
    current_date = start_date
    days_added = 0
    
    while days_added < days:
        current_date += timedelta(days=1)
        if current_date.weekday() < 5:  # Monday = 0, Sunday = 6
            days_added += 1
    
    return current_date


def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """
    Split a list into chunks of specified size.
    
    Args:
        lst: List to chunk
        chunk_size: Size of each chunk
        
    Returns:
        List of chunked sublists
    """
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]


def deep_merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
    """
    Deep merge two dictionaries.
    
    Args:
        dict1: First dictionary
        dict2: Second dictionary (takes precedence)
        
    Returns:
        Merged dictionary
    """
    result = dict1.copy()
    
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge_dicts(result[key], value)
        else:
            result[key] = value
    
    return result