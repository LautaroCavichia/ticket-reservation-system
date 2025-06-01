/**
 * Enhanced Landing Page with Modern Glass Morphism Design
 * 
 * Beautiful hero section with animations and Tuscan-inspired styling
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
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-warm-200 to-accent-light-300" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-accent rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [20, -20, 20],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-primary rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-warm rounded-full opacity-30 blur-lg"
        />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center text-white shadow-2xl mx-auto">
                <FontAwesomeIcon icon={faTicket} className="text-4xl" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-600 bg-clip-text text-transparent"
            >
              ToscanaEvents
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-primary-700 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Scopri gli eventi più esclusivi della Toscana. Dalla musica dal vivo ai festival enogastronomici, 
              dalle conferenze tech agli spettacoli culturali.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
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
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-accent text-lg px-8 py-4"
                  >
                    <FontAwesomeIcon icon={faCrown} className="mr-3" />
                    Registrati Ora
                  </motion.button>
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              {[
                { icon: faMapMarkerAlt, label: 'Città della Toscana', value: '15+' },
                { icon: faTicket, label: 'Eventi Disponibili', value: '50+' },
                { icon: faStar, label: 'Recensioni Positive', value: '98%' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
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
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Permission Levels Demo */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card-modern p-6 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
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
                  <div>RESTful API</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-primary-800 mb-4">Caratteristiche</h4>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>Glass Morphism UI</div>
                  <div>Responsive Design</div>
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