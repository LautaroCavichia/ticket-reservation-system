"""
Database connection and session management.

Provides database utilities, connection pooling configuration,
and session management for the Flask application.
"""
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker
from src.core.config import get_config


def configure_database_engine():
    """
    Configure database engine with connection pooling and performance settings.
    
    Sets up connection pooling, timeout settings, and other database
    optimizations for production use.
    """
    config = get_config()
    
    engine_config = {
        'pool_size': 10,
        'max_overflow': 20,
        'pool_timeout': 30,
        'pool_recycle': 3600,
        'echo': config.DEBUG if hasattr(config, 'DEBUG') else False
    }
    
    engine = create_engine(config.SQLALCHEMY_DATABASE_URI, **engine_config)
    
    # Enable foreign key constraints for SQLite (if used in testing)
    @event.listens_for(Engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        if 'sqlite' in str(dbapi_connection):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
    
    return engine


def create_session_factory(engine):
    """Create session factory for database operations."""
    return sessionmaker(bind=engine)


def init_database(app):
    """Initialize database with app context."""
    from src.core.extensions import db
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Run any additional initialization
        setup_database_triggers()


def setup_database_triggers():
    """
    Set up database triggers and constraints.
    
    Adds any custom database-level constraints or triggers
    that cannot be handled by SQLAlchemy models.
    """
    from src.core.extensions import db
    
    # Example: Add trigger to update 'updated_at' timestamp
    trigger_sql = """
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    """
    
    try:
        db.session.execute(trigger_sql)
        db.session.commit()
    except Exception as e:
        # Trigger might already exist or database doesn't support it
        db.session.rollback()
        print(f"Database trigger setup warning: {e}")