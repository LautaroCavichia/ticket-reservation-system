/**
 * Custom hook for authentication state management.
 * 
 * Provides authentication utilities and state management
 * that can be used throughout the application.
 */
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    const storedUser = authService.getStoredUser();
    const token = authService.getStoredToken();

    if (storedUser && token) {
      try {
        // Verify token is still valid by fetching current user
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
        // Token is invalid, clear stored data
        authService.logout();
        setUser(null);
        setError('Session expired. Please log in again.');
      }
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authService.getStoredToken()) {
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh user data');
      // Don't logout on refresh failure to avoid unnecessary logouts
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    error,
  };
};

/**
 * Hook for checking specific permissions.
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = useCallback((permission: string): boolean => {
    if (!isAuthenticated || !user) {
      // Anonymous users can only view events
      return permission === 'view_events';
    }

    // Registered users have additional permissions
    const userPermissions = ['view_events', 'manage_reservations'];
    return userPermissions.includes(permission);
  }, [user, isAuthenticated]);

  const canViewEvents = hasPermission('view_events');
  const canManageReservations = hasPermission('manage_reservations');

  return {
    hasPermission,
    canViewEvents,
    canManageReservations,
  };
};

/**
 * Hook for protected route logic.
 */
export const useAuthGuard = (requiredPermission?: string) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasPermission } = usePermissions();

  const isAllowed = !requiredPermission || hasPermission(requiredPermission);
  const shouldRedirect = !isLoading && (!isAuthenticated || !isAllowed);

  return {
    isAllowed,
    shouldRedirect,
    isLoading,
    user,
  };
};