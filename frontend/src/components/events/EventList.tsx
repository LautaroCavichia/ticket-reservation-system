/**
 * Event list component with filtering and pagination.
 * 
 * Displays events in a grid layout with search functionality
 * and reservation capabilities for authenticated users.
 */
import React, { useState, useEffect } from 'react';
import { eventsService } from '../../services/events';
import { Event, EventListParams } from '../../types/events';
import EventCard from './EventCard';
import ReservationForm from '../reservations/ReservationForm';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, showUpcomingOnly, showAvailableOnly]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: EventListParams = {
        upcoming_only: showUpcomingOnly,
        available_only: showAvailableOnly,
        search: searchTerm || undefined,
      };

      const response = await eventsService.getEvents(params);
      setEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveTickets = (event: Event) => {
    setSelectedEvent(event);
    setShowReservationForm(true);
  };

  const handleReservationComplete = () => {
    setShowReservationForm(false);
    setSelectedEvent(null);
    // Refresh events to show updated availability
    fetchEvents();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchEvents}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Events
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, description, or venue..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Upcoming events only</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Available tickets only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'No events match your current filters'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onReserve={handleReserveTickets}
            />
          ))}
        </div>
      )}

      {/* Reservation Form Modal */}
      {showReservationForm && selectedEvent && (
        <ReservationForm
          event={selectedEvent}
          onClose={() => setShowReservationForm(false)}
          onComplete={handleReservationComplete}
        />
      )}
    </div>
  );
};

export default EventList;