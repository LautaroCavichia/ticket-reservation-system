/**
 * Custom hook for event data management.
 * 
 * Provides event fetching, caching, and state management
 * with error handling and loading states.
 */
import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/events';
import { Event, EventListParams, EventListResponse } from '../types/events';

interface UseEventsOptions {
  autoFetch?: boolean;
  initialParams?: EventListParams;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  pagination: EventListResponse['pagination'] | null;
  fetchEvents: (params?: EventListParams) => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const { autoFetch = true, initialParams = {} } = options;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<EventListResponse['pagination'] | null>(null);
  const [lastParams, setLastParams] = useState<EventListParams>(initialParams);

  const fetchEvents = useCallback(async (params?: EventListParams) => {
    const queryParams = params || lastParams;
    setLastParams(queryParams);
    setLoading(true);
    setError(null);

    try {
      const response = await eventsService.getEvents(queryParams);
      setEvents(response.events);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
      setEvents([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [lastParams]);

  const refetch = useCallback(() => {
    return fetchEvents(lastParams);
  }, [fetchEvents, lastParams]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents(initialParams);
    }
  }, [autoFetch, fetchEvents, initialParams]);

  return {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    refetch,
    clearError,
  };
};

/**
 * Hook for fetching a single event by ID.
 */
export const useEvent = (eventId: number | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const eventData = await eventsService.getEvent(id);
      setEvent(eventData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch event');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    } else {
      setEvent(null);
      setError(null);
    }
  }, [eventId, fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: eventId ? () => fetchEvent(eventId) : () => Promise.resolve(),
  };
};

/**
 * Hook for searching events with debouncing.
 */
export const useEventSearch = (debounceMs: number = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    clearError,
  } = useEvents({ autoFetch: false });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Fetch events when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      fetchEvents({ search: debouncedSearchTerm, upcoming_only: true });
    } else {
      fetchEvents({ upcoming_only: true });
    }
  }, [debouncedSearchTerm, fetchEvents]);

  return {
    searchTerm,
    setSearchTerm,
    events,
    loading,
    error,
    pagination,
    clearError,
  };
};