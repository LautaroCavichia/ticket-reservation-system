/**
 * Fixed Reservation Form with Proper Modal Behavior
 * 
 * Compact modal design with background scroll lock and clean quantity controls
 */
import React, { useState, useEffect } from 'react';
import { reservationsService } from '../../services/reservations';
import { Event } from '../../types/events';
import { CreateReservationData } from '../../types/reservations';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faTicket, 
  faCalendarDays, 
  faLocationDot, 
  faEuroSign,
  faUsers,
  faClock,
  faShieldAlt,
  faCheck,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

interface ReservationFormProps {
  event: Event;
  onClose: () => void;
  onComplete: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  event,
  onClose,
  onComplete,
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxTickets = Math.min(event.available_tickets, 10);
  const totalAmount = event.ticket_price * ticketQuantity;

  // Lock background scroll when modal opens
  useEffect(() => {
    // Save original body styles
    const originalStyle = window.getComputedStyle(document.body);
    const originalOverflow = originalStyle.overflow;
    const originalPaddingRight = originalStyle.paddingRight;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Lock scroll and compensate for scrollbar
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.classList.add('modal-open');
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ticketQuantity < 1 || ticketQuantity > maxTickets) {
      setError('Quantità di biglietti non valida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationData: CreateReservationData = {
        event_id: event.id,
        ticket_quantity: ticketQuantity,
      };

      await reservationsService.createReservation(reservationData);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Errore durante la creazione della prenotazione');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = ticketQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxTickets) {
      setTicketQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white mr-3">
                <FontAwesomeIcon icon={faTicket} className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-primary-800">Prenota Biglietti</h2>
                <p className="text-sm text-primary-600">Completa la tua prenotazione</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Event Information - Compact */}
          <div className="glass p-4 rounded-xl mb-6">
            <h3 className="font-display font-semibold text-primary-800 text-lg mb-3 line-clamp-1">{event.title}</h3>
            
            <div className="grid grid-cols-1 gap-2 text-sm text-primary-700">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-accent-600 w-4 flex-shrink-0" />
                <span className="truncate">{formatDateTime(event.event_date)}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-accent-600 w-4 flex-shrink-0" />
                <span className="truncate">{event.venue_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-accent-600 w-4" />
                  <span>{event.available_tickets} disponibili</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEuroSign} className="mr-2 text-accent-600 w-4" />
                  <span className="font-semibold">{formatPrice(event.ticket_price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Selector with +/- buttons */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-3">
                <FontAwesomeIcon icon={faTicket} className="mr-2 text-accent-600" />
                Numero di Biglietti
              </label>
              <div className="flex items-center justify-center bg-primary-50 rounded-xl p-4">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={ticketQuantity <= 1}
                  className="w-10 h-10 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                
                <div className="mx-6 text-center">
                  <div className="text-2xl font-bold text-primary-800">{ticketQuantity}</div>
                  <div className="text-xs text-primary-600">
                    {ticketQuantity === 1 ? 'biglietto' : 'biglietti'}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={ticketQuantity >= maxTickets}
                  className="w-10 h-10 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <p className="text-xs text-primary-500 mt-2 text-center">
                Massimo {maxTickets} biglietti per prenotazione
              </p>
            </div>

            {/* Price Summary - Compact */}
            <div className="glass p-4 rounded-xl border border-primary-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-primary-800">Totale</span>
                <span className="text-xl font-bold text-primary-800">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="text-xs text-primary-600 space-y-1">
                <div className="flex justify-between">
                  <span>{formatPrice(event.ticket_price)} × {ticketQuantity}</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center text-red-700 text-sm">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creazione...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Prenota Biglietti
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReservationForm;