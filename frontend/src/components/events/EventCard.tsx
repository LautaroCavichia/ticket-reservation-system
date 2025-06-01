/**
 * Enhanced Event Card with Images, Glass Morphism and Italian Translation
 * 
 * Beautiful card design with Tuscan-inspired styling, images, and smooth interactions
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
  faWineGlass,
  faClock
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
      }),
      fullDate: date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  const getEventImage = () => {
    const title = event.title.toLowerCase();
    
    // Music events
    if (title.includes('negramaro')) {
      return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('giorgia') || title.includes('elisa')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('jovanotti')) {
      return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('måneskin')) {
      return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('concerto') || title.includes('music') || title.includes('festival')) {
      return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop&crop=center';
    }
    
    // Tech events
    if (title.includes('tech') || title.includes('startup') || title.includes('digital')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop&crop=center';
    }
    
    // Cultural events
    if (title.includes('uffizi') || title.includes('arte')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('cinema') || title.includes('montepulciano')) {
      return 'https://images.unsplash.com/photo-1489599577372-f4f4c7334c5e?w=400&h=250&fit=crop&crop=center';
    }
    
    // Food & Wine events
    if (title.includes('tartufo') || title.includes('sagra')) {
      return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop&crop=center';
    }
    if (title.includes('chianti') || title.includes('wine') || title.includes('vino')) {
      return 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=250&fit=crop&crop=center';
    }
    
    // Default Tuscan landscape
    return 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=250&fit=crop&crop=center';
  };

  const availability = getAvailabilityStatus();
  const eventDate = formatDate(event.event_date);
  const eventIcon = getEventIcon();
  const eventImage = getEventImage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="card-event group cursor-pointer overflow-hidden h-full flex flex-col"
    >
      {/* Event Image with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        
        {/* Event Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`badge ${availability.color} backdrop-blur-sm`}
          >
            <FontAwesomeIcon icon={availability.icon} className="mr-1" />
            {availability.text}
          </motion.div>
        </div>

        {/* Event Type Icon */}
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary-800 shadow-lg backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={eventIcon} />
          </motion.div>
        </div>

        {/* Date Display on Image */}
        <motion.div 
          className="absolute bottom-4 left-4 glass p-3 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          <div className="text-xl font-display font-bold text-white leading-none">
            {eventDate.day}
          </div>
          <div className="text-xs font-medium text-white/90 uppercase">
            {eventDate.month}
          </div>
        </motion.div>

        {/* Price Display on Image */}
        <motion.div 
          className="absolute bottom-4 right-4 glass p-3 rounded-xl backdrop-blur-sm text-right"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          <div className="text-lg font-bold text-white">
            {formatPrice(event.ticket_price)}
          </div>
          <div className="text-xs text-white/90">per biglietto</div>
        </motion.div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Event Title */}
        <motion.h3 
          className="text-xl font-display font-semibold text-primary-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.7 }}
        >
          {event.title}
        </motion.h3>

        {/* Event Description */}
        <motion.p 
          className="text-sm text-primary-700 mb-4 line-clamp-3 flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.8 }}
        >
          {event.description}
        </motion.p>

        {/* Event Details */}
        <motion.div 
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.9 }}
        >
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-accent-600 w-4" />
            <span className="capitalize">{eventDate.fullDate}</span>
          </div>
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-accent-600 w-4" />
            <span className="truncate">{event.venue_name}</span>
          </div>
        </motion.div>

        {/* Capacity Bar */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: index * 0.1 + 1, duration: 0.8 }}
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
              transition={{ delay: index * 0.1 + 1.1, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center justify-between gap-3 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 1.2 }}
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
      </div>
    </motion.div>
  );
};

export default EventCard;