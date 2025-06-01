/**
 * Enhanced Reservation Form with Complete Italian Translation
 * 
 * Clean modal design with better UX and Italian text
 */
import React, { useState } from 'react';
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
  faCheck
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white mr-4">
                <FontAwesomeIcon icon={faTicket} className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-800">Prenota Biglietti</h2>
                <p className="text-sm text-primary-600">Completa la tua prenotazione</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Event Information */}
          <div className="glass p-6 rounded-xl mb-6">
            <h3 className="font-display font-semibold text-primary-800 text-xl mb-4">{event.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-700">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarDays} className="mr-3 text-accent-600 w-4" />
                <span>{formatDateTime(event.event_date)}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="mr-3 text-accent-600 w-4" />
                <span>{event.venue_name}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-3 text-accent-600 w-4" />
                <span>{event.available_tickets} biglietti disponibili</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEuroSign} className="mr-3 text-accent-600 w-4" />
                <span>{formatPrice(event.ticket_price)} per biglietto</span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-primary-700 mb-3">
                <FontAwesomeIcon icon={faTicket} className="mr-2 text-accent-600" />
                Numero di Biglietti
              </label>
              <select
                id="quantity"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white/80 backdrop-blur-sm"
              >
                {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'biglietto' : 'biglietti'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-primary-500 mt-2">
                Massimo {maxTickets} biglietti per prenotazione
              </p>
            </div>

            {/* Price Summary */}
            <div className="glass p-6 rounded-xl border border-primary-200">
              <h4 className="font-semibold text-primary-800 mb-4 flex items-center">
                <FontAwesomeIcon icon={faEuroSign} className="mr-2 text-accent-600" />
                Riepilogo Prezzo
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-600">Prezzo per biglietto:</span>
                  <span className="font-medium text-primary-800">{formatPrice(event.ticket_price)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-600">Quantità:</span>
                  <span className="font-medium text-primary-800">{ticketQuantity}</span>
                </div>
                <div className="border-t border-primary-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-700">Totale:</span>
                    <span className="text-2xl font-bold text-primary-800">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="glass-subtle p-4 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-2">Informazioni Importanti:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• La prenotazione sarà valida per 15 minuti</li>
                    <li>• Dovrai completare il pagamento per confermare i biglietti</li>
                    <li>• Puoi cancellare fino a 24 ore prima dell'evento</li>
                    <li>• I biglietti saranno inviati via email dopo il pagamento</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="glass-subtle p-4 rounded-xl border border-green-200">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <div className="font-medium mb-1">Pagamento Sicuro</div>
                  <p className="text-xs">
                    Tutti i pagamenti sono elaborati in modo sicuro. I tuoi dati personali e di pagamento sono protetti.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center text-red-700">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
    </div>
  );
};

export default ReservationForm;