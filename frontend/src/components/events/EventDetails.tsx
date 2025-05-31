/**
 * Detailed event view component.
 * 
 * Shows comprehensive event information with reservation
 * capabilities and availability status.
 */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { formatDateTime, formatCurrency, formatPercentage } from '../../utils/formatters';
import Button from '../ui/Button';
import ReservationForm from '../reservations/ReservationForm';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id, 10) : null;
  const { event, loading, error, refetch } = useEvent(eventId);
  const { user, isAuthenticated } = useAuth();
  const [showReservationForm, setShowReservationForm] = useState(false);

  const canMakeReservation = isAuthenticated && user?.role === UserRole.REGISTERED;

  const handleReservationComplete = () => {
    setShowReservationForm(false);
    refetch(); // Refresh event data to show updated availability
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error || 'Event not found'}</div>
        <Link to="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  const getAvailabilityStatus = () => {
    if (event.is_sold_out) {
      return { text: 'Sold Out', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
    if (event.available_tickets < 10) {
      return { 
        text: `Only ${event.available_tickets} left`, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100' 
      };
    }
    return { 
      text: `${event.available_tickets} available`, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100' 
    };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          to="/events" 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Events
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center space-x-4 text-primary-100">
                <span className="flex items-center">
                  📅 {formatDateTime(event.event_date)}
                </span>
                <span className="flex items-center">
                  📍 {event.venue_name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(event.ticket_price)}</div>
              <div className="text-sm text-primary-100">per ticket</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">
                  {event.description || 'No description available for this event.'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Venue Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{event.venue_name}</h3>
                  <p className="text-gray-600 mt-1">{event.venue_address}</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Event Date</div>
                    <div className="font-medium">{formatDateTime(event.event_date)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Venue Capacity</div>
                    <div className="font-medium">{event.total_capacity.toLocaleString()} people</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Tickets Sold</div>
                    <div className="font-medium">{event.tickets_sold.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Occupancy Rate</div>
                    <div className="font-medium">{formatPercentage(event.occupancy_rate)}</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Availability Card */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Availability</h3>
                
                <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${availability.color} ${availability.bgColor} mb-4`}>
                  {availability.text}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Available</span>
                    <span>{event.available_tickets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sold</span>
                    <span>{event.tickets_sold}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Capacity</span>
                    <span>{event.total_capacity}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Sold</span>
                    <span>{formatPercentage(event.occupancy_rate)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${event.occupancy_rate}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {canMakeReservation && !event.is_sold_out && event.is_upcoming ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => setShowReservationForm(true)}
                  >
                    Reserve Tickets
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {event.is_sold_out && (
                      <div className="text-center text-red-600 font-medium">
                        Event Sold Out
                      </div>
                    )}
                    {!event.is_upcoming && (
                      <div className="text-center text-gray-600">
                        Event has already occurred
                      </div>
                    )}
                    {!canMakeReservation && (
                      <div className="text-center">
                        <Link 
                          to="/login" 
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Login to reserve tickets
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ticket Price</span>
                    <span className="font-semibold">{formatCurrency(event.ticket_price)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    • Maximum 10 tickets per reservation
                  </div>
                  <div className="text-xs text-gray-500">
                    • All sales are final
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm
          event={event}
          onClose={() => setShowReservationForm(false)}
          onComplete={handleReservationComplete}
        />
      )}
    </div>
  );
};

export default EventDetails;