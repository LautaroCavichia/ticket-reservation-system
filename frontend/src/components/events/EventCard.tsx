/**
 * Event card component for displaying event information.
 * 
 * Shows event details with different actions available
 * based on user authentication and permission levels.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types/events';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface EventCardProps {
  event: Event;
  onReserve?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onReserve }) => {
  const { user, isAuthenticated } = useAuth();
  
  const canMakeReservation = isAuthenticated && user?.role === UserRole.REGISTERED;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getAvailabilityStatus = () => {
    if (event.is_sold_out) {
      return { text: 'Sold Out', color: 'text-red-600' };
    }
    if (event.available_tickets < 10) {
      return { text: `Only ${event.available_tickets} left`, color: 'text-orange-600' };
    }
    return { text: `${event.available_tickets} available`, color: 'text-green-600' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">
            {event.title}
          </h3>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(event.ticket_price)}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">📅 </span>
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">📍 </span>
            <span>{event.venue_name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium">🎫 </span>
            <span className={availability.color}>{availability.text}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/events/${event.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View Details
          </Link>

          {canMakeReservation && !event.is_sold_out && event.is_upcoming && (
            <button
              onClick={() => onReserve?.(event)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
            >
              Reserve Tickets
            </button>
          )}

          {!canMakeReservation && (
            <div className="text-sm text-gray-500">
              {!isAuthenticated ? (
                <Link to="/login" className="text-primary-600 hover:underline">
                  Login to reserve tickets
                </Link>
              ) : (
                'Registration required for reservations'
              )}
            </div>
          )}
        </div>

        {/* Occupancy indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Capacity</span>
            <span>{event.tickets_sold}/{event.total_capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${event.occupancy_rate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;