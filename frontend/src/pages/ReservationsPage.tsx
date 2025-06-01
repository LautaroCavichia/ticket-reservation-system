/**
 * Reservations page component.
 * 
 * Displays user's reservation history with management
 * capabilities for authenticated users only.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import ReservationList from '../components/reservations/ReservationList';
import { useReservationStats } from '../hooks/useReservations';

const ReservationsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const stats = useReservationStats();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not a registered user
  if (!isAuthenticated || user?.role !== UserRole.REGISTERED) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-8">

      {/* Reservations List */}
      <ReservationList />
    </div>
  );
};

export default ReservationsPage;