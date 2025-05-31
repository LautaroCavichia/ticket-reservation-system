# backend/src/core/config.py
"""
Application configuration management.

Centralizes all environment-dependent settings and provides
type-safe configuration access across the application.
"""
import os
from dataclasses import dataclass
from typing import List
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    """Base configuration with common settings."""
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret-change-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    
    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES: timedelta = timedelta(days=30)
    JWT_ALGORITHM: str = 'HS256'
    JWT_HEADER_TYPE: str = 'Bearer'
    JWT_HEADER_NAME: str = 'Authorization'
    JWT_TOKEN_LOCATION: List[str] = None
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = None
    
    def __post_init__(self):
        # Set JWT token location
        self.JWT_TOKEN_LOCATION = ['headers']
        
        # Configure CORS origins
        cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
        self.CORS_ORIGINS = [origin.strip() for origin in cors_origins.split(',')]


@dataclass 
class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG: bool = True
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        'DATABASE_URL', 
        'postgresql://postgres:password@localhost:5432/ticket_reservation_dev'
    )
    
    def __post_init__(self):
        super().__post_init__()
        # In development, use SQLite if PostgreSQL is not available
        if not os.getenv('DATABASE_URL'):
            self.SQLALCHEMY_DATABASE_URI = 'sqlite:///ticket_reservation.db'


@dataclass
class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG: bool = False
    SQLALCHEMY_DATABASE_URI: str = os.getenv('DATABASE_URL')
    
    def __post_init__(self):
        super().__post_init__()
        if not self.SQLALCHEMY_DATABASE_URI:
            raise ValueError("DATABASE_URL must be set in production")


def get_config() -> Config:
    """Factory function to get appropriate configuration based on environment."""
    env = os.getenv('FLASK_ENV', 'development')
    
    if env == 'production':
        return ProductionConfig()
    return DevelopmentConfig()