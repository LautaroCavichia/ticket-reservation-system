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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Reservations</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-semibold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending Payment</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">✕</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
              <div className="text-sm text-gray-500">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <ReservationList />

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Need Help with Your Reservations?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Payment Processing:</h4>
            <ul className="space-y-1">
              <li>• Reservations are held for 15 minutes</li>
              <li>• Complete payment to confirm tickets</li>
              <li>• Failed payments automatically cancel reservation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Cancellation Policy:</h4>
            <ul className="space-y-1">
              <li>• Cancel anytime before event starts</li>
              <li>• Refunds processed within 3-5 business days</li>
              <li>• Cancellation releases tickets back to event</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;