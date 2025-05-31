"""
Reservation serialization schemas for API requests and responses.
"""
from marshmallow import Schema, fields, validate, validates, ValidationError
from src.apps.reservations.models import ReservationStatus, PaymentStatus
from src.apps.events.schemas import EventResponseSchema
from src.auth.schemas import UserResponseSchema


class ReservationCreateSchema(Schema):
    """Schema for creating new reservations."""
    event_id = fields.Int(required=True, validate=validate.Range(min=1))
    ticket_quantity = fields.Int(required=True, validate=validate.Range(min=1, max=10))
    
    @validates('ticket_quantity')
    def validate_ticket_quantity(self, value):
        """Ensure reasonable ticket quantity limits."""
        if value > 10:
            raise ValidationError("Maximum 10 tickets per reservation")


class ReservationUpdateSchema(Schema):
    """Schema for updating reservation status."""
    reservation_status = fields.Enum(ReservationStatus, by_value=True)
    payment_reference = fields.Str(validate=validate.Length(max=255))


class ReservationResponseSchema(Schema):
    """Schema for reservation data in API responses."""
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    event_id = fields.Int(dump_only=True)
    ticket_quantity = fields.Int(dump_only=True)
    unit_price = fields.Float(dump_only=True)
    total_amount = fields.Float(dump_only=True)
    reservation_status = fields.Enum(ReservationStatus, by_value=True, dump_only=True)
    payment_status = fields.Enum(PaymentStatus, by_value=True, dump_only=True)
    payment_reference = fields.Str(dump_only=True, allow_none=True)
    is_active = fields.Bool(dump_only=True)
    can_be_cancelled = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    # Nested relationships
    user = fields.Nested(UserResponseSchema, dump_only=True)
    event = fields.Nested(EventResponseSchema, dump_only=True)


class PaymentProcessSchema(Schema):
    """Schema for payment processing requests."""
    payment_method = fields.Str(required=True, validate=validate.OneOf(['credit_card', 'debit_card']))
    payment_reference = fields.Str(required=True, validate=validate.Length(min=1, max=255))