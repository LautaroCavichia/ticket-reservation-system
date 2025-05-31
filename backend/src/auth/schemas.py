"""
Authentication request/response schemas for API serialization.
"""
from marshmallow import Schema, fields, validate, validates, ValidationError
from src.auth.models import UserRole


class UserRegistrationSchema(Schema):
    """Schema for user registration requests."""
    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    
    @validates('email')
    def validate_email_domain(self, value):
        """Custom email validation if needed."""
        pass


class UserLoginSchema(Schema):
    """Schema for user login requests."""
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UserResponseSchema(Schema):
    """Schema for user data in API responses."""
    id = fields.Int(dump_only=True)
    email = fields.Email(dump_only=True)
    first_name = fields.Str(dump_only=True)
    last_name = fields.Str(dump_only=True)
    full_name = fields.Str(dump_only=True)
    role = fields.Enum(UserRole, by_value=True, dump_only=True)
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


class TokenResponseSchema(Schema):
    """Schema for authentication token responses."""
    access_token = fields.Str(required=True)
    user = fields.Nested(UserResponseSchema, required=True)
    expires_in = fields.Int(required=True)