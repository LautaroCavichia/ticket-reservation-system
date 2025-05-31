/**
 * Component for displaying user's reservation history.
 * 
 * Shows all reservations with status, actions, and
 * filtering capabilities for the authenticated user.
 */
import React, { useState } from 'react';
import { useReservations } from '../../hooks/useReservations';
import { Reservation, ReservationStatus, PaymentStatus } from '../../types/reservations';
import { formatDateTime, formatCurrency, formatReservationStatus, formatPaymentStatus } from '../../utils/formatters';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ReservationList: React.FC = () => {
  const { reservations, loading, error, cancelReservation, processPayment, refetch } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    setActionLoading(true);
    try {
      await cancelReservation(selectedReservation.id);
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedReservation) return;

    setActionLoading(true);
    try {
      // Simulate payment processing
      const paymentData = {
        payment_method: 'credit_card' as const,
        payment_reference: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await processPayment(selectedReservation.id, paymentData);
      setShowPaymentModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case ReservationStatus.CONFIRMED:
        return 'text-green-600 bg-green-100';
      case ReservationStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case PaymentStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case PaymentStatus.FAILED:
        return 'text-red-600 bg-red-100';
      case PaymentStatus.REFUNDED:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations</h3>
        <p className="text-gray-600 mb-6">You haven't made any ticket reservations yet.</p>
        <a 
          href="/events" 
          className="inline-flex items-center justify-center font-medium rounded-md px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Browse Events
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Reservations</h2>
        <Button variant="secondary" onClick={refetch}>
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation: Reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {reservation.event.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Date:</span> {formatDateTime(reservation.event.event_date)}
                    </div>
                    <div>
                      <span className="font-medium">Venue:</span> {reservation.event.venue_name}
                    </div>
                    <div>
                      <span className="font-medium">Tickets:</span> {reservation.ticket_quantity}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> {formatCurrency(reservation.total_amount)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.reservation_status)}`}>
                      {formatReservationStatus(reservation.reservation_status)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(reservation.payment_status)}`}>
                      {formatPaymentStatus(reservation.payment_status)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Reserved on {formatDateTime(reservation.created_at)}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  {reservation.reservation_status === ReservationStatus.PENDING && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowPaymentModal(true);
                      }}
                    >
                      Pay Now
                    </Button>
                  )}
                  
                  {reservation.can_be_cancelled && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Reservation"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel your reservation for{' '}
            <strong>{selectedReservation?.event.title}</strong>?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> If you've already paid, a refund will be processed within 3-5 business days.
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowCancelModal(false)}
              disabled={actionLoading}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleCancelReservation}
              loading={actionLoading}
            >
              Cancel Reservation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Payment"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-gray-900 mb-2">Reservation Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Event: {selectedReservation?.event.title}</div>
              <div>Tickets: {selectedReservation?.ticket_quantity}</div>
              <div className="font-medium text-gray-900">
                Total: {selectedReservation && formatCurrency(selectedReservation.total_amount)}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-800">
              <strong>Demo Payment:</strong> This is a simulated payment process. 
              No real payment will be charged.
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowPaymentModal(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleProcessPayment}
              loading={actionLoading}
            >
              Process Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationList;