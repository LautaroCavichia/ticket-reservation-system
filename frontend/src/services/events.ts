/**
 * Events service for event management operations.
 * 
 * Provides methods for fetching, filtering, and managing
 * events with proper error handling and type safety.
 */
import { apiService } from './api';
import { Event, EventListParams, EventListResponse, CreateEventData } from '../types/events';

class EventsService {
  async getEvents(params?: EventListParams): Promise<EventListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<EventListResponse>(url);
  }

  async getEvent(eventId: number): Promise<Event> {
    return await apiService.get<Event>(`/events/${eventId}`);
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    return await apiService.post<Event>('/events', eventData);
  }

  async updateEvent(eventId: number, eventData: Partial<CreateEventData>): Promise<Event> {
    return await apiService.put<Event>(`/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId: number): Promise<void> {
    await apiService.delete(`/events/${eventId}`);
  }

  async searchEvents(searchTerm: string): Promise<EventListResponse> {
    return this.getEvents({ search: searchTerm, upcoming_only: true });
  }

  async getUpcomingEvents(): Promise<EventListResponse> {
    return this.getEvents({ upcoming_only: true, available_only: true });
  }
}

export const eventsService = new EventsService();