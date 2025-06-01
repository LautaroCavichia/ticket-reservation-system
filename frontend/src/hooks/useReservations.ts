/**
 * Fixed useReservations Hook with Real-time Stats Updates
 * 
 * Provides reservation fetching, creation, payment processing,
 * and cancellation with proper state management and real-time updates
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { reservationsService } from '../services/reservations';
import { 
  Reservation, 
  CreateReservationData, 
  PaymentData,
  ReservationStatus,
  PaymentStatus
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
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export const useReservations = (): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from current reservations state - memoized for performance
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.reservation_status === ReservationStatus.PENDING).length,
      confirmed: reservations.filter(r => r.reservation_status === ReservationStatus.CONFIRMED).length,
      cancelled: reservations.filter(r => r.reservation_status === ReservationStatus.CANCELLED).length,
    };
  }, [reservations]);

  // Fetch user's reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userReservations = await reservationsService.getUserReservations();
      // Sort by creation date (newest first) for better UX
      const sortedReservations = userReservations.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setReservations(sortedReservations);
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento delle prenotazioni');
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
      
      // Add new reservation to the beginning of the list
      setReservations(prev => [newReservation, ...prev]);
      
      return newReservation;
    } catch (err: any) {
      setError(err.message || 'Errore nella creazione della prenotazione');
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
      
      // Update reservation in the list - more robust approach
      setReservations(prev => prev.map(reservation => {
        if (reservation.id === reservationId) {
          // Merge the updated data while preserving nested objects
          return {
            ...reservation,
            ...updatedReservation,
            reservation_status: ReservationStatus.CONFIRMED,
            payment_status: PaymentStatus.COMPLETED,
            payment_reference: updatedReservation.payment_reference,
            // Ensure nested objects are preserved
            event: updatedReservation.event || reservation.event,
            user: updatedReservation.user || reservation.user,
            updated_at: updatedReservation.updated_at || new Date().toISOString()
          };
        }
        return reservation;
      }));
      
      return updatedReservation;
    } catch (err: any) {
      setError(err.message || 'Errore nell\'elaborazione del pagamento');
      throw err;
    }
  }, []);

  // Cancel reservation
  const cancelReservation = useCallback(async (reservationId: number): Promise<Reservation> => {
    setError(null);

    try {
      const cancelledReservation = await reservationsService.cancelReservation(reservationId);
      
      // Update reservation in the list - more robust approach
      setReservations(prev => prev.map(reservation => {
        if (reservation.id === reservationId) {
          // Merge the updated data while preserving nested objects
          return {
            ...reservation,
            ...cancelledReservation,
            reservation_status: ReservationStatus.CANCELLED,
            payment_status: reservation.payment_status === PaymentStatus.COMPLETED 
              ? PaymentStatus.REFUNDED 
              : PaymentStatus.PENDING,
            can_be_cancelled: false,
            // Ensure nested objects are preserved
            event: cancelledReservation.event || reservation.event,
            user: cancelledReservation.user || reservation.user,
            updated_at: cancelledReservation.updated_at || new Date().toISOString()
          };
        }
        return reservation;
      }));
      
      return cancelledReservation;
    } catch (err: any) {
      setError(err.message || 'Errore nella cancellazione della prenotazione');
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
    stats // Real-time stats that update automatically
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
      setError(err.message || 'Errore nel caricamento della prenotazione');
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
 * This now uses the stats from the main useReservations hook to ensure consistency
 */
export const useReservationStats = () => {
  const { stats, reservations } = useReservations();

  // Calculate additional stats
  const extendedStats = useMemo(() => {
    const totalAmount = reservations
      .filter(r => r.reservation_status === ReservationStatus.CONFIRMED)
      .reduce((sum, r) => sum + r.total_amount, 0);

    const pendingAmount = reservations
      .filter(r => r.reservation_status === ReservationStatus.PENDING)
      .reduce((sum, r) => sum + r.total_amount, 0);

    return {
      ...stats,
      totalAmount,
      pendingAmount,
      averageTicketPrice: stats.confirmed > 0 ? totalAmount / stats.confirmed : 0,
    };
  }, [stats, reservations]);

  return extendedStats;
};

/**
 * Hook for tracking reservation changes in real-time
 */
export const useReservationUpdates = (onUpdate?: (stats: any) => void) => {
  const { stats } = useReservations();

  useEffect(() => {
    if (onUpdate) {
      onUpdate(stats);
    }
  }, [stats, onUpdate]);

  return stats;
};