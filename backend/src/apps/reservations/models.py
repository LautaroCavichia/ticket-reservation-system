"""
Reservation management models.

Defines the Reservation model with payment tracking, status management,
and relationships to users and events for the ticket system.
"""
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship

from src.shared.base_model import BaseModel


class ReservationStatus(Enum):
    """Enumeration of possible reservation states."""
    PENDING = "pending"      # Reserved but payment not confirmed
    CONFIRMED = "confirmed"  # Payment processed successfully
    CANCELLED = "cancelled"  # Cancelled by user or system


class PaymentStatus(Enum):
    """Enumeration of payment processing states."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class Reservation(BaseModel):
    """
    Reservation model linking users to events with payment tracking.
    
    Manages the relationship between users and events, tracking
    ticket quantities, payment status, and reservation lifecycle.
    """
    __tablename__ = 'reservations'
    
    # Foreign keys establishing relationships (required for 2 relations)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False, index=True)
    
    # Reservation details
    ticket_quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)  # Price per ticket at time of reservation
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Status tracking
    reservation_status = Column(SQLEnum(ReservationStatus), default=ReservationStatus.PENDING, nullable=False)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Payment reference for external payment processor
    payment_reference = Column(String(255), nullable=True, unique=True, index=True)
    
    # Relationships (implementing required 2 relations between model tables)
    user = relationship("User", back_populates="reservations")
    event = relationship("Event", back_populates="reservations")
    
    @property
    def is_active(self) -> bool:
        """Check if reservation is in an active state."""
        return self.reservation_status in [ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
    
    @property
    def can_be_cancelled(self) -> bool:
        """
        Determine if reservation can be cancelled.
        
        Business rule: Can cancel if not already cancelled and
        event hasn't started yet.
        """
        return (
            self.reservation_status != ReservationStatus.CANCELLED and
            self.event.is_upcoming
        )
    
    def calculate_total(self) -> Decimal:
        """Calculate total amount based on quantity and unit price."""
        return Decimal(str(self.ticket_quantity)) * self.unit_price
    
    def confirm_payment(self, payment_reference: str) -> None:
        """
        Mark reservation as confirmed with payment reference.
        
        Updates both reservation and payment status when
        payment is successfully processed.
        """
        self.reservation_status = ReservationStatus.CONFIRMED
        self.payment_status = PaymentStatus.COMPLETED
        self.payment_reference = payment_reference
    
    def cancel_reservation(self) -> bool:
        """
        Cancel reservation and release tickets back to event.
        
        Returns True if cancellation successful, False if not allowed.
        This method should be called within a database transaction.
        """
        if not self.can_be_cancelled:
            return False
        
        # Release tickets back to event
        self.event.release_tickets(self.ticket_quantity)
        
        # Update status
        self.reservation_status = ReservationStatus.CANCELLED
        
        # Handle payment refund if needed
        if self.payment_status == PaymentStatus.COMPLETED:
            self.payment_status = PaymentStatus.REFUNDED
        
        return True
    
    def to_dict(self) -> dict:
        """Override to include computed properties and relationships."""
        data = super().to_dict()
        data.update({
            'is_active': self.is_active,
            'can_be_cancelled': self.can_be_cancelled,
            'total_amount': float(self.total_amount),
            'unit_price': float(self.unit_price)
        })
        return data
    
    def __repr__(self) -> str:
        return f"<Reservation(user_id={self.user_id}, event_id={self.event_id}, status={self.reservation_status.value})>"