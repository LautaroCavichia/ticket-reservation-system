/**
 * Reservation form component for ticket booking.
 * 
 * Handles ticket quantity selection and reservation creation
 * with real-time availability validation.
 */
import React, { useState } from 'react';
import { reservationsService } from '../../services/reservations';
import { Event } from '../../types/events';
import { CreateReservationData } from '../../types/reservations';

interface ReservationFormProps {
  event: Event;
  onClose: () => void;
  onComplete: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  event,
  onClose,
  onComplete,
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxTickets = Math.min(event.available_tickets, 10);
  const totalAmount = event.ticket_price * ticketQuantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ticketQuantity < 1 || ticketQuantity > maxTickets) {
      setError('Invalid ticket quantity');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationData: CreateReservationData = {
        event_id: event.id,
        ticket_quantity: ticketQuantity,
      };

      await reservationsService.createReservation(reservationData);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Reserve Tickets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-sm text-gray-600">{event.venue_name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <select
              id="quantity"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'ticket' : 'tickets'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxTickets} tickets per reservation
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price per ticket:</span>
              <span className="font-medium">{formatPrice(event.ticket_price)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="font-medium">{ticketQuantity}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Reserve Tickets'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>• Reservation will be held for 15 minutes</p>
          <p>• Payment will be required to confirm your tickets</p>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;