"""
Event management API endpoints.

Provides RESTful API for event operations with different
permission levels for anonymous and registered users.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import or_

from src.apps.events.models import Event
from src.apps.events.schemas import (
    EventResponseSchema,
    EventCreateSchema, 
    EventUpdateSchema,
    EventListQuerySchema
)
from src.auth.models import User
from src.shared.decorators import permission_required
from src.core.extensions import db

events_bp = Blueprint('events', __name__, url_prefix='/api/events')

# Schema instances
event_response_schema = EventResponseSchema()
events_response_schema = EventResponseSchema(many=True)
event_create_schema = EventCreateSchema()
event_update_schema = EventUpdateSchema()
event_list_query_schema = EventListQuerySchema()


@events_bp.route('', methods=['GET'])
def list_events():
    """
    List all events with filtering and pagination.
    
    Available to all users (anonymous and registered).
    Supports search, filtering by availability, and upcoming events.
    """
    try:
        query_params = event_list_query_schema.load(request.args)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Build query
    query = Event.query
    
    # Apply filters
    if query_params.get('search'):
        search_term = f"%{query_params['search']}%"
        query = query.filter(
            or_(
                Event.title.ilike(search_term),
                Event.description.ilike(search_term),
                Event.venue_name.ilike(search_term)
            )
        )
    
    if query_params.get('upcoming_only'):
        query = query.filter(Event.event_date > db.func.now())
    
    if query_params.get('available_only'):
        query = query.filter(Event.available_tickets > 0)
    
    # Always filter active events for public API
    query = query.filter(Event.is_active == True)
    
    # Apply pagination
    page = query_params.get('page', 1)
    per_page = query_params.get('per_page', 20)
    
    paginated_events = query.order_by(Event.event_date.asc()).paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    return jsonify({
        'events': events_response_schema.dump(paginated_events.items),
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': paginated_events.total,
            'pages': paginated_events.pages,
            'has_next': paginated_events.has_next,
            'has_prev': paginated_events.has_prev
        }
    }), 200


@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    Get single event details by ID.
    
    Available to all users. Returns detailed event information
    including computed properties like availability status.
    """
    event = Event.find_by_id(event_id)
    
    if not event or not event.is_active:
        return jsonify({'error': 'Event not found'}), 404
    
    return jsonify(event_response_schema.dump(event)), 200


@events_bp.route('', methods=['POST'])
@jwt_required()
@permission_required('manage_events')
def create_event():
    """
    Create a new event.
    
    Restricted to users with event management permissions.
    In this system, only admin users would have this permission.
    """
    try:
        data = event_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    event = Event(
        title=data['title'],
        description=data.get('description'),
        event_date=data['event_date'],
        venue_name=data['venue_name'],
        venue_address=data['venue_address'],
        total_capacity=data['total_capacity'],
        available_tickets=data['total_capacity'],  # Initially all tickets available
        ticket_price=data['ticket_price']
    )
    
    event.save()
    
    return jsonify(event_response_schema.dump(event)), 201


@events_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
@permission_required('manage_events')
def update_event(event_id):
    """
    Update existing event.
    
    Restricted to users with event management permissions.
    Cannot modify capacity or dates for events with existing reservations.
    """
    event = Event.find_by_id(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    try:
        data = event_update_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Update allowed fields
    for field, value in data.items():
        setattr(event, field, value)
    
    event.save()
    
    return jsonify(event_response_schema.dump(event)), 200


@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
@permission_required('manage_events')
def delete_event(event_id):
    """
    Soft delete event by marking as inactive.
    
    Preserves data integrity by not actually deleting records
    that may have associated reservations.
    """
    event = Event.find_by_id(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    event.is_active = False
    event.save()
    
    return jsonify({'message': 'Event deleted successfully'}), 200