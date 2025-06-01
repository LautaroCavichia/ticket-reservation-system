/**
 * Login Page with Complete Italian Translation and Enhanced Animations
 * 
 * Provides user authentication interface with smooth animations and Italian text
 */
import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUserPlus, faEye, faEyeSlash, faTicket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get redirect path from location state or default to events
  const from = (location.state as any)?.from?.pathname || '/events';

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Inserisci email e password per continuare');
      return;
    }

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'accesso. Riprova.');
    }
  };

  const demoAccounts = [
    { email: 'admin@toscana.it', password: 'admin123', role: 'Amministratore' },
    { email: 'user@toscana.it', password: 'user123', role: 'Utente Registrato' }
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setFormData({ email: account.email, password: account.password });
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-primary-200/20 to-warm-200/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full relative z-10"
      >
        <div className="card-modern p-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
            >
              <FontAwesomeIcon icon={faTicket} className="text-2xl" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-primary-800">Benvenuto</h2>
            <p className="text-primary-600 mt-2">Accedi al tuo account per prenotare biglietti</p>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div>
              <label className="form-label">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-accent-600" />
                Indirizzo Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="inserisci@email.com"
                required
                fullWidth
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                <FontAwesomeIcon icon={faLock} className="mr-2 text-accent-600" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Inserisci la tua password"
                  required
                  fullWidth
                  className="form-input pr-12"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                {error}
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                size="lg"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                {isLoading ? 'Accesso in corso...' : 'Accedi'}
              </Button>
            </motion.div>
          </motion.form>

          {/* Register Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-primary-600">
              Non hai ancora un account?{' '}
              <Link 
                to="/register" 
                className="text-primary-800 hover:text-accent-600 font-medium transition-colors"
              >
                Registrati qui
              </Link>
            </p>
          </motion.div>

          {/* Demo Accounts */}
          <motion.div 
            className="mt-8 p-6 glass border border-primary-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="font-semibold text-primary-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-accent-600" />
              Account Demo Disponibili
            </h4>
            <div className="space-y-3">
              {demoAccounts.map((account, index) => (
                <motion.div
                  key={account.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="glass-subtle p-3 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium text-primary-800">{account.role}</div>
                      <div className="text-primary-600">{account.email}</div>
                      <div className="text-xs text-primary-500">Password: {account.password}</div>
                    </div>
                    <motion.button
                      onClick={() => fillDemoAccount(account)}
                      className="btn btn-ghost px-3 py-1 text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Usa
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-xs text-primary-500 text-center">
              Clicca "Usa" per compilare automaticamente i campi
            </div>
          </motion.div>

          {/* Features Info */}
          <motion.div 
            className="mt-8 p-6 glass-strong border border-blue-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h4 className="font-semibold text-blue-900 mb-4">Vantaggi dell'Accesso</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Prenota biglietti per eventi esclusivi
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Gestisci le tue prenotazioni
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Elaborazione sicura dei pagamenti
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Storico prenotazioni e ricevute
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;