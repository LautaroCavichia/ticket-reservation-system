/**
 * Toast Notification System
 * 
 * Provides toast notifications for user feedback with automatic dismissal
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faExclamationTriangle, 
  faInfoCircle,
  faDownload,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showReservationSuccess: (eventTitle: string, reservationId: number, onPayNow: () => void) => void;
  showPaymentSuccess: (eventTitle: string, onDownloadTicket: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showReservationSuccess = useCallback((
    eventTitle: string, 
    reservationId: number, 
    onPayNow: () => void
  ) => {
    addToast({
      type: 'success',
      title: 'Prenotazione Creata!',
      message: `I tuoi biglietti per "${eventTitle}" sono stati riservati. Completa il pagamento entro 15 minuti.`,
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: 'Paga Ora',
          onClick: onPayNow,
          variant: 'primary'
        },
        {
          label: 'Più Tardi',
          onClick: () => removeToast(reservationId.toString()),
          variant: 'secondary'
        }
      ]
    });
  }, [addToast, removeToast]);

  const showPaymentSuccess = useCallback((
    eventTitle: string, 
    onDownloadTicket: () => void
  ) => {
    addToast({
      type: 'success',
      title: 'Pagamento Completato!',
      message: `I tuoi biglietti per "${eventTitle}" sono confermati. Puoi scaricare il biglietto ora.`,
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: 'Scarica Biglietto',
          onClick: onDownloadTicket,
          variant: 'primary'
        }
      ]
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      addToast, 
      removeToast, 
      showReservationSuccess, 
      showPaymentSuccess 
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ 
  toasts: Toast[]; 
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return faCheck;
      case 'error': return faTimes;
      case 'warning': return faExclamationTriangle;
      case 'info': return faInfoCircle;
      default: return faInfoCircle;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass-strong rounded-xl border shadow-lg p-4 ${getColors()}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${getIconColor()}`}>
          <FontAwesomeIcon icon={getIcon()} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
          <p className="text-sm opacity-90 leading-relaxed">{toast.message}</p>
          
          {toast.actions && toast.actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    if (action.variant === 'secondary') {
                      onRemove(toast.id);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
};