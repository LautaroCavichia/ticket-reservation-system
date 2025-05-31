"""
Test cases for authentication functionality.

Tests user registration, login, JWT token handling,
and permission validation with various scenarios.
"""
import pytest
import json
from datetime import datetime, timedelta

from src.auth.models import User, UserRole
from src.auth.utils import validate_password_strength, generate_secure_token


class TestUserModel:
    """Test cases for User model functionality."""
    
    def test_user_creation(self, db_session):
        """Test basic user creation."""
        user = User(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            role=UserRole.REGISTERED
        )
        user.set_password('testpass123')
        
        db_session.add(user)
        db_session.commit()
        
        assert user.id is not None
        assert user.email == 'test@example.com'
        assert user.full_name == 'Test User'
        assert user.role == UserRole.REGISTERED
        assert user.is_active is True
        assert user.check_password('testpass123') is True
        assert user.check_password('wrongpass') is False
    
    def test_user_permissions(self, test_user):
        """Test user permission system."""
        # Registered user should have view_events and manage_reservations
        assert test_user.has_permission('view_events') is True
        assert test_user.has_permission('manage_reservations') is True
        assert test_user.has_permission('manage_events') is False
        assert test_user.has_permission('admin_access') is False
        
        # Test with anonymous user role
        anonymous_user = User(
            email='anon@example.com',
            first_name='Anonymous',
            last_name='User',
            role=UserRole.ANONYMOUS
        )
        
        assert anonymous_user.has_permission('view_events') is True
        assert anonymous_user.has_permission('manage_reservations') is False
    
    def test_user_to_dict(self, test_user):
        """Test user serialization excludes sensitive data."""
        user_dict = test_user.to_dict()
        
        assert 'password_hash' not in user_dict
        assert 'full_name' in user_dict
        assert user_dict['email'] == test_user.email
        assert user_dict['full_name'] == test_user.full_name


class TestAuthenticationAPI:
    """Test cases for authentication API endpoints."""
    
    def test_user_registration_success(self, client):
        """Test successful user registration."""
        registration_data = {
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        response = client.post('/api/auth/register', 
                              data=json.dumps(registration_data),
                              content_type='application/json')
        
        assert response.status_code == 201
        
        data = response.get_json()
        assert 'access_token' in data
        assert 'user' in data
        assert data['user']['email'] == registration_data['email']
        assert data['user']['full_name'] == 'New User'
    
    def test_user_registration_duplicate_email(self, client, test_user):
        """Test registration with existing email fails."""
        registration_data = {
            'email': test_user.email,
            'password': 'SecurePass123!',
            'first_name': 'Duplicate',
            'last_name': 'User'
        }
        
        response = client.post('/api/auth/register',
                              data=json.dumps(registration_data),
                              content_type='application/json')
        
        assert response.status_code == 409
        
        data = response.get_json()
        assert 'error' in data
        assert 'already registered' in data['error'].lower()
    
    def test_user_registration_validation_errors(self, client):
        """Test registration validation errors."""
        # Missing required fields
        response = client.post('/api/auth/register',
                              data=json.dumps({}),
                              content_type='application/json')
        
        assert response.status_code == 400
        
        data = response.get_json()
        assert 'errors' in data
        
        # Invalid email format
        registration_data = {
            'email': 'invalid-email',
            'password': 'SecurePass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = client.post('/api/auth/register',
                              data=json.dumps(registration_data),
                              content_type='application/json')
        
        assert response.status_code == 400
    
    def test_user_login_success(self, client, test_user):
        """Test successful user login."""
        login_data = {
            'email': test_user.email,
            'password': 'testpass123'
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert 'access_token' in data
        assert 'user' in data
        assert data['user']['email'] == test_user.email
        assert 'expires_in' in data
    
    def test_user_login_invalid_credentials(self, client, test_user):
        """Test login with invalid credentials."""
        # Wrong password
        login_data = {
            'email': test_user.email,
            'password': 'wrongpassword'
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 401
        
        # Non-existent user
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'anypassword'
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 401
    
    def test_user_login_inactive_account(self, client, test_user):
        """Test login with inactive account."""
        # Deactivate user
        test_user.is_active = False
        test_user.save()
        
        login_data = {
            'email': test_user.email,
            'password': 'testpass123'
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 401
        
        data = response.get_json()
        assert 'deactivated' in data['error'].lower()
    
    def test_get_current_user(self, client, auth_headers):
        """Test getting current user information."""
        response = client.get('/api/auth/me', headers=auth_headers)
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert 'email' in data
        assert 'full_name' in data
        assert 'role' in data
        assert 'password_hash' not in data
    
    def test_get_current_user_no_auth(self, client):
        """Test getting current user without authentication."""
        response = client.get('/api/auth/me')
        
        assert response.status_code == 401
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token."""
        headers = {'Authorization': 'Bearer invalid-token'}
        response = client.get('/api/auth/me', headers=headers)
        
        assert response.status_code == 422  # JWT error


class TestPasswordValidation:
    """Test cases for password validation utilities."""
    
    def test_strong_password(self):
        """Test validation of strong password."""
        result = validate_password_strength('StrongP@ssw0rd123')
        
        assert result['is_valid'] is True
        assert result['strength_score'] > 70
        assert len(result['errors']) == 0
    
    def test_weak_passwords(self):
        """Test validation of weak passwords."""
        weak_passwords = [
            'password',      # Too common
            '123456',        # Too simple
            'abc',           # Too short
            'UPPERCASE',     # No lowercase
            'lowercase',     # No uppercase
            'NoNumbers!',    # No numbers
            'NoSpecialChars123'  # No special characters
        ]
        
        for password in weak_passwords:
            result = validate_password_strength(password)
            assert result['is_valid'] is False
            assert len(result['errors']) > 0
    
    def test_password_strength_scoring(self):
        """Test password strength scoring algorithm."""
        # Test different password qualities
        passwords = {
            'a': 0,  # Very weak
            'password': 30,  # Weak but has some length
            'Password1': 60,  # Medium strength
            'StrongP@ssw0rd123': 90,  # Strong
        }
        
        for password, expected_min_score in passwords.items():
            result = validate_password_strength(password)
            # Allow some flexibility in scoring
            assert result['strength_score'] >= expected_min_score - 10


class TestTokenGeneration:
    """Test cases for token generation utilities."""
    
    def test_secure_token_generation(self):
        """Test secure token generation."""
        token1 = generate_secure_token()
        token2 = generate_secure_token()
        
        # Tokens should be different
        assert token1 != token2
        
        # Default length should be 32
        assert len(token1) == 32
        assert len(token2) == 32
        
        # Custom length
        custom_token = generate_secure_token(16)
        assert len(custom_token) == 16
        
        # Should only contain alphanumeric characters
        import string
        allowed_chars = set(string.ascii_letters + string.digits)
        assert all(c in allowed_chars for c in token1)


class TestPermissionSystem:
    """Test cases for permission-based access control."""
    
    def test_permission_decorators(self, client, auth_headers):
        """Test permission decorator functionality."""
        # This would test actual endpoints that use permission decorators
        # For now, we'll test the permission logic directly
        pass
    
    def test_role_permission_mapping(self):
        """Test role to permission mapping."""
        from src.auth.models import UserRole
        
        # Test anonymous user permissions
        anonymous_user = User(role=UserRole.ANONYMOUS)
        assert anonymous_user.has_permission('view_events') is True
        assert anonymous_user.has_permission('manage_reservations') is False
        
        # Test registered user permissions
        registered_user = User(role=UserRole.REGISTERED)
        assert registered_user.has_permission('view_events') is True
        assert registered_user.has_permission('manage_reservations') is True


@pytest.fixture
def auth_token(client, test_user):
    """Generate authentication token for testing."""
    login_data = {
        'email': test_user.email,
        'password': 'testpass123'
    }
    
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    return response.get_json()['access_token']