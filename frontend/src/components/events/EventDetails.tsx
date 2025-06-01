/**
 * Enhanced EventDetails with Better Centering and Italian Translation
 * 
 * Improved layout with proper centering and all Italian text
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCalendarDays, 
  faLocationDot, 
  faTicket, 
  faUsers, 
  faEuroSign,
  faMusic,
  faLaptopCode,
  faTheaterMasks,
  faMicrophone,
  faCamera,
  faWineGlass,
  faClock,
  faMapMarkerAlt,
  faInfoCircle,
  faPercentage
} from '@fortawesome/free-solid-svg-icons';
import { useEvent } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { formatDateTime, formatCurrency, formatPercentage } from '../../utils/formatters';
import Button from '../ui/Button';
import ReservationForm from '../reservations/ReservationForm';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id, 10) : null;
  const { event, loading, error, refetch } = useEvent(eventId);
  const { user, isAuthenticated } = useAuth();
  const [showReservationForm, setShowReservationForm] = useState(false);

  const canMakeReservation = isAuthenticated && user?.role === UserRole.REGISTERED;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReservationComplete = () => {
    setShowReservationForm(false);
    refetch(); // Refresh event data to show updated availability
  };

  const getEventImage = (eventTitle: string) => {
    const title = eventTitle.toLowerCase();
    
    if (title.includes('negramaro')) {
      return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('giorgia') || title.includes('elisa')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('jovanotti')) {
      return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('måneskin')) {
      return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('tech') || title.includes('startup') || title.includes('digital')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('uffizi') || title.includes('arte')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('cinema') || title.includes('montepulciano')) {
      return 'https://images.unsplash.com/photo-1489599577372-f4f4c7334c5e?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('tartufo') || title.includes('sagra')) {
      return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=center';
    }
    if (title.includes('chianti') || title.includes('wine') || title.includes('vino')) {
      return 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=400&fit=crop&crop=center';
    }
    
    return 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=400&fit=crop&crop=center';
  };

  const getEventIcon = (eventTitle: string) => {
    const title = eventTitle.toLowerCase();
    if (title.includes('concerto') || title.includes('music') || title.includes('festival') || title.includes('negramaro') || title.includes('giorgia') || title.includes('jovanotti') || title.includes('måneskin')) {
      return faMusic;
    }
    if (title.includes('tech') || title.includes('conference') || title.includes('startup') || title.includes('digital')) {
      return faLaptopCode;
    }
    if (title.includes('teatro') || title.includes('opera') || title.includes('spettacolo') || title.includes('cinema') || title.includes('uffizi')) {
      return faTheaterMasks;
    }
    if (title.includes('comedy') || title.includes('stand-up')) {
      return faMicrophone;
    }
    if (title.includes('photo') || title.includes('arte') || title.includes('mostra') || title.includes('notte bianca')) {
      return faCamera;
    }
    if (title.includes('wine') || title.includes('vino') || title.includes('degustazione') || title.includes('tartufo') || title.includes('sagra') || title.includes('chianti')) {
      return faWineGlass;
    }
    return faCalendarDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  if (error || !event) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faInfoCircle} className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-primary-800 mb-4">Evento Non Trovato</h2>
          <p className="text-primary-600 mb-6">{error || 'L\'evento richiesto non esiste o non è più disponibile.'}</p>
          <Link to="/events">
            <Button variant="primary">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Torna agli Eventi
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const getAvailabilityStatus = () => {
    if (event.is_sold_out) {
      return { text: 'Sold Out', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
    }
    if (event.available_tickets < 10) {
      return { 
        text: `Solo ${event.available_tickets} biglietti rimasti!`, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200'
      };
    }
    return { 
      text: `${event.available_tickets} biglietti disponibili`, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    };
  };

  const availability = getAvailabilityStatus();
  const eventImage = getEventImage(event.title);
  const eventIcon = getEventIcon(event.title);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <motion.nav 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Torna agli Eventi
        </Link>
      </motion.nav>

      <div className="max-w-6xl mx-auto">
        <div className="card-modern overflow-hidden">
          {/* Hero Image Section - Reduced height */}
          <motion.div 
            className="relative h-80 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            
            {/* Event Type Badge */}
            <div className="absolute top-6 left-6">
              <div className="glass p-3 rounded-xl backdrop-blur-md">
                <FontAwesomeIcon icon={eventIcon} className="text-white text-xl" />
              </div>
            </div>

            {/* Availability Badge */}
            <div className="absolute top-6 right-6">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${availability.color} ${availability.bgColor} border ${availability.borderColor}`}>
                <FontAwesomeIcon icon={faTicket} className="mr-2" />
                {availability.text}
              </div>
            </div>

            {/* Event Title and Basic Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                  <span>{formatDateTime(event.event_date)}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                  <span>{event.venue_name}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEuroSign} className="mr-2" />
                  <span className="text-xl font-bold">{formatCurrency(event.ticket_price)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section - Improved spacing */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <section>
                  <h2 className="text-xl font-display font-semibold text-primary-800 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-accent-600" />
                    Informazioni sull'Evento
                  </h2>
                  <div className="glass-subtle p-6 rounded-xl">
                    <p className="text-primary-700 leading-relaxed">
                      {event.description || 'Nessuna descrizione disponibile per questo evento.'}
                    </p>
                  </div>
                </section>

                {/* Venue Information */}
                <section>
                  <h2 className="text-xl font-display font-semibold text-primary-800 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-accent-600" />
                    Informazioni sulla Location
                  </h2>
                  <div className="glass-subtle p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">{event.venue_name}</h3>
                    <p className="text-primary-600 mb-4">{event.venue_address}</p>
                    <div className="flex items-center text-sm text-primary-600">
                      <FontAwesomeIcon icon={faUsers} className="mr-2 text-accent-600" />
                      <span>Capienza massima: {event.total_capacity.toLocaleString()} persone</span>
                    </div>
                  </div>
                </section>

                {/* Event Statistics */}
                <section>
                  <h2 className="text-xl font-display font-semibold text-primary-800 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faPercentage} className="mr-3 text-accent-600" />
                    Statistiche dell'Evento
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-subtle p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-600">Biglietti Venduti</span>
                        <FontAwesomeIcon icon={faTicket} className="text-accent-600" />
                      </div>
                      <div className="text-xl font-bold text-primary-800">
                        {event.tickets_sold.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="glass-subtle p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-600">Tasso di Occupazione</span>
                        <FontAwesomeIcon icon={faPercentage} className="text-accent-600" />
                      </div>
                      <div className="text-xl font-bold text-primary-800">
                        {formatPercentage(event.occupancy_rate)}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar - Improved sticky positioning */}
              <div className="space-y-6">
                {/* Booking Card */}
                <div className="glass-strong p-6 rounded-2xl border border-primary-200 lg:sticky lg:top-6">
                  <h3 className="text-lg font-display font-semibold text-primary-800 mb-6 flex items-center">
                    <FontAwesomeIcon icon={faTicket} className="mr-3 text-accent-600" />
                    Disponibilità Biglietti
                  </h3>
                  
                  <div className={`border rounded-xl p-4 mb-6 ${availability.borderColor} ${availability.bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${availability.color}`}>Stato</span>
                      <FontAwesomeIcon icon={faTicket} className={availability.color} />
                    </div>
                    <div className={`text-base font-bold ${availability.color}`}>
                      {availability.text}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-600">Disponibili</span>
                      <span className="font-semibold text-primary-800">{event.available_tickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-600">Venduti</span>
                      <span className="font-semibold text-primary-800">{event.tickets_sold}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t border-primary-200 pt-3">
                      <span className="text-primary-700">Capienza Totale</span>
                      <span className="text-primary-800">{event.total_capacity}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-primary-500 mb-2">
                      <span>Venduti</span>
                      <span>{formatPercentage(event.occupancy_rate)}</span>
                    </div>
                    <div className="capacity-bar">
                      <div
                        className={`capacity-fill ${
                          event.occupancy_rate > 80 ? 'high' : 
                          event.occupancy_rate > 50 ? 'medium' : 'low'
                        }`}
                        style={{ width: `${event.occupancy_rate}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {canMakeReservation && !event.is_sold_out && event.is_upcoming ? (
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => setShowReservationForm(true)}
                      className="mb-4"
                    >
                      <FontAwesomeIcon icon={faTicket} className="mr-2" />
                      Prenota Biglietti
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {event.is_sold_out && (
                        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
                          <FontAwesomeIcon icon={faUsers} className="text-red-600 text-2xl mb-2" />
                          <div className="font-medium text-red-700">Evento Sold Out</div>
                          <div className="text-sm text-red-600">Tutti i biglietti sono stati venduti</div>
                        </div>
                      )}
                      {!event.is_upcoming && (
                        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                          <FontAwesomeIcon icon={faClock} className="text-gray-600 text-2xl mb-2" />
                          <div className="font-medium text-gray-700">Evento Terminato</div>
                          <div className="text-sm text-gray-600">Questo evento si è già svolto</div>
                        </div>
                      )}
                      {!canMakeReservation && event.is_upcoming && !event.is_sold_out && (
                        <div className="text-center p-4 glass border border-primary-200 rounded-xl">
                          <FontAwesomeIcon icon={faUsers} className="text-primary-600 text-2xl mb-3" />
                          <div className="font-medium text-primary-700 mb-2">Accedi per Prenotare</div>
                          <div className="text-sm text-primary-600 mb-4">
                            Registrati o accedi per prenotare i tuoi biglietti
                          </div>
                          <Link to="/login" className="block">
                            <Button variant="primary" fullWidth>
                              Accedi Ora
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Information - Compact */}
                <div className="glass p-4 rounded-xl border border-primary-200">
                  <h3 className="text-base font-semibold text-primary-800 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faEuroSign} className="mr-2 text-accent-600" />
                    Prezzo: {formatCurrency(event.ticket_price)}
                  </h3>
                  <div className="space-y-2 text-xs text-primary-600">
                    <div className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      Massimo 10 biglietti per prenotazione
                    </div>
                    <div className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      Rimborso disponibile fino a 24h prima dell'evento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Form Modal */}
        {showReservationForm && (
          <ReservationForm
            event={event}
            onClose={() => setShowReservationForm(false)}
            onComplete={handleReservationComplete}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetails;