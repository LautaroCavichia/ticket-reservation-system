/**
 * Reservations service for ticket booking operations.
 * 
 * Handles reservation creation, payment processing,
 * cancellation, and user reservation management.
 */
import { apiService } from './api';
import { 
  Reservation, 
  CreateReservationData, 
  PaymentData,
  ReservationListResponse 
} from '../types/reservations';

class ReservationsService {
  async getUserReservations(): Promise<Reservation[]> {
    return await apiService.get<Reservation[]>('/reservations');
  }

  async getReservation(reservationId: number): Promise<Reservation> {
    return await apiService.get<Reservation>(`/reservations/${reservationId}`);
  }

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    return await apiService.post<Reservation>('/reservations', data);
  }

  async processPayment(reservationId: number, paymentData: PaymentData): Promise<Reservation> {
    return await apiService.post<Reservation>(
      `/reservations/${reservationId}/payment`, 
      paymentData
    );
  }

  async cancelReservation(reservationId: number): Promise<Reservation> {
    return await apiService.post<Reservation>(`/reservations/${reservationId}/cancel`);
  }

  async updateReservation(
    reservationId: number, 
    data: Partial<Reservation>
  ): Promise<Reservation> {
    return await apiService.put<Reservation>(`/reservations/${reservationId}`, data);
  }
}

export const reservationsService = new ReservationsService();