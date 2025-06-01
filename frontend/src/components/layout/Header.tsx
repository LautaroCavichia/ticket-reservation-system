/**
 * Enhanced Application Header with Glass Morphism and Modern Design
 * 
 * Features glass effect, smooth animations, and elegant Tuscan-inspired styling
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicket, 
  faUser, 
  faCalendarDays,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faBars,
  faTimes,
  faCrown,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: faTicket },
    { path: '/events', label: 'Eventi', icon: faCalendarDays },
  ];

  const userNavLinks = [
    { path: '/reservations', label: 'Le Mie Prenotazioni', icon: faUser },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'header-glass shadow-lg backdrop-blur-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-2xl font-display font-bold text-primary-800 hover:text-primary-600 transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg"
              >
                <FontAwesomeIcon icon={faTicket} className="text-lg" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
                ToscanaEvents
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`nav-link ${
                    isActive(link.path) 
                      ? 'active bg-gradient-accent text-primary-800' 
                      : 'text-primary-700 hover:text-primary-800'
                  }`}
                >
                  <FontAwesomeIcon icon={link.icon} className="mr-2" />
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {isAuthenticated && user?.role === UserRole.REGISTERED && (
              userNavLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`nav-link ${
                      isActive(link.path) 
                        ? 'active bg-gradient-accent text-primary-800' 
                        : 'text-primary-700 hover:text-primary-800'
                    }`}
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2" />
                    {link.label}
                  </Link>
                </motion.div>
              ))
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                {/* User Info */}
                <div className="flex items-center space-x-3 glass px-4 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm">
                    <FontAwesomeIcon 
                      icon={user?.role === UserRole.REGISTERED ? faCrown : faEye} 
                    />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-primary-800">
                      Ciao, {user?.first_name}
                    </div>
                    <div className="text-xs text-primary-600">
                      {user?.role === UserRole.REGISTERED ? 'Utente Registrato' : 'Visitatore'}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Esci
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-ghost"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    Accedi
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Registrati
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden glass p-3 rounded-xl text-primary-700"
          >
            <FontAwesomeIcon 
              icon={isMobileMenuOpen ? faTimes : faBars} 
              className="text-lg"
            />
          </motion.button>
        </div>

        {/* Permission Level Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex items-center justify-center"
        >
          <div className={`permission-indicator ${
            !isAuthenticated ? 'anonymous' : ''
          }`}>
            <FontAwesomeIcon 
              icon={isAuthenticated && user?.role === UserRole.REGISTERED ? faCrown : faEye} 
              className="mr-2"
            />
            {isAuthenticated ? (
              user?.role === UserRole.REGISTERED ? (
                <>✓ Utente Registrato - Può prenotare biglietti</>
              ) : (
                <>○ Utente Non Registrato - Solo visualizzazione eventi</>
              )
            ) : (
              <>○ Non autenticato - Solo visualizzazione eventi</>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong border-t border-primary-200"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                        isActive(link.path)
                          ? 'bg-gradient-accent text-primary-800'
                          : 'text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={link.icon} className="mr-3" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && user?.role === UserRole.REGISTERED && (
                  userNavLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                          isActive(link.path)
                            ? 'bg-gradient-accent text-primary-800'
                            : 'text-primary-700 hover:bg-primary-100'
                        }`}
                      >
                        <FontAwesomeIcon icon={link.icon} className="mr-3" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t border-primary-200">
                  <div className="flex items-center space-x-3 px-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                      <FontAwesomeIcon 
                        icon={user?.role === UserRole.REGISTERED ? faCrown : faEye} 
                      />
                    </div>
                    <div>
                      <div className="font-medium text-primary-800">
                        {user?.full_name}
                      </div>
                      <div className="text-sm text-primary-600">
                        {user?.role === UserRole.REGISTERED ? 'Utente Registrato' : 'Visitatore'}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full btn btn-secondary justify-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Esci
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-primary-200">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn btn-ghost justify-center"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                      Accedi
                    </motion.button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn btn-primary justify-center"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                      Registrati
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;