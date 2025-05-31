"""
Pytest configuration and fixtures for testing.

Provides shared test fixtures, database setup, and
common test utilities for the application test suite.
"""
import pytest
import tempfile
import os
from datetime import datetime, timedelta

from src.main import create_app
from src.core.extensions import db
from src.auth.models import User, UserRole
from src.apps.events.models import Event
from src.apps.reservations.models import Reservation


@pytest.fixture(scope='session')
def app():
    """Create and configure test application."""
    # Create temporary database file
    db_fd, db_path = tempfile.mkstemp()
    
    # Configure app for testing
    test_config = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'JWT_SECRET_KEY': 'test-jwt-secret',
        'SECRET_KEY': 'test-secret',
        'WTF_CSRF_ENABLED': False
    }
    
    app = create_app()
    app.config.update(test_config)
    
    with app.app_context():
        db.create_all()
        yield app
        
    # Cleanup
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create test runner."""
    return app.test_cli_runner()


@pytest.fixture
def db_session(app):
    """Create clean database session for each test."""
    with app.app_context():
        # Start transaction
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Configure session to use transaction
        session = db.create_scoped_session(
            options={"bind": connection, "binds": {}}
        )
        db.session = session
        
        yield session
        
        # Rollback transaction
        transaction.rollback()
        connection.close()
        session.remove()


@pytest.fixture
def test_user(db_session):
    """Create test user."""
    user = User(
        email='test@example.com',
        first_name='Test',
        last_name='User',
        role=UserRole.REGISTERED
    )
    user.set_password('testpass123')
    
    db_session.add(user)
    db_session.commit()
    
    return user


@pytest.fixture
def admin_user(db_session):
    """Create admin test user."""
    user = User(
        email='admin@example.com',
        first_name='Admin',
        last_name='User',
        role=UserRole.REGISTERED  # Would extend with admin role in real system
    )
    user.set_password('adminpass123')
    
    db_session.add(user)
    db_session.commit()
    
    return user


@pytest.fixture
def test_event(db_session):
    """Create test event."""
    event = Event(
        title='Test Event',
        description='A test event for unit testing',
        event_date=datetime.utcnow() + timedelta(days=30),
        venue_name='Test Venue',
        venue_address='123 Test Street',
        total_capacity=100,
        available_tickets=100,
        ticket_price=50.00
    )
    
    db_session.add(event)
    db_session.commit()
    
    return event


@pytest.fixture
def test_reservation(db_session, test_user, test_event):
    """Create test reservation."""
    reservation = Reservation(
        user_id=test_user.id,
        event_id=test_event.id,
        ticket_quantity=2,
        unit_price=test_event.ticket_price,
        total_amount=test_event.ticket_price * 2
    )
    
    db_session.add(reservation)
    db_session.commit()
    
    return reservation


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers for test user."""
    response = client.post('/api/auth/login', json={
        'email': test_user.email,
        'password': 'testpass123'
    })
    
    token = response.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def admin_headers(client, admin_user):
    """Get authentication headers for admin user."""
    response = client.post('/api/auth/login', json={
        'email': admin_user.email,
        'password': 'adminpass123'
    })
    
    token = response.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}


class TestDataFactory:
    """Factory class for creating test data."""
    
    @staticmethod
    def create_user(email='test@example.com', **kwargs):
        """Create user with default or custom attributes."""
        defaults = {
            'first_name': 'Test',
            'last_name': 'User',
            'role': UserRole.REGISTERED
        }
        defaults.update(kwargs)
        
        user = User(email=email, **defaults)
        user.set_password('testpass123')
        return user
    
    @staticmethod
    def create_event(title='Test Event', **kwargs):
        """Create event with default or custom attributes."""
        defaults = {
            'description': 'A test event',
            'event_date': datetime.utcnow() + timedelta(days=30),
            'venue_name': 'Test Venue',
            'venue_address': '123 Test Street',
            'total_capacity': 100,
            'available_tickets': 100,
            'ticket_price': 50.00
        }
        defaults.update(kwargs)
        
        return Event(title=title, **defaults)
    
    @staticmethod
    def create_reservation(user, event, **kwargs):
        """Create reservation with default or custom attributes."""
        defaults = {
            'ticket_quantity': 2,
            'unit_price': event.ticket_price,
            'total_amount': event.ticket_price * 2
        }
        defaults.update(kwargs)
        
        return Reservation(
            user_id=user.id,
            event_id=event.id,
            **defaults
        )


@pytest.fixture
def data_factory():
    """Provide data factory for tests."""
    return TestDataFactory