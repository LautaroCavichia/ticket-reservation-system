"""
Reservation management API endpoints.

Provides RESTful API for reservation operations restricted to
registered users with proper permission validation.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from src.apps.reservations.models import Reservation, ReservationStatus
from src.apps.reservations.schemas import (
    ReservationCreateSchema,
    ReservationUpdateSchema,
    ReservationResponseSchema,
    PaymentProcessSchema
)
from src.apps.events.models import Event
from src.auth.models import User
from src.shared.decorators import permission_required
from src.core.extensions import db

reservations_bp = Blueprint('reservations', __name__, url_prefix='/api/reservations')

# Schema instances
reservation_create_schema = ReservationCreateSchema()
reservation_update_schema = ReservationUpdateSchema()
reservation_response_schema = ReservationResponseSchema()
reservations_response_schema = ReservationResponseSchema(many=True)
payment_process_schema = PaymentProcessSchema()


@reservations_bp.route('', methods=['GET'])
@jwt_required()
@permission_required('manage_reservations')
def list_user_reservations():
    """
    List all reservations for the authenticated user.
    
    Restricted to registered users. Returns user's reservation
    history with event and payment information.
    """
    user_id = get_jwt_identity()
    
    reservations = Reservation.query.filter_by(user_id=user_id)\
        .order_by(Reservation.created_at.desc())\
        .all()
    
    return jsonify(reservations_response_schema.dump(reservations)), 200


@reservations_bp.route('/<int:reservation_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_reservations')
def get_reservation(reservation_id):
    """
    Get single reservation details.
    
    Users can only access their own reservations for security.
    """
    user_id = get_jwt_identity()
    
    reservation = Reservation.query.filter_by(
        id=reservation_id, 
        user_id=user_id
    ).first()
    
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    return jsonify(reservation_response_schema.dump(reservation)), 200


@reservations_bp.route('', methods=['POST'])
@jwt_required()
@permission_required('manage_reservations')
def create_reservation():
    """
    Create a new ticket reservation.
    
    Validates event availability, reserves tickets, and creates
    reservation record with pending payment status.
    """
    user_id = get_jwt_identity()
    
    try:
        data = reservation_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Get event and validate availability
    event = Event.find_by_id(data['event_id'])
    
    if not event or not event.is_active:
        return jsonify({'error': 'Event not found or inactive'}), 404
    
    if not event.can_reserve_tickets(data['ticket_quantity']):
        return jsonify({
            'error': 'Insufficient tickets available',
            'available_tickets': event.available_tickets
        }), 400
    
    # Begin database transaction for atomic operation
    try:
        # Reserve tickets from event
        event.reserve_tickets(data['ticket_quantity'])
        
        # Create reservation
        reservation = Reservation(
            user_id=user_id,
            event_id=event.id,
            ticket_quantity=data['ticket_quantity'],
            unit_price=event.ticket_price,
            total_amount=event.ticket_price * data['ticket_quantity']
        )
        
        reservation.save()
        
        # Commit transaction
        db.session.commit()
        
        return jsonify(reservation_response_schema.dump(reservation)), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Failed to create reservation'}), 500


@reservations_bp.route('/<int:reservation_id>/payment', methods=['POST'])
@jwt_required()
@permission_required('manage_reservations')
def process_payment(reservation_id):
    """
    Process payment for a reservation.
    
    Simulates payment processing and updates reservation status.
    In production, this would integrate with a real payment gateway.
    """
    user_id = get_jwt_identity()
    
    try:
        data = payment_process_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    reservation = Reservation.query.filter_by(
        id=reservation_id, 
        user_id=user_id
    ).first()
    
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    if reservation.reservation_status != ReservationStatus.PENDING:
        return jsonify({'error': 'Reservation cannot be paid'}), 400
    
    # Simulate payment processing (in production, integrate with payment gateway)
    try:
        # Mock payment processing logic
        payment_successful = True  # In reality, call payment gateway API
        
        if payment_successful:
            reservation.confirm_payment(data['payment_reference'])
            reservation.save()
            
            return jsonify({
                'message': 'Payment processed successfully',
                'reservation': reservation_response_schema.dump(reservation)
            }), 200
        else:
            return jsonify({'error': 'Payment processing failed'}), 400
            
    except Exception as e:
        return jsonify({'error': 'Payment processing error'}), 500


@reservations_bp.route('/<int:reservation_id>/cancel', methods=['POST'])
@jwt_required()
@permission_required('manage_reservations')
def cancel_reservation(reservation_id):
    """
    Cancel an existing reservation.
    
    Releases tickets back to event and updates reservation status.
    Handles refund processing for confirmed payments.
    """
    user_id = get_jwt_identity()
    
    reservation = Reservation.query.filter_by(
        id=reservation_id, 
        user_id=user_id
    ).first()
    
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    if not reservation.can_be_cancelled:
        return jsonify({'error': 'Reservation cannot be cancelled'}), 400
    
    # Begin transaction for atomic cancellation
    try:
        success = reservation.cancel_reservation()
        
        if success:
            reservation.save()
            db.session.commit()
            
            return jsonify({
                'message': 'Reservation cancelled successfully',
                'reservation': reservation_response_schema.dump(reservation)
            }), 200
        else:
            return jsonify({'error': 'Cancellation failed'}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Cancellation processing error'}), 500


@reservations_bp.route('/<int:reservation_id>', methods=['PUT'])
@jwt_required()
@permission_required('manage_reservations')
def update_reservation(reservation_id):
    """
    Update reservation details.
    
    Limited updates allowed - primarily for administrative
    status changes and payment reference updates.
    """
    user_id = get_jwt_identity()
    
    try:
        data = reservation_update_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    reservation = Reservation.query.filter_by(
        id=reservation_id, 
        user_id=user_id
    ).first()
    
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    # Update allowed fields
    for field, value in data.items():
        setattr(reservation, field, value)
    
    reservation.save()
    
    return jsonify(reservation_response_schema.dump(reservation)), 200