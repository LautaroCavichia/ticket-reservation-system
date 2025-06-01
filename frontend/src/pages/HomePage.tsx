/**
 * Enhanced HomePage with Subtle Animations and Complete Italian Translation
 * 
 * Reduced animation complexity for better performance and UX
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicket, 
  faShieldAlt, 
  faUsers, 
  faCreditCard,
  faCalendarCheck,
  faGlobe,
  faCrown,
  faEye,
  faArrowRight,
  faPlay,
  faStar,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: faShieldAlt,
      title: 'Autenticazione JWT Sicura',
      description: 'Sistema di autenticazione robusto con token JWT per garantire la massima sicurezza.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: faUsers,
      title: 'Controllo Accessi Basato sui Ruoli',
      description: 'Diversi livelli di accesso per utenti anonimi e registrati con permessi granulari.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: faCalendarCheck,
      title: 'Disponibilità in Tempo Reale',
      description: 'Monitoraggio istantaneo della disponibilità dei biglietti con aggiornamenti live.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: faCreditCard,
      title: 'Pagamenti Sicuri',
      description: 'Sistema di pagamento integrato per completare le prenotazioni in sicurezza.',
      color: 'from-yellow-400 to-yellow-600'
    }
  ];

  const permissionLevels = [
    {
      icon: faEye,
      title: 'Utenti Anonimi',
      features: [
        'Visualizza tutti gli eventi',
        'Cerca e filtra eventi',
        'Vedi dettagli completi',
        'Naviga per categoria'
      ],
      restrictions: [
        'Non può prenotare biglietti',
        'Non può accedere allo storico',
        'Funzionalità limitate'
      ],
      bgColor: 'from-gray-100 to-gray-200',
      textColor: 'text-gray-700',
      current: !isAuthenticated
    },
    {
      icon: faCrown,
      title: 'Utenti Registrati',
      features: [
        'Tutte le funzionalità anonime',
        'Prenota biglietti per eventi',
        'Gestisce le prenotazioni',
        'Elabora i pagamenti',
        'Storico completo',
        'Cancella prenotazioni'
      ],
      restrictions: [],
      bgColor: 'from-primary-100 to-accent-100',
      textColor: 'text-primary-800',
      current: isAuthenticated && user?.role === UserRole.REGISTERED
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements - Simplified */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-warm-200 to-accent-light-300" />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Logo */}
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mx-auto">
                <FontAwesomeIcon icon={faTicket} className="text-4xl" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              ToscanaEvents
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-primary-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Scopri gli eventi più esclusivi della Toscana. Dalla musica dal vivo ai festival enogastronomici, 
              dalle conferenze tech agli spettacoli culturali.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-3" />
                  Esplora Eventi
                  <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                </motion.button>
              </Link>
              
              {!isAuthenticated && (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-accent text-lg px-8 py-4"
                  >
                    <FontAwesomeIcon icon={faCrown} className="mr-3" />
                    Registrati Ora
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: faMapMarkerAlt, label: 'Città della Toscana', value: '15+' },
                { icon: faTicket, label: 'Eventi Disponibili', value: '50+' },
                { icon: faStar, label: 'Recensioni Positive', value: '98%' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="glass p-6 rounded-2xl text-center"
                >
                  <FontAwesomeIcon 
                    icon={stat.icon} 
                    className="text-3xl text-accent-600 mb-3" 
                  />
                  <div className="text-2xl font-bold text-primary-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Permission Levels Demo */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-primary-800 mb-6">
              Livelli di Accesso Dimostrativi
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Il nostro sistema di autenticazione offre diversi livelli di accesso 
              per dimostrare le capacità della piattaforma.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {permissionLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className={`card-modern p-8 ${level.current ? 'ring-2 ring-accent-400 shadow-xl' : ''}`}
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${level.bgColor} rounded-xl flex items-center justify-center mr-4`}>
                    <FontAwesomeIcon 
                      icon={level.icon} 
                      className={`text-xl ${level.textColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-800">
                      {level.title}
                    </h3>
                    {level.current && (
                      <span className="text-sm text-accent-600 font-medium">
                        ✓ Il tuo livello attuale
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary-700 mb-3">Funzionalità Disponibili:</h4>
                    <ul className="space-y-2">
                      {level.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm text-primary-600">
                          <FontAwesomeIcon icon={faPlay} className="text-green-500 mr-3 text-xs" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {level.restrictions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary-700 mb-3">Limitazioni:</h4>
                      <ul className="space-y-2">
                        {level.restrictions.map((restriction, rIndex) => (
                          <li key={rIndex} className="flex items-center text-sm text-red-600">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                            {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-primary-600 mb-6 text-lg">
                Pronto a sbloccare tutte le funzionalità? Crea un account per accedere alle prenotazioni complete.
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  <FontAwesomeIcon icon={faCrown} className="mr-3" />
                  Registrati Gratuitamente
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-primary-800 mb-6">
              Caratteristiche della Piattaforma
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Un sistema moderno e sicuro per la gestione degli eventi, 
              costruito con le migliori tecnologie web.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="card-modern p-6 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <FontAwesomeIcon 
                    icon={feature.icon} 
                    className="text-2xl text-white"
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-primary-800 mb-6">
              Stack Tecnologico Moderno
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Costruito con le tecnologie più avanzate per garantire prestazioni, 
              sicurezza e scalabilità ottimali.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="text-lg font-semibold text-primary-800 mb-4">Frontend</h4>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>React 19 + TypeScript</div>
                  <div>Tailwind CSS</div>
                  <div>Framer Motion</div>
                  <div>Font Awesome</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-primary-800 mb-4">Backend</h4>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>Flask + Python</div>
                  <div>SQLAlchemy ORM</div>
                  <div>JWT Authentication</div>
                  <div>API RESTful</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-primary-800 mb-4">Caratteristiche</h4>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>Glass Morphism UI</div>
                  <div>Design Responsivo</div>
                  <div>Controllo Accessi</div>
                  <div>Animazioni Fluide</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;