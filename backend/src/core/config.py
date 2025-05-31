"""
Application configuration management.

Centralizes all environment-dependent settings and provides
type-safe configuration access across the application.
"""
import os
from dataclasses import dataclass
from typing import List
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    """Base configuration with common settings."""
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret')
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    JWT_ACCESS_TOKEN_EXPIRES: int = 3600  # 1 hour
    CORS_ORIGINS: List[str] = None
    
    def __post_init__(self):
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