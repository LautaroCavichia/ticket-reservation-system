/**
 * Enhanced Event List with Category Filtering and Improved Animations
 * 
 * Clean, subtle animations with better UX and Italian translations
 */
import React, { useState, useEffect } from 'react';
import { eventsService } from '../../services/events';
import { Event, EventListParams } from '../../types/events';
import EventCard from './EventCard';
import ReservationForm from '../reservations/ReservationForm';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faCalendarDays, 
  faTicket,
  faMusic,
  faLaptopCode,
  faTheaterMasks,
  faWineGlass,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Event categories for filtering
const EVENT_CATEGORIES = [
  { id: 'all', name: 'Tutti gli Eventi', icon: faCalendarDays, keywords: [] },
  { id: 'music', name: 'Musica & Concerti', icon: faMusic, keywords: ['concerto', 'music', 'festival', 'negramaro', 'giorgia', 'jovanotti', 'måneskin', 'elisa'] },
  { id: 'tech', name: 'Tecnologia & Business', icon: faLaptopCode, keywords: ['tech', 'conference', 'startup', 'digital', 'innovation'] },
  { id: 'culture', name: 'Arte & Cultura', icon: faTheaterMasks, keywords: ['arte', 'teatro', 'cinema', 'uffizi', 'cultura', 'mostra', 'spettacolo'] },
  { id: 'food', name: 'Enogastronomia', icon: faWineGlass, keywords: ['wine', 'vino', 'tartufo', 'sagra', 'chianti', 'degustazione', 'gastronomia'] }
];

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);

  // Fetch events on component mount and filter changes
  useEffect(() => {
    fetchEvents();
  }, [showUpcomingOnly, showAvailableOnly]);

  // Filter events when search term, category, or events change
  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: EventListParams = {
        upcoming_only: showUpcomingOnly,
        available_only: showAvailableOnly,
      };

      const response = await eventsService.getEvents(params);
      setEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento degli eventi');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.venue_name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const category = EVENT_CATEGORIES.find(cat => cat.id === selectedCategory);
      if (category && category.keywords.length > 0) {
        filtered = filtered.filter(event => {
          const eventText = (event.title + ' ' + (event.description || '')).toLowerCase();
          return category.keywords.some(keyword => eventText.includes(keyword));
        });
      }
    }

    setFilteredEvents(filtered);
  };

  const handleReserveTickets = (event: Event) => {
    setSelectedEvent(event);
    setShowReservationForm(true);
  };

  const handleReservationComplete = () => {
    setShowReservationForm(false);
    setSelectedEvent(null);
    fetchEvents(); // Refresh events to show updated availability
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowUpcomingOnly(true);
    setShowAvailableOnly(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          />
          <p className="text-primary-600">Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faTimes} className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-primary-800 mb-4">Errore nel Caricamento</h3>
        <div className="text-red-600 mb-6 p-4 bg-red-50 rounded-xl border border-red-200 max-w-md mx-auto">
          {error}
        </div>
        <button
          onClick={fetchEvents}
          className="btn btn-primary"
        >
          <FontAwesomeIcon icon={faSpinner} className="mr-2" />
          Riprova
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <motion.div 
        className="card-modern p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-primary-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca eventi per titolo, descrizione o luogo..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faFilter} className="text-primary-600 mr-2" />
              <span className="text-sm font-medium text-primary-700">Categorie</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {EVENT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'bg-white/60 text-primary-700 border border-primary-200 hover:bg-primary-50'
                  }`}
                >
                  <FontAwesomeIcon icon={category.icon} className="mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-primary-200">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary-600 rounded border-primary-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-primary-700">Solo eventi futuri</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary-600 rounded border-primary-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-primary-700">Solo con biglietti disponibili</span>
            </label>

            {(searchTerm || selectedCategory !== 'all' || !showUpcomingOnly || !showAvailableOnly) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Cancella filtri
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-primary-600">
            {filteredEvents.length === 0 && events.length > 0 ? (
              <span>Nessun evento trovato con i filtri selezionati</span>
            ) : (
              <span>
                {filteredEvents.length} eventi {filteredEvents.length === 1 ? 'trovato' : 'trovati'}
                {selectedCategory !== 'all' && ` in ${EVENT_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faTicket} className="text-primary-600 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-primary-800 mb-3">
            {events.length === 0 ? 'Nessun evento disponibile' : 'Nessun evento trovato'}
          </h3>
          <p className="text-primary-600 mb-6 max-w-md mx-auto">
            {events.length === 0 
              ? 'Al momento non ci sono eventi disponibili. Torna presto per scoprire nuovi eventi!' 
              : searchTerm 
                ? 'Prova a modificare i termini di ricerca o i filtri selezionati'
                : 'Nessun evento corrisponde ai filtri selezionati'
            }
          </p>
          {(searchTerm || selectedCategory !== 'all' || !showUpcomingOnly || !showAvailableOnly) && (
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Rimuovi tutti i filtri
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.1, 0.8) // Cap delay at 0.8s
              }}
            >
              <EventCard
                event={event}
                onReserve={handleReserveTickets}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Reservation Form Modal */}
      {showReservationForm && selectedEvent && (
        <ReservationForm
          event={selectedEvent}
          onClose={() => setShowReservationForm(false)}
          onComplete={handleReservationComplete}
        />
      )}
    </div>
  );
};

export default EventList;