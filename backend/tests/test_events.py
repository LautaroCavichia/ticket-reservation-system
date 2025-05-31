"""
Test cases for event management functionality.

Tests event CRUD operations, permission validation,
and business logic for event availability and reservations.
"""
import pytest
import json
from datetime import datetime, timedelta

from src.apps.events.models import Event


class TestEventModel:
    """Test cases for Event model functionality."""
    
    def test_event_creation(self, db_session):
        """Test basic event creation."""
        event_date = datetime.utcnow() + timedelta(days=30)
        
        event = Event(
            title='Test Concert',
            description='A fantastic music event',
            event_date=event_date,
            venue_name='Music Hall',
            venue_address='123 Music Street',
            total_capacity=1000,
            available_tickets=1000,
            ticket_price=50.00
        )
        
        db_session.add(event)
        db_session.commit()
        
        assert event.id is not None
        assert event.title == 'Test Concert'
        assert event.total_capacity == 1000
        assert event.available_tickets == 1000
        assert event.is_active is True
    
    def test_event_computed_properties(self, test_event):
        """Test event computed properties."""
        # Test with no tickets sold
        assert test_event.tickets_sold == 0
        assert test_event.occupancy_rate == 0.0
        assert test_event.is_sold_out is False
        assert test_event.is_upcoming is True
        
        # Simulate some ticket sales
        test_event.available_tickets = 60  # 40 tickets sold out of 100
        
        assert test_event.tickets_sold == 40
        assert test_event.occupancy_rate == 40.0
        assert test_event.is_sold_out is False
        
        # Simulate sold out event
        test_event.available_tickets = 0
        
        assert test_event.tickets_sold == 100
        assert test_event.occupancy_rate == 100.0
        assert test_event.is_sold_out is True
    
    def test_event_ticket_reservation(self, test_event):
        """Test ticket reservation functionality."""
        # Test successful reservation
        assert test_event.can_reserve_tickets(10) is True
        assert test_event.reserve_tickets(10) is True
        assert test_event.available_tickets == 90
        
        # Test reservation exceeding capacity
        assert test_event.can_reserve_tickets(200) is False
        assert test_event.reserve_tickets(200) is False
        assert test_event.available_tickets == 90  # Unchanged
        
        # Test edge case - exact remaining capacity
        assert test_event.can_reserve_tickets(90) is True
        assert test_event.reserve_tickets(90) is True
        assert test_event.available_tickets == 0
        assert test_event.is_sold_out is True
    
    def test_event_ticket_release(self, test_event):
        """Test ticket release functionality."""
        # Reserve some tickets first
        test_event.reserve_tickets(30)
        assert test_event.available_tickets == 70
        
        # Release some tickets
        test_event.release_tickets(10)
        assert test_event.available_tickets == 80
        
        # Test releasing more than possible (should cap at total capacity)
        test_event.release_tickets(50)
        assert test_event.available_tickets == 100  # Capped at total capacity
    
    def test_event_past_date(self, db_session):
        """Test event with past date."""
        past_date = datetime.utcnow() - timedelta(days=1)
        
        event = Event(
            title='Past Event',
            description='An event that already happened',
            event_date=past_date,
            venue_name='Past Venue',
            venue_address='123 Past Street',
            total_capacity=100,
            available_tickets=100,
            ticket_price=25.00
        )
        
        db_session.add(event)
        db_session.commit()
        
        assert event.is_upcoming is False
        assert event.can_reserve_tickets(1) is False  # Cannot reserve for past events
    
    def test_event_to_dict(self, test_event):
        """Test event serialization includes computed properties."""
        event_dict = test_event.to_dict()
        
        assert 'is_sold_out' in event_dict
        assert 'tickets_sold' in event_dict
        assert 'occupancy_rate' in event_dict
        assert 'is_upcoming' in event_dict
        assert isinstance(event_dict['ticket_price'], float)


class TestEventAPI:
    """Test cases for event API endpoints."""
    
    def test_list_events_anonymous(self, client, test_event):
        """Test anonymous users can list events."""
        response = client.get('/api/events')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert 'events' in data
        assert 'pagination' in data
        assert len(data['events']) >= 1
        
        # Check event structure
        event = data['events'][0]
        assert 'id' in event
        assert 'title' in event
        assert 'available_tickets' in event
        assert 'is_sold_out' in event
    
    def test_list_events_with_filters(self, client, data_factory, db_session):
        """Test event listing with various filters."""
        # Create multiple test events
        future_event = data_factory.create_event(
            title='Future Event',
            event_date=datetime.utcnow() + timedelta(days=30)
        )
        past_event = data_factory.create_event(
            title='Past Event',
            event_date=datetime.utcnow() - timedelta(days=1)
        )
        sold_out_event = data_factory.create_event(
            title='Sold Out Event',
            available_tickets=0
        )
        
        db_session.add_all([future_event, past_event, sold_out_event])
        db_session.commit()
        
        # Test upcoming only filter
        response = client.get('/api/events?upcoming_only=true')
        assert response.status_code == 200
        
        data = response.get_json()
        event_titles = [e['title'] for e in data['events']]
        assert 'Future Event' in event_titles
        assert 'Past Event' not in event_titles
        
        # Test available only filter
        response = client.get('/api/events?available_only=true')
        assert response.status_code == 200
        
        data = response.get_json()
        event_titles = [e['title'] for e in data['events']]
        assert 'Sold Out Event' not in event_titles
        
        # Test search filter
        response = client.get('/api/events?search=Future')
        assert response.status_code == 200
        
        data = response.get_json()
        assert len(data['events']) >= 1
        assert any('Future' in e['title'] for e in data['events'])
    
    def test_get_single_event(self, client, test_event):
        """Test retrieving single event by ID."""
        response = client.get(f'/api/events/{test_event.id}')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['id'] == test_event.id
        assert data['title'] == test_event.title
        assert data['venue_name'] == test_event.venue_name
    
    def test_get_nonexistent_event(self, client):
        """Test retrieving non-existent event."""
        response = client.get('/api/events/99999')
        
        assert response.status_code == 404
        
        data = response.get_json()
        assert 'error' in data
    
    def test_create_event_unauthorized(self, client):
        """Test creating event without authentication."""
        event_data = {
            'title': 'New Event',
            'description': 'Test event',
            'event_date': (datetime.utcnow() + timedelta(days=30)).isoformat(),
            'venue_name': 'Test Venue',
            'venue_address': '123 Test St',
            'total_capacity': 100,
            'ticket_price': 25.00
        }
        
        response = client.post('/api/events',
                              data=json.dumps(event_data),
                              content_type='application/json')
        
        assert response.status_code == 401
    
    def test_create_event_insufficient_permissions(self, client, auth_headers):
        """Test creating event with insufficient permissions."""
        event_data = {
            'title': 'New Event',
            'description': 'Test event',
            'event_date': (datetime.utcnow() + timedelta(days=30)).isoformat(),
            'venue_name': 'Test Venue',
            'venue_address': '123 Test St',
            'total_capacity': 100,
            'ticket_price': 25.00
        }
        
        response = client.post('/api/events',
                              data=json.dumps(event_data),
                              content_type='application/json',
                              headers=auth_headers)
        
        # Regular users don't have manage_events permission
        assert response.status_code == 403
    
    def test_create_event_validation_errors(self, client, admin_headers):
        """Test event creation validation."""
        # Missing required fields
        response = client.post('/api/events',
                              data=json.dumps({}),
                              content_type='application/json',
                              headers=admin_headers)
        
        assert response.status_code == 400
        
        data = response.get_json()
        assert 'errors' in data
        
        # Invalid data types
        invalid_event_data = {
            'title': '',  # Empty title
            'event_date': 'invalid-date',
            'total_capacity': -1,  # Negative capacity
            'ticket_price': -10.00  # Negative price
        }
        
        response = client.post('/api/events',
                              data=json.dumps(invalid_event_data),
                              content_type='application/json',
                              headers=admin_headers)
        
        assert response.status_code == 400
    
    def test_update_event_unauthorized(self, client, test_event):
        """Test updating event without authentication."""
        update_data = {'title': 'Updated Title'}
        
        response = client.put(f'/api/events/{test_event.id}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        
        assert response.status_code == 401
    
    def test_delete_event_unauthorized(self, client, test_event):
        """Test deleting event without authentication."""
        response = client.delete(f'/api/events/{test_event.id}')
        
        assert response.status_code == 401
    
    def test_pagination(self, client, data_factory, db_session):
        """Test event listing pagination."""
        # Create multiple events
        events = []
        for i in range(25):
            event = data_factory.create_event(title=f'Event {i}')
            events.append(event)
        
        db_session.add_all(events)
        db_session.commit()
        
        # Test first page
        response = client.get('/api/events?page=1&per_page=10')
        assert response.status_code == 200
        
        data = response.get_json()
        assert len(data['events']) == 10
        assert data['pagination']['page'] == 1
        assert data['pagination']['per_page'] == 10
        assert data['pagination']['total'] >= 25
        assert data['pagination']['pages'] >= 3
        
        # Test second page
        response = client.get('/api/events?page=2&per_page=10')
        assert response.status_code == 200
        
        data = response.get_json()
        assert len(data['events']) == 10
        assert data['pagination']['page'] == 2


class TestEventBusinessLogic:
    """Test cases for event business rules and logic."""
    
    def test_event_availability_tracking(self, test_event, data_factory, db_session):
        """Test event availability tracking with reservations."""
        from src.apps.reservations.models import Reservation
        
        # Create a user for testing
        user = data_factory.create_user()
        db_session.add(user)
        db_session.commit()
        
        # Initial state
        assert test_event.available_tickets == 100
        assert test_event.tickets_sold == 0
        
        # Create reservation (this would normally be done through the API)
        reservation = data_factory.create_reservation(
            user, test_event, ticket_quantity=20
        )
        
        # Update event availability manually (normally done in the API)
        test_event.reserve_tickets(20)
        
        db_session.add(reservation)
        db_session.commit()
        
        assert test_event.available_tickets == 80
        assert test_event.tickets_sold == 20
        assert test_event.occupancy_rate == 20.0
    
    def test_event_capacity_constraints(self, test_event):
        """Test event capacity enforcement."""
        # Cannot reserve more tickets than available
        assert test_event.can_reserve_tickets(150) is False
        
        # Can reserve exact amount available
        assert test_event.can_reserve_tickets(100) is True
        
        # Cannot reserve zero or negative tickets
        assert test_event.can_reserve_tickets(0) is False
        assert test_event.can_reserve_tickets(-5) is False
    
    def test_inactive_event_restrictions(self, test_event):
        """Test restrictions on inactive events."""
        # Deactivate event
        test_event.is_active = False
        
        # Should not be able to reserve tickets for inactive event
        assert test_event.can_reserve_tickets(1) is False
    
    def test_event_search_functionality(self, client, data_factory, db_session):
        """Test event search across different fields."""
        # Create events with various searchable content
        events = [
            data_factory.create_event(
                title='Rock Concert',
                description='Amazing rock music',
                venue_name='Rock Arena'
            ),
            data_factory.create_event(
                title='Jazz Night',
                description='Smooth jazz evening',
                venue_name='Jazz Club'
            ),
            data_factory.create_event(
                title='Classical Symphony',
                description='Beautiful classical music',
                venue_name='Concert Hall'
            )
        ]
        
        db_session.add_all(events)
        db_session.commit()
        
        # Search by title
        response = client.get('/api/events?search=Rock')
        assert response.status_code == 200
        data = response.get_json()
        assert any('Rock' in e['title'] for e in data['events'])
        
        # Search by venue
        response = client.get('/api/events?search=Jazz Club')
        assert response.status_code == 200
        data = response.get_json()
        assert any('Jazz Club' in e['venue_name'] for e in data['events'])
        
        # Search by description
        response = client.get('/api/events?search=classical')
        assert response.status_code == 200
        data = response.get_json()
        assert any('classical' in e['description'].lower() for e in data['events'] if e['description'])


class TestEventPermissions:
    """Test cases for event permission system."""
    
    def test_anonymous_event_access(self, client, test_event):
        """Test anonymous user access to events."""
        # Can view events
        response = client.get('/api/events')
        assert response.status_code == 200
        
        response = client.get(f'/api/events/{test_event.id}')
        assert response.status_code == 200
        
        # Cannot create, update, or delete events
        event_data = {'title': 'New Event'}
        
        response = client.post('/api/events', data=json.dumps(event_data))
        assert response.status_code == 401
        
        response = client.put(f'/api/events/{test_event.id}', data=json.dumps(event_data))
        assert response.status_code == 401
        
        response = client.delete(f'/api/events/{test_event.id}')
        assert response.status_code == 401
    
    def test_registered_user_event_access(self, client, auth_headers, test_event):
        """Test registered user access to events."""
        # Can view events
        response = client.get('/api/events', headers=auth_headers)
        assert response.status_code == 200
        
        response = client.get(f'/api/events/{test_event.id}', headers=auth_headers)
        assert response.status_code == 200
        
        # Cannot manage events (no manage_events permission)
        event_data = {'title': 'New Event'}
        
        response = client.post('/api/events',
                              data=json.dumps(event_data),
                              headers=auth_headers)
        assert response.status_code == 403


@pytest.fixture
def multiple_events(data_factory, db_session):
    """Create multiple test events for testing."""
    events = []
    
    # Future events
    for i in range(3):
        event = data_factory.create_event(
            title=f'Future Event {i}',
            event_date=datetime.utcnow() + timedelta(days=30 + i)
        )
        events.append(event)
    
    # Past events
    for i in range(2):
        event = data_factory.create_event(
            title=f'Past Event {i}',
            event_date=datetime.utcnow() - timedelta(days=i + 1)
        )
        events.append(event)
    
    db_session.add_all(events)
    db_session.commit()
    
    return events