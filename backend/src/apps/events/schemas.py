"""
Event serialization schemas for API requests and responses.
"""
from marshmallow import Schema, fields, validate
from datetime import datetime


class EventResponseSchema(Schema):
    """Schema for event data in API responses."""
    id = fields.Int(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True, allow_none=True)
    event_date = fields.DateTime(dump_only=True)
    venue_name = fields.Str(dump_only=True)
    venue_address = fields.Str(dump_only=True)
    total_capacity = fields.Int(dump_only=True)
    available_tickets = fields.Int(dump_only=True)
    ticket_price = fields.Float(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    is_sold_out = fields.Bool(dump_only=True)
    tickets_sold = fields.Int(dump_only=True)
    occupancy_rate = fields.Float(dump_only=True)
    is_upcoming = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class EventCreateSchema(Schema):
    """Schema for creating new events."""
    title = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    description = fields.Str(allow_none=True)
    event_date = fields.DateTime(required=True)
    venue_name = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    venue_address = fields.Str(required=True, validate=validate.Length(min=1))
    total_capacity = fields.Int(required=True, validate=validate.Range(min=1))
    ticket_price = fields.Float(required=True, validate=validate.Range(min=0))
    
    def validate_event_date(self, value):
        """Ensure event date is in the future."""
        if value <= datetime.utcnow():
            raise ValidationError("Event date must be in the future")


class EventUpdateSchema(Schema):
    """Schema for updating existing events."""
    title = fields.Str(validate=validate.Length(min=1, max=255))
    description = fields.Str(allow_none=True)
    venue_name = fields.Str(validate=validate.Length(min=1, max=255))
    venue_address = fields.Str(validate=validate.Length(min=1))
    ticket_price = fields.Float(validate=validate.Range(min=0))
    is_active = fields.Bool()


class EventListQuerySchema(Schema):
    """Schema for event list query parameters."""
    page = fields.Int(missing=1, validate=validate.Range(min=1))
    per_page = fields.Int(missing=20, validate=validate.Range(min=1, max=100))
    search = fields.Str(allow_none=True)
    upcoming_only = fields.Bool(missing=True)
    available_only = fields.Bool(missing=True)