"""
Event management models.

Defines the Event model with venue information, capacity management,
and availability tracking for the ticket reservation system.
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Column, String, Text, DateTime, Integer, Numeric, Boolean
from sqlalchemy.orm import relationship

from src.shared.base_model import BaseModel


class Event(BaseModel):
    """
    Event model representing ticketed events.
    
    Contains all event information including scheduling, venue details,
    pricing, and capacity management for ticket reservations.
    """
    __tablename__ = 'events'
    
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False, index=True)
    venue_name = Column(String(255), nullable=False)
    venue_address = Column(Text, nullable=False)
    total_capacity = Column(Integer, nullable=False)
    available_tickets = Column(Integer, nullable=False)
    ticket_price = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships - One event can have many reservations
    reservations = relationship("Reservation", back_populates="event", cascade="all, delete-orphan")
    
    @property
    def is_sold_out(self) -> bool:
        """Check if event has no available tickets."""
        return self.available_tickets <= 0
    
    @property
    def tickets_sold(self) -> int:
        """Calculate number of tickets sold."""
        return self.total_capacity - self.available_tickets
    
    @property
    def occupancy_rate(self) -> float:
        """Calculate venue occupancy as percentage."""
        if self.total_capacity == 0:
            return 0.0
        return (self.tickets_sold / self.total_capacity) * 100
    
    @property
    def is_upcoming(self) -> bool:
        """Check if event is scheduled for the future."""
        return self.event_date > datetime.utcnow()
    
    def can_reserve_tickets(self, quantity: int) -> bool:
        """
        Check if requested number of tickets can be reserved.
        
        Validates both availability and event status to ensure
        reservations are only allowed for valid events.
        """
        return (
            self.is_active and 
            self.is_upcoming and 
            self.available_tickets >= quantity and
            quantity > 0
        )
    
    def reserve_tickets(self, quantity: int) -> bool:
        """
        Reserve tickets by reducing available count.
        
        Returns True if reservation successful, False otherwise.
        This method should be used within a database transaction.
        """
        if not self.can_reserve_tickets(quantity):
            return False
        
        self.available_tickets -= quantity
        return True
    
    def release_tickets(self, quantity: int) -> None:
        """
        Release reserved tickets back to available pool.
        
        Used when canceling reservations to restore capacity.
        """
        self.available_tickets = min(
            self.available_tickets + quantity, 
            self.total_capacity
        )
    
    def to_dict(self) -> dict:
        """Override to include computed properties."""
        data = super().to_dict()
        data.update({
            'is_sold_out': self.is_sold_out,
            'tickets_sold': self.tickets_sold,
            'occupancy_rate': round(self.occupancy_rate, 2),
            'is_upcoming': self.is_upcoming,
            'ticket_price': float(self.ticket_price)  # Convert Decimal for JSON
        })
        return data
    
    def __repr__(self) -> str:
        return f"<Event(title={self.title}, date={self.event_date})>"