"""
Reservation-specific permission logic and validation.

Handles permission checking for reservation operations
with user ownership and business rule validation.
"""
from typing import Optional
from datetime import datetime, timedelta
from src.auth.models import User
from src.apps.reservations.models import Reservation, ReservationStatus


def can_view_reservation(reservation: Reservation, user: User) -> bool:
    """
    Check if user can view a specific reservation.
    
    Args:
        reservation: Reservation to check permissions for
        user: User requesting access
        
    Returns:
        True if user can view reservation, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not reservation:
        return False
    
    # Users can only view their own reservations
    if reservation.user_id == user.id:
        return True
    
    # Admins can view all reservations
    return user.has_permission('admin_access')


def can_create_reservation(user: User, event) -> bool:
    """
    Check if user can create reservations.
    
    Args:
        user: User requesting permission
        event: Event to reserve tickets for
        
    Returns:
        True if user can create reservations, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not user.has_permission('manage_reservations'):
        return False
    
    if not event or not event.is_active:
        return False
    
    if not event.is_upcoming:
        return False
    
    return True


def can_cancel_reservation(reservation: Reservation, user: User) -> bool:
    """
    Check if user can cancel a specific reservation.
    
    Args:
        reservation: Reservation to cancel
        user: User requesting permission
        
    Returns:
        True if user can cancel reservation, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not reservation:
        return False
    
    # Users can only cancel their own reservations
    if reservation.user_id != user.id:
        return user.has_permission('admin_access')
    
    # Check if reservation can be cancelled
    return reservation.can_be_cancelled


def can_process_payment(reservation: Reservation, user: User) -> bool:
    """
    Check if user can process payment for a reservation.
    
    Args:
        reservation: Reservation to process payment for
        user: User requesting permission
        
    Returns:
        True if user can process payment, False otherwise
    """
    if not user or not user.is_active:
        return False
    
    if not reservation:
        return False
    
    # Users can only pay for their own reservations
    if reservation.user_id != user.id:
        return False
    
    # Can only pay for pending reservations
    return reservation.reservation_status == ReservationStatus.PENDING


def validate_reservation_business_rules(reservation_data: dict, event, user: User) -> list:
    """
    Validate business rules for reservation creation.
    
    Args:
        reservation_data: Reservation data to validate
        event: Event being reserved
        user: User creating reservation
        
    Returns:
        List of validation errors
    """
    errors = []
    
    ticket_quantity = reservation_data.get('ticket_quantity', 0)
    
    # Validate ticket quantity
    if ticket_quantity <= 0:
        errors.append("Ticket quantity must be greater than 0")
    
    if ticket_quantity > 10:  # Business rule: max 10 tickets per reservation
        errors.append("Maximum 10 tickets per reservation")
    
    # Check availability
    if event and ticket_quantity > event.available_tickets:
        errors.append(f"Only {event.available_tickets} tickets available")
    
    # Check if user already has pending reservation for this event
    if user and event:
        existing_pending = Reservation.query.filter_by(
            user_id=user.id,
            event_id=event.id,
            reservation_status=ReservationStatus.PENDING
        ).first()
        
        if existing_pending:
            errors.append("You already have a pending reservation for this event")
    
    # Check event timing
    if event and not event.is_upcoming:
        errors.append("Cannot reserve tickets for past events")
    
    return errors


def get_reservation_timeout_minutes() -> int:
    """
    Get the number of minutes a reservation is held before timeout.
    
    Returns:
        Number of minutes for reservation timeout
    """
    return 15  # Business rule: 15-minute timeout


def is_reservation_expired(reservation: Reservation) -> bool:
    """
    Check if a pending reservation has expired.
    
    Args:
        reservation: Reservation to check
        
    Returns:
        True if reservation has expired, False otherwise
    """
    if reservation.reservation_status != ReservationStatus.PENDING:
        return False
    
    timeout_minutes = get_reservation_timeout_minutes()
    expiry_time = reservation.created_at + timedelta(minutes=timeout_minutes)
    
    return datetime.utcnow() > expiry_time


def cleanup_expired_reservations():
    """
    Clean up expired pending reservations.
    
    This function should be called periodically to cancel
    expired reservations and release tickets back to events.
    """
    from src.core.extensions import db
    
    timeout_minutes = get_reservation_timeout_minutes()
    cutoff_time = datetime.utcnow() - timedelta(minutes=timeout_minutes)
    
    expired_reservations = Reservation.query.filter(
        Reservation.reservation_status == ReservationStatus.PENDING,
        Reservation.created_at < cutoff_time
    ).all()
    
    for reservation in expired_reservations:
        try:
            # Release tickets back to event
            reservation.event.release_tickets(reservation.ticket_quantity)
            
            # Cancel reservation
            reservation.reservation_status = ReservationStatus.CANCELLED
            
            db.session.add(reservation)
            db.session.add(reservation.event)
            
        except Exception as e:
            print(f"Error cleaning up reservation {reservation.id}: {e}")
            db.session.rollback()
            continue
    
    try:
        db.session.commit()
        print(f"Cleaned up {len(expired_reservations)} expired reservations")
    except Exception as e:
        db.session.rollback()
        print(f"Error committing reservation cleanup: {e}")