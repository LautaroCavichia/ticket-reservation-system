"""
Event-specific permission logic and validation.

Handles permission checking for event management operations
with business-specific rules and constraints.
"""
from typing import Optional
from flask_jwt_extended import get_jwt_identity
from src.auth.models import User, UserRole
from src.apps.events.models import Event


def can_view_event(event: Event, user: Optional[User] = None) -> bool:
    """
    Check if user can view a specific event.
    
    Args:
        event: Event to check permissions for
        user: User requesting access (None for anonymous)
        
    Returns:
        True if user can view event, False otherwise
    """
    # All users can view active events
    if not event.is_active:
        return False
    
    # Anonymous users can view all active events
    return True


def can_create_event(user: User) -> bool:
    """
    Check if user can create events.
    
    Args:
        user: User requesting permission
        
    Returns:
        True if user can create events, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    # Only admin users can create events (extend permission system as needed)
    return user.has_permission('manage_events')


def can_edit_event(event: Event, user: User) -> bool:
    """
    Check if user can edit a specific event.
    
    Args:
        event: Event to edit
        user: User requesting permission
        
    Returns:
        True if user can edit event, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not event:
        return False
    
    # Check if event has reservations (business rule)
    if event.reservations and len(event.reservations) > 0:
        # More restrictive permissions for events with reservations
        confirmed_reservations = [r for r in event.reservations if r.reservation_status.value == 'confirmed']
        if confirmed_reservations:
            # Only allow certain fields to be edited
            return user.has_permission('admin_access')
    
    return user.has_permission('manage_events')


def can_delete_event(event: Event, user: User) -> bool:
    """
    Check if user can delete a specific event.
    
    Args:
        event: Event to delete
        user: User requesting permission
        
    Returns:
        True if user can delete event, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not event:
        return False
    
    # Cannot delete events with confirmed reservations
    if event.reservations:
        confirmed_reservations = [r for r in event.reservations if r.reservation_status.value == 'confirmed']
        if confirmed_reservations:
            return False
    
    return user.has_permission('manage_events')


def get_event_query_filter(user: Optional[User] = None):
    """
    Get SQLAlchemy filter for events based on user permissions.
    
    Args:
        user: User requesting events (None for anonymous)
        
    Returns:
        SQLAlchemy filter expression
    """
    from src.apps.events.models import Event
    
    # Base filter: only active events for public API
    base_filter = Event.is_active == True
    
    if not user:
        # Anonymous users see only active events
        return base_filter
    
    if user.has_permission('manage_events'):
        # Admins can see all events
        return None  # No additional filter
    
    # Regular users see only active events
    return base_filter


def validate_event_business_rules(event_data: dict, existing_event: Optional[Event] = None) -> list:
    """
    Validate business rules for event creation/updates.
    
    Args:
        event_data: Event data to validate
        existing_event: Existing event for updates (None for creation)
        
    Returns:
        List of validation errors
    """
    errors = []
    
    # Event date must be in the future
    if 'event_date' in event_data:
        from datetime import datetime
        event_date = event_data['event_date']
        if isinstance(event_date, str):
            from src.shared.utils import parse_datetime_string
            event_date = parse_datetime_string(event_date)
        
        if event_date and event_date <= datetime.utcnow():
            errors.append("Event date must be in the future")
    
    # Capacity cannot be reduced below current reservations
    if existing_event and 'total_capacity' in event_data:
        new_capacity = event_data['total_capacity']
        tickets_sold = existing_event.tickets_sold
        
        if new_capacity < tickets_sold:
            errors.append(f"Cannot reduce capacity below {tickets_sold} (current reservations)")
    
    # Ticket price validation
    if 'ticket_price' in event_data:
        price = event_data['ticket_price']
        if price < 0:
            errors.append("Ticket price cannot be negative")
        if price > 10000:  # Business rule: max ticket price
            errors.append("Ticket price cannot exceed $10,000")
    
    return errors