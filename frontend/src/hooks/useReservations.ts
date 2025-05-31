/**
 * Custom hook for reservation data management.
 * 
 * Provides reservation fetching, creation, payment processing,
 * and cancellation with proper state management.
 */
import { useState, useEffect, useCallback } from 'react';
import { reservationsService } from '../services/reservations';
import { 
  Reservation, 
  CreateReservationData, 
  PaymentData 
} from '../types/reservations';

interface UseReservationsReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  processPayment: (reservationId: number, paymentData: PaymentData) => Promise<Reservation>;
  cancelReservation: (reservationId: number) => Promise<Reservation>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useReservations = (): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userReservations = await reservationsService.getUserReservations();
      setReservations(userReservations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new reservation
  const createReservation = useCallback(async (data: CreateReservationData): Promise<Reservation> => {
    setError(null);

    try {
      const newReservation = await reservationsService.createReservation(data);
      
      // Add new reservation to the list
      setReservations(prev => [newReservation, ...prev]);
      
      return newReservation;
    } catch (err: any) {
      setError(err.message || 'Failed to create reservation');
      throw err;
    }
  }, []);

  // Process payment for reservation
  const processPayment = useCallback(async (
    reservationId: number, 
    paymentData: PaymentData
  ): Promise<Reservation> => {
    setError(null);

    try {
      const updatedReservation = await reservationsService.processPayment(reservationId, paymentData);
      
      // Update reservation in the list using a more robust approach
      setReservations(prev => {
        const updatedReservations = prev.map(res => {
          if (res.id === reservationId) {
            // Ensure we maintain the complete reservation object structure
            return {
              ...res,
              ...updatedReservation,
              // Ensure nested objects are properly updated
              event: updatedReservation.event || res.event,
              user: updatedReservation.user || res.user
            };
          }
          return res;
        });
        return updatedReservations;
      });
      
      return updatedReservation;
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      throw err;
    }
  }, []);

  // Cancel reservation
  const cancelReservation = useCallback(async (reservationId: number): Promise<Reservation> => {
    setError(null);

    try {
      const cancelledReservation = await reservationsService.cancelReservation(reservationId);
      
      // Update reservation in the list using a more robust approach
      setReservations(prev => {
        const updatedReservations = prev.map(res => {
          if (res.id === reservationId) {
            // Ensure we maintain the complete reservation object structure
            return {
              ...res,
              ...cancelledReservation,
              // Ensure nested objects are properly updated
              event: cancelledReservation.event || res.event,
              user: cancelledReservation.user || res.user
            };
          }
          return res;
        });
        return updatedReservations;
      });
      
      return cancelledReservation;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel reservation');
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetch = useCallback(async () => {
    await fetchReservations();
  }, [fetchReservations]);

  // Auto-fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    createReservation,
    processPayment,
    cancelReservation,
    refetch,
    clearError,
  };
};

/**
 * Hook for managing a single reservation.
 */
export const useReservation = (reservationId: number | null) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservation = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const reservationData = await reservationsService.getReservation(id);
      setReservation(reservationData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservation');
      setReservation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reservationId) {
      fetchReservation(reservationId);
    } else {
      setReservation(null);
      setError(null);
    }
  }, [reservationId, fetchReservation]);

  return {
    reservation,
    loading,
    error,
    refetch: reservationId ? () => fetchReservation(reservationId) : () => Promise.resolve(),
  };
};

/**
 * Hook for reservation statistics and summary data.
 */
export const useReservationStats = () => {
  const { reservations } = useReservations();

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.reservation_status === 'pending').length,
    confirmed: reservations.filter(r => r.reservation_status === 'confirmed').length,
    cancelled: reservations.filter(r => r.reservation_status === 'cancelled').length,
    totalAmount: reservations
      .filter(r => r.reservation_status === 'confirmed')
      .reduce((sum, r) => sum + r.total_amount, 0),
  };

  return stats;
};