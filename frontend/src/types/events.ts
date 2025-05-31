/**
 * Event-related type definitions.
 * 
 * Defines interfaces for event data, filtering parameters,
 * and API responses for event management operations.
 */

export interface Event {
    id: number;
    title: string;
    description?: string;
    event_date: string;
    venue_name: string;
    venue_address: string;
    total_capacity: number;
    available_tickets: number;
    ticket_price: number;
    is_active: boolean;
    is_sold_out: boolean;
    tickets_sold: number;
    occupancy_rate: number;
    is_upcoming: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface EventListParams {
    page?: number;
    per_page?: number;
    search?: string;
    upcoming_only?: boolean;
    available_only?: boolean;
  }
  
  export interface EventListResponse {
    events: Event[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }
  
  export interface CreateEventData {
    title: string;
    description?: string;
    event_date: string;
    venue_name: string;
    venue_address: string;
    total_capacity: number;
    ticket_price: number;
  }