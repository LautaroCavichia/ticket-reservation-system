/**
 * Fixed Main App Component with Stable Layout
 * 
 * Prevents flashing and provides stable rendering
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import ReservationsPage from './pages/ReservationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Simple page transition variants - reduced animation
const pageVariants = {
  initial: { opacity: 0.95 },
  in: { opacity: 1 },
  out: { opacity: 0.95 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.15
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent FOUC
  useEffect(() => {
    // Ensure app is fully loaded before showing
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`layout-stable ${isLoaded ? 'app-loaded' : 'app-loading'}`}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-stone-100 via-warm-200 to-accent-100">
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main className="relative z-10 pt-24">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <motion.div
                        key="home"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-stable"
                      >
                        <HomePage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/events" 
                    element={
                      <motion.div
                        key="events"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-container"
                      >
                        <div className="container mx-auto px-4 py-8">
                          <EventsPage />
                        </div>
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/events/:id" 
                    element={
                      <motion.div
                        key="event-details"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-container"
                      >
                        <div className="container mx-auto px-4 py-8">
                          <EventsPage />
                        </div>
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/reservations" 
                    element={
                      <motion.div
                        key="reservations"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-container"
                      >
                        <div className="container mx-auto px-4 py-8">
                          <ReservationsPage />
                        </div>
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      <motion.div
                        key="login"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-stable"
                      >
                        <LoginPage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <motion.div
                        key="register"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="content-stable"
                      >
                        <RegisterPage />
                      </motion.div>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* Enhanced Footer */}
            <footer className="relative z-10 mt-20">
              <div className="glass-strong backdrop-blur-lg border-t border-primary-200/30">
                <div className="container mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-800 to-accent-600 bg-clip-text text-transparent">
                            ToscanaEvents
                          </h3>
                          <p className="text-sm text-primary-600">Eventi Esclusivi della Toscana</p>
                        </div>
                      </div>
                      <p className="text-primary-700 leading-relaxed mb-6 max-w-md">
                        Una piattaforma moderna per la gestione e prenotazione di eventi in Toscana. 
                        Dimostra l'implementazione di autenticazione sicura, controllo degli accessi 
                        e design moderno con glass morphism.
                      </p>
                      <div className="flex space-x-3">
                        {[
                          { name: 'React', color: 'from-blue-400 to-blue-600' },
                          { name: 'TypeScript', color: 'from-blue-600 to-blue-800' },
                          { name: 'Flask', color: 'from-green-400 to-green-600' },
                          { name: 'JWT', color: 'from-purple-400 to-purple-600' }
                        ].map((tech) => (
                          <span
                            key={tech.name}
                            className={`px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${tech.color} rounded-full shadow-sm`}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-primary-800 mb-4">Caratteristiche</h4>
                      <ul className="space-y-3 text-sm text-primary-600">
                        {[
                          'Autenticazione JWT',
                          'Controllo Accessi',
                          'Design Responsivo',
                          'Glass Morphism UI',
                          'Animazioni Fluide',
                          'API RESTful'
                        ].map((feature) => (
                          <li key={feature} className="flex items-center">
                            <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Demo Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-primary-800 mb-4">Account Demo</h4>
                      <div className="space-y-4 text-sm">
                        <div className="glass p-4 rounded-xl">
                          <h5 className="font-medium text-primary-700 mb-2">Amministratore:</h5>
                          <div className="space-y-1 text-primary-600">
                            <div>📧 admin@toscana.it</div>
                            <div>🔑 admin123</div>
                          </div>
                        </div>
                        <div className="glass p-4 rounded-xl">
                          <h5 className="font-medium text-primary-700 mb-2">Utente Demo:</h5>
                          <div className="space-y-1 text-primary-600">
                            <div>📧 user@toscana.it</div>
                            <div>🔑 user123</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="border-t border-primary-200/30 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="text-sm text-primary-600 mb-4 md:mb-0">
                        &copy; 2025 ToscanaEvents. Applicazione dimostrativa per showcase API.
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-primary-600">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Sistema Attivo
                        </span>
                        <span>Sviluppato con ❤️ in Toscana</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            {/* Floating Action Button for Mobile */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
              <a
                href="/events"
                className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-shadow"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;