/**
 * Events page component with routing support.
 * 
 * Handles both event list view and individual event details
 * based on URL parameters and routing context.
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import EventList from '../components/events/EventList';
import EventDetails from '../components/events/EventDetails';

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If ID is provided, show event details, otherwise show event list
  if (id) {
    return <EventDetails />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-600 mt-2">
          Discover and reserve tickets for upcoming events
        </p>
      </div>
      <EventList />
    </div>
  );
};

export default EventsPage;