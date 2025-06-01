/**
 * Enhanced Event Card with Glass Morphism and Modern Animations
 * 
 * Beautiful card design with Tuscan-inspired styling and smooth interactions
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
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
  faWineGlass
} from '@fortawesome/free-solid-svg-icons';
import { Event } from '../../types/events';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface EventCardProps {
  event: Event;
  onReserve?: (event: Event) => void;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, onReserve, index = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  
  const canMakeReservation = isAuthenticated && user?.role === UserRole.REGISTERED;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('it-IT', { month: 'short' }),
      time: date.toLocaleDateString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit',
        weekday: 'long'
      })
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getAvailabilityStatus = () => {
    if (event.is_sold_out) {
      return { 
        text: 'Sold Out', 
        color: 'badge-sold-out',
        icon: faUsers 
      };
    }
    if (event.available_tickets < 10) {
      return { 
        text: `Solo ${event.available_tickets} rimasti`, 
        color: 'badge-pending',
        icon: faTicket 
      };
    }
    return { 
      text: `${event.available_tickets} disponibili`, 
      color: 'badge-available',
      icon: faTicket 
    };
  };

  const getEventIcon = () => {
    const title = event.title.toLowerCase();
    if (title.includes('concert') || title.includes('music') || title.includes('festival')) {
      return faMusic;
    }
    if (title.includes('tech') || title.includes('conference') || title.includes('startup')) {
      return faLaptopCode;
    }
    if (title.includes('theater') || title.includes('opera') || title.includes('spettacolo')) {
      return faTheaterMasks;
    }
    if (title.includes('comedy') || title.includes('stand-up')) {
      return faMicrophone;
    }
    if (title.includes('photo') || title.includes('arte') || title.includes('mostra')) {
      return faCamera;
    }
    if (title.includes('wine') || title.includes('vino') || title.includes('degustazione')) {
      return faWineGlass;
    }
    return faCalendarDays;
  };

  const availability = getAvailabilityStatus();
  const eventDate = formatDate(event.event_date);
  const eventIcon = getEventIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="card-event group cursor-pointer"
    >
      {/* Event Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className={`badge ${availability.color}`}
        >
          <FontAwesomeIcon icon={availability.icon} className="mr-1" />
          {availability.text}
        </motion.div>
      </div>

      {/* Event Type Icon */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-primary-800 shadow-lg"
        >
          <FontAwesomeIcon icon={eventIcon} />
        </motion.div>
      </div>

      <div className="p-6 h-full flex flex-col">
        {/* Date Display */}
        <motion.div 
          className="flex items-start justify-between mb-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <div className="glass p-3 rounded-xl">
            <div className="text-2xl font-display font-bold text-primary-800 leading-none">
              {eventDate.day}
            </div>
            <div className="text-sm font-medium text-primary-600 uppercase">
              {eventDate.month}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-800">
              {formatPrice(event.ticket_price)}
            </div>
            <div className="text-sm text-primary-600">per biglietto</div>
          </div>
        </motion.div>

        {/* Event Title */}
        <motion.h3 
          className="text-xl font-display font-semibold text-primary-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {event.title}
        </motion.h3>

        {/* Event Description */}
        <motion.p 
          className="text-sm text-primary-700 mb-4 line-clamp-3 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          {event.description}
        </motion.p>

        {/* Event Details */}
        <motion.div 
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.7 }}
        >
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-accent-600" />
            <span className="capitalize">{eventDate.time}</span>
          </div>
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-accent-600" />
            <span className="truncate">{event.venue_name}</span>
          </div>
        </motion.div>

        {/* Capacity Bar */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
        >
          <div className="flex justify-between text-xs text-primary-600 mb-2">
            <span>Capienza</span>
            <span>{event.tickets_sold}/{event.total_capacity}</span>
          </div>
          <div className="capacity-bar">
            <motion.div
              className={`capacity-fill ${
                event.occupancy_rate > 80 ? 'high' : 
                event.occupancy_rate > 50 ? 'medium' : 'low'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${event.occupancy_rate}%` }}
              transition={{ delay: index * 0.1 + 1, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.9 }}
        >
          <Link
            to={`/events/${event.id}`}
            className="flex-1"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn btn-secondary text-center"
            >
              Dettagli
            </motion.button>
          </Link>

          {canMakeReservation && !event.is_sold_out && event.is_upcoming ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onReserve?.(event)}
              className="flex-1 btn btn-primary"
            >
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              Prenota
            </motion.button>
          ) : (
            <div className="flex-1">
              {!canMakeReservation ? (
                <Link to="/login" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn btn-ghost text-center"
                  >
                    Accedi per prenotare
                  </motion.button>
                </Link>
              ) : (
                <motion.div
                  className="w-full glass px-4 py-3 rounded-xl text-center text-sm text-primary-600"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {event.is_sold_out ? 'Sold Out' : 'Evento passato'}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-primary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
        />
      </div>
    </motion.div>
  );
};

export default EventCard;