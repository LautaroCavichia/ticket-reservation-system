/**
 * Enhanced Event Card with Better Ticket Visibility and Subtle Animations
 * 
 * Improved styling with better contrast for ticket availability
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
  faClock,
  faExclamationTriangle
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
        color: 'text-white bg-red-600 border-red-600',
        icon: faUsers,
        textColor: 'text-red-600'
      };
    }
    if (event.available_tickets < 10) {
      return { 
        text: `Solo ${event.available_tickets} rimasti`, 
        color: 'text-white bg-orange-600 border-orange-600',
        icon: faExclamationTriangle,
        textColor: 'text-orange-600'
      };
    }
    return { 
      text: `${event.available_tickets} disponibili`, 
      color: 'text-white bg-green-600 border-green-600',
      icon: faTicket,
      textColor: 'text-green-600'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index * 0.05, 0.3) // Reduced delays
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="card-event group cursor-pointer overflow-hidden h-full flex flex-col bg-white/95 backdrop-blur-sm"
    >
      {/* Event Image with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        
        {/* Event Status Badge - More Visible */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${availability.color}`}>
            <FontAwesomeIcon icon={availability.icon} className="mr-1" />
            {availability.text}
          </div>
        </div>

        {/* Event Type Icon */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-800 shadow-lg">
            <FontAwesomeIcon icon={eventIcon} />
          </div>
        </div>

        {/* Date Display on Image */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
          <div className="text-xl font-display font-bold text-primary-800 leading-none">
            {eventDate.day}
          </div>
          <div className="text-xs font-medium text-primary-600 uppercase">
            {eventDate.month}
          </div>
        </div>

        {/* Price Display on Image */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg text-right">
          <div className="text-lg font-bold text-primary-800">
            {formatPrice(event.ticket_price)}
          </div>
          <div className="text-xs text-primary-600">per biglietto</div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Event Title */}
        <h3 className="text-xl font-display font-semibold text-primary-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-sm text-primary-700 mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-accent-600 w-4" />
            <span className="capitalize">{eventDate.fullDate}</span>
          </div>
          <div className="flex items-center text-sm text-primary-600">
            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-accent-600 w-4" />
            <span className="truncate">{event.venue_name}</span>
          </div>
        </div>

        {/* Enhanced Capacity Information */}
        <div className="mb-6 p-4 bg-primary-50/50 rounded-xl">
          <div className="flex justify-between text-xs text-primary-600 mb-2">
            <span>Disponibilità</span>
            <span className={`font-semibold ${availability.textColor}`}>
              {event.available_tickets}/{event.total_capacity}
            </span>
          </div>
          <div className="capacity-bar mb-2">
            <div
              className={`capacity-fill ${
                event.occupancy_rate > 80 ? 'high' : 
                event.occupancy_rate > 50 ? 'medium' : 'low'
              }`}
              style={{ width: `${event.occupancy_rate}%` }}
            />
          </div>
          <div className={`text-xs font-medium ${availability.textColor}`}>
            {availability.text}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <Link to={`/events/${event.id}`} className="flex-1">
            <button className="w-full btn btn-secondary text-center hover:bg-primary-100 transition-colors">
              Dettagli
            </button>
          </Link>

          {canMakeReservation && !event.is_sold_out && event.is_upcoming ? (
            <button
              onClick={() => onReserve?.(event)}
              className="flex-1 btn btn-primary hover:shadow-lg transition-all"
            >
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              Prenota
            </button>
          ) : (
            <div className="flex-1">
              {!canMakeReservation ? (
                <Link to="/login" className="block">
                  <button className="w-full btn btn-ghost text-center border-primary-300 hover:bg-primary-50 transition-colors">
                    Accedi per prenotare
                  </button>
                </Link>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-xl text-center text-sm font-medium">
                  {event.is_sold_out ? 'Sold Out' : 'Evento passato'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;