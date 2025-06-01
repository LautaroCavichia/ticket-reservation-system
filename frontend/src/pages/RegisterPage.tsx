/**
 * Register Page with Complete Italian Translation and Enhanced Animations
 * 
 * Provides user account creation with smooth animations and Italian text
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faUserPlus, 
  faSignInAlt, 
  faEye, 
  faEyeSlash, 
  faTicket,
  faCheck,
  faTimes,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types/auth';
import { validateEmail, validatePassword, validateRequired, validateForm } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{score: number, suggestions: string[]}>({score: 0, suggestions: []});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }

    // Clear API error
    if (apiError) {
      setApiError(null);
    }

    // Check password strength
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const suggestions = [];

    if (password.length >= 8) score += 25;
    else suggestions.push('Almeno 8 caratteri');

    if (/[a-z]/.test(password)) score += 25;
    else suggestions.push('Una lettera minuscola');

    if (/[A-Z]/.test(password)) score += 25;
    else suggestions.push('Una lettera maiuscola');

    if (/\d/.test(password)) score += 25;
    else suggestions.push('Un numero');

    return { score, suggestions };
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 25) return 'Molto debole';
    if (score < 50) return 'Debole';
    if (score < 75) return 'Discreta';
    return 'Forte';
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 25) return 'bg-red-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-green-500';
    return 'bg-green-500';
  };

  const validateFormData = () => {
    const validationRules = {
      email: (value: string) => validateEmail(value),
      password: (value: string) => validatePassword(value),
      first_name: (value: string) => validateRequired(value, 'Nome'),
      last_name: (value: string) => validateRequired(value, 'Cognome'),
    };

    return validateForm(formData, validationRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validate form data
    const validation = validateFormData();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await register(formData);
      navigate('/events');
    } catch (err: any) {
      setApiError(err.message || 'Errore durante la registrazione. Riprova.');
    }
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
              <FontAwesomeIcon icon={faUserPlus} className="text-2xl" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-primary-800">Crea Account</h2>
            <p className="text-primary-600 mt-2">Inizia a prenotare biglietti oggi stesso</p>
          </motion.div>

          {/* Registration Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-accent-600" />
                  Nome
                </label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Il tuo nome"
                  error={errors.first_name?.[0]}
                  required
                  fullWidth
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-accent-600" />
                  Cognome
                </label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Il tuo cognome"
                  error={errors.last_name?.[0]}
                  required
                  fullWidth
                  className="form-input"
                />
              </div>
            </div>

            {/* Email Field */}
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
                error={errors.email?.[0]}
                required
                fullWidth
                className="form-input"
              />
            </div>

            {/* Password Field */}
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
                  placeholder="Crea una password sicura"
                  error={errors.password?.[0]}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-primary-600">Sicurezza password:</span>
                    <span className={`font-medium ${
                      passwordStrength.score < 50 ? 'text-red-600' : 
                      passwordStrength.score < 75 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <motion.div
                      className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="text-xs text-primary-500">
                      <span>Mancano: </span>
                      {passwordStrength.suggestions.join(', ')}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                {apiError}
              </motion.div>
            )}

            {/* Submit Button */}
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
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                {isLoading ? 'Creazione account...' : 'Crea Account'}
              </Button>
            </motion.div>
          </motion.form>

          {/* Login Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-primary-600">
              Hai già un account?{' '}
              <Link 
                to="/login" 
                className="text-primary-800 hover:text-accent-600 font-medium transition-colors"
              >
                Accedi qui
              </Link>
            </p>
          </motion.div>

          {/* Registration Benefits */}
          <motion.div 
            className="mt-8 p-6 glass-strong border border-blue-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              Vantaggi della Registrazione
            </h4>
            <div className="space-y-3 text-sm text-blue-800">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Prenota biglietti per eventi esclusivi in Toscana</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Gestisci facilmente le tue prenotazioni</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Elaborazione sicura dei pagamenti</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Storico completo delle prenotazioni e ricevute</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div 
            className="mt-6 p-4 glass border border-green-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-start">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>Sicurezza garantita:</strong> I tuoi dati sono protetti con crittografia avanzata. 
                Non condividiamo mai le tue informazioni personali con terze parti.
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;