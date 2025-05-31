/**
 * Reservation-related type definitions.
 * 
 * Defines interfaces for reservation data, payment processing,
 * and reservation management operations.
 */
import { User } from './auth';
import { Event } from './events';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Reservation {
  id: number;
  user_id: number;
  event_id: number;
  ticket_quantity: number;
  unit_price: number;
  total_amount: number;
  reservation_status: ReservationStatus;
  payment_status: PaymentStatus;
  payment_reference?: string;
  is_active: boolean;
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  event: Event;
}

export interface CreateReservationData {
  event_id: number;
  ticket_quantity: number;
}

export interface PaymentData {
  payment_method: 'credit_card' | 'debit_card';
  payment_reference: string;
}

export interface ReservationListResponse {
  reservations: Reservation[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}