/**
 * Fixed ReservationList with Real-time Stats Updates and Italian Translation
 * 
 * Shows all reservations with proper stats updates when actions are performed
 */
import React, { useState, useCallback } from 'react';
import { useReservations } from '../../hooks/useReservations';
import { Reservation, ReservationStatus, PaymentStatus } from '../../types/reservations';
import { formatDateTime, formatCurrency, formatReservationStatus, formatPaymentStatus } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faCreditCard, faTimes, faCheck, faSpinner, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ReservationList: React.FC = () => {
  const { reservations, loading, error, cancelReservation, processPayment, refetch } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Calculate stats directly from current reservations state
  const calculateStats = useCallback(() => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.reservation_status === ReservationStatus.PENDING).length,
      confirmed: reservations.filter(r => r.reservation_status === ReservationStatus.CONFIRMED).length,
      cancelled: reservations.filter(r => r.reservation_status === ReservationStatus.CANCELLED).length,
    };
  }, [reservations]);

  const stats = calculateStats();

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    setActionLoading(true);
    setActionError(null);
    
    try {
      await cancelReservation(selectedReservation.id);
      
      // Close modal and clear state
      setShowCancelModal(false);
      setSelectedReservation(null);
      
      // Stats will automatically update due to reservations state change
      
    } catch (error: any) {
      console.error('Errore durante la cancellazione:', error);
      setActionError(error.message || 'Errore durante la cancellazione della prenotazione');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedReservation) return;

    setActionLoading(true);
    setActionError(null);
    
    try {
      // Simulate payment processing
      const paymentData = {
        payment_method: 'credit_card' as const,
        payment_reference: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await processPayment(selectedReservation.id, paymentData);
      
      // Close modal and clear state
      setShowPaymentModal(false);
      setSelectedReservation(null);
      
      // Stats will automatically update due to reservations state change
      
    } catch (error: any) {
      console.error('Errore durante il pagamento:', error);
      setActionError(error.message || 'Errore durante l\'elaborazione del pagamento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setShowPaymentModal(false);
    setSelectedReservation(null);
    setActionError(null);
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case ReservationStatus.CONFIRMED:
        return 'text-green-600 bg-green-100 border-green-200';
      case ReservationStatus.CANCELLED:
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case PaymentStatus.COMPLETED:
        return 'text-green-600 bg-green-100 border-green-200';
      case PaymentStatus.FAILED:
        return 'text-red-600 bg-red-100 border-red-200';
      case PaymentStatus.REFUNDED:
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getEventImage = (eventTitle: string) => {
    const title = eventTitle.toLowerCase();
    
    if (title.includes('negramaro')) {
      return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('giorgia') || title.includes('elisa')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('jovanotti')) {
      return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('måneskin')) {
      return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('tech') || title.includes('startup') || title.includes('digital')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('uffizi') || title.includes('arte')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('tartufo') || title.includes('sagra')) {
      return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=80&fit=crop&crop=center';
    }
    if (title.includes('chianti') || title.includes('wine') || title.includes('vino')) {
      return 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=100&h=80&fit=crop&crop=center';
    }
    
    return 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=100&h=80&fit=crop&crop=center';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
        <Button onClick={refetch} variant="primary">
          Riprova
        </Button>
      </motion.div>
    );
  }

  if (reservations.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white mx-auto mb-6">
          <FontAwesomeIcon icon={faTicket} className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-primary-800 mb-3">Nessuna Prenotazione</h3>
        <p className="text-primary-600 mb-6 max-w-md mx-auto">
          Non hai ancora effettuato nessuna prenotazione. Scopri i nostri eventi fantastici!
        </p>
        <a 
          href="/events" 
          className="inline-flex items-center justify-center font-medium rounded-xl px-6 py-3 text-sm bg-gradient-primary text-white hover:shadow-lg transition-all duration-300"
        >
          <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
          Esplora Eventi
        </a>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview - Updated in real-time */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          key={`total-${stats.total}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card-modern p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faTicket} className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-primary-800">{stats.total}</div>
              <div className="text-sm text-primary-600">Prenotazioni Totali</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          key={`pending-${stats.pending}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="card-modern p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faSpinner} className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-primary-800">{stats.pending}</div>
              <div className="text-sm text-primary-600">In Attesa di Pagamento</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          key={`confirmed-${stats.confirmed}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="card-modern p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCheck} className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-primary-800">{stats.confirmed}</div>
              <div className="text-sm text-primary-600">Confermate</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          key={`cancelled-${stats.cancelled}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="card-modern p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faTimes} className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-primary-800">{stats.cancelled}</div>
              <div className="text-sm text-primary-600">Cancellate</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Header with Actions */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div>
          <h2 className="text-3xl font-display font-bold text-primary-800">Le Mie Prenotazioni</h2>
          <p className="text-primary-600 mt-2">Gestisci le tue prenotazioni e i pagamenti</p>
        </div>
        <Button variant="secondary" onClick={refetch}>
          <FontAwesomeIcon icon={faSpinner} className="mr-2" />
          Aggiorna
        </Button>
      </motion.div>

      {/* Reservations List */}
      <div className="space-y-6">
        <AnimatePresence>
          {reservations.map((reservation: Reservation, index: number) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              layout
              className="card-modern overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden">
                      <img
                        src={getEventImage(reservation.event.title)}
                        alt={reservation.event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary-800 mb-2 line-clamp-1">
                          {reservation.event.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-600 mb-4">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-accent-600 w-4" />
                            <span>{formatDateTime(reservation.event.event_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-accent-600 w-4" />
                            <span className="truncate">{reservation.event.venue_name}</span>
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faTicket} className="mr-2 text-accent-600 w-4" />
                            <span><strong>{reservation.ticket_quantity}</strong> biglietti</span>
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-accent-600 w-4" />
                            <span className="font-semibold">{formatCurrency(reservation.total_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <span className={`badge border ${getStatusColor(reservation.reservation_status)}`}>
                            {formatReservationStatus(reservation.reservation_status)}
                          </span>
                          <span className={`badge border ${getPaymentStatusColor(reservation.payment_status)}`}>
                            {formatPaymentStatus(reservation.payment_status)}
                          </span>
                        </div>

                        <div className="text-xs text-primary-500">
                          Prenotato il {formatDateTime(reservation.created_at)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3 ml-6">
                        {reservation.reservation_status === ReservationStatus.PENDING && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowPaymentModal(true);
                              setActionError(null);
                            }}
                            className="btn btn-primary"
                          >
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                            Paga Ora
                          </motion.button>
                        )}
                        
                        {reservation.can_be_cancelled && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowCancelModal(true);
                              setActionError(null);
                            }}
                            className="btn btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancella
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        title="Cancella Prenotazione"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faTimes} className="text-red-600 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sei sicuro di voler cancellare questa prenotazione?
              </h3>
              <p className="text-gray-600">
                Stai per cancellare la tua prenotazione per{' '}
                <strong className="text-primary-800">{selectedReservation?.event.title}</strong>
              </p>
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl border border-yellow-200">
            <div className="text-sm text-primary-700">
              <strong>Nota:</strong> Se hai già pagato, il rimborso verrà elaborato entro 3-5 giorni lavorativi.
              I biglietti torneranno disponibili per altri utenti.
            </div>
          </div>

          {actionError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
            >
              {actionError}
            </motion.div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCloseModal}
              disabled={actionLoading}
            >
              Mantieni Prenotazione
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCancelReservation}
              loading={actionLoading}
              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              {actionLoading ? 'Cancellazione...' : 'Cancella Prenotazione'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        title="Completa il Pagamento"
        size="md"
      >
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl">
            <h4 className="font-semibold text-primary-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faTicket} className="mr-2 text-accent-600" />
              Riepilogo Prenotazione
            </h4>
            <div className="space-y-3 text-sm text-primary-700">
              <div className="flex justify-between">
                <span>Evento:</span>
                <span className="font-medium">{selectedReservation?.event.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Biglietti:</span>
                <span className="font-medium">{selectedReservation?.ticket_quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Prezzo unitario:</span>
                <span className="font-medium">{selectedReservation && formatCurrency(selectedReservation.unit_price)}</span>
              </div>
              <div className="border-t border-primary-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-primary-800">
                  <span>Totale:</span>
                  <span>{selectedReservation && formatCurrency(selectedReservation.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>💳 Pagamento Demo:</strong> Questo è un processo di pagamento simulato. 
              Nessun addebito reale verrà effettuato.
            </div>
          </div>

          {actionError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
            >
              {actionError}
            </motion.div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCloseModal}
              disabled={actionLoading}
            >
              Annulla
            </Button>
            <Button
              fullWidth
              onClick={handleProcessPayment}
              loading={actionLoading}
            >
              {actionLoading ? 'Elaborazione...' : 'Elabora Pagamento'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Help Section */}
      <motion.div 
        className="glass-strong rounded-2xl p-8 border border-primary-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-primary-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faTicket} className="mr-3 text-accent-600" />
          Hai Bisogno di Aiuto?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-primary-700 mb-3">Elaborazione Pagamenti:</h4>
            <ul className="space-y-2 text-sm text-primary-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Le prenotazioni sono mantenute per 15 minuti
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Completa il pagamento per confermare i biglietti
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                I pagamenti falliti cancellano automaticamente la prenotazione
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-primary-700 mb-3">Politica di Cancellazione:</h4>
            <ul className="space-y-2 text-sm text-primary-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Cancella in qualsiasi momento prima dell'inizio dell'evento
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Rimborsi elaborati entro 3-5 giorni lavorativi
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                La cancellazione rilascia i biglietti per altri utenti
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationList;