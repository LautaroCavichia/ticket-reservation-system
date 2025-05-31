"""
Development server entry point.

Runs the Flask development server with environment configuration
and database initialization for local development.
"""
import os
from flask_migrate import upgrade
from src.main import create_app
from src.core.extensions import db


def init_database():
    """Initialize database with tables and sample data."""
    with create_app().app_context():
        # Create all tables
        db.create_all()
        
        # Run any pending migrations
        try:
            upgrade()
        except Exception as e:
            print(f"Migration warning: {e}")
        
        # Add sample data for development
        create_sample_data()


def create_sample_data():
    """Create sample events and users for development testing."""
    from datetime import datetime, timedelta
    from src.auth.models import User, UserRole
    from src.apps.events.models import Event
    
    # Check if sample data already exists
    if User.query.first() or Event.query.first():
        print("Sample data already exists, skipping creation")
        return
    
    # Create sample users
    admin_user = User(
        email='admin@example.com',
        first_name='Admin',
        last_name='User',
        role=UserRole.REGISTERED
    )
    admin_user.set_password('admin123')
    admin_user.save()
    
    regular_user = User(
        email='user@example.com',
        first_name='Regular',
        last_name='User',
        role=UserRole.REGISTERED
    )
    regular_user.set_password('user123')
    regular_user.save()
    
    # Create sample events
    events_data = [
        {
            'title': 'Summer Music Festival',
            'description': 'A fantastic outdoor music festival featuring top artists',
            'event_date': datetime.utcnow() + timedelta(days=30),
            'venue_name': 'Central Park Amphitheater',
            'venue_address': '123 Park Avenue, New York, NY 10001',
            'total_capacity': 5000,
            'ticket_price': 75.00
        },
        {
            'title': 'Tech Conference 2025',
            'description': 'Latest trends in technology and innovation',
            'event_date': datetime.utcnow() + timedelta(days=45),
            'venue_name': 'Convention Center',
            'venue_address': '456 Convention Blvd, San Francisco, CA 94102',
            'total_capacity': 1200,
            'ticket_price': 250.00
        },
        {
            'title': 'Comedy Night',
            'description': 'Stand-up comedy with famous comedians',
            'event_date': datetime.utcnow() + timedelta(days=15),
            'venue_name': 'Laugh Factory',
            'venue_address': '789 Comedy Street, Los Angeles, CA 90028',
            'total_capacity': 300,
            'ticket_price': 45.00
        }
    ]
    
    for event_data in events_data:
        event = Event(**event_data)
        event.available_tickets = event.total_capacity
        event.save()
    
    print("Sample data created successfully!")


if __name__ == '__main__':
    app = create_app()
    
    # Initialize database on startup
    init_database()
    
    # Run development server
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5500)),
        debug=True
    )