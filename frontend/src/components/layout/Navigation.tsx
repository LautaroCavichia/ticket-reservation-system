/**
 * Sidebar navigation component.
 * 
 * Provides secondary navigation for admin areas and
 * user account management sections.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = 'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors';
    const activeClasses = 'bg-primary-100 text-primary-700 border-r-2 border-primary-500';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  if (!isAuthenticated) {
    return (
      <nav className="p-4">
        <div className="space-y-2">
          <Link to="/login" className={getLinkClasses('/login')}>
            <span className="mr-3">🔐</span>
            Sign In
          </Link>
          <Link to="/register" className={getLinkClasses('/register')}>
            <span className="mr-3">📝</span>
            Create Account
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="p-4">
      <div className="space-y-6">
        {/* User Info */}
        <div className="px-4 py-3 bg-gray-50 rounded-md">
          <div className="text-sm font-medium text-gray-900">
            {user?.full_name}
          </div>
          <div className="text-xs text-gray-500">
            {user?.email}
          </div>
          <div className="text-xs mt-1">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              user?.role === UserRole.REGISTERED 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user?.role === UserRole.REGISTERED ? 'Registered User' : 'Anonymous User'}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>
          
          <Link to="/" className={getLinkClasses('/')}>
            <span className="mr-3">🏠</span>
            Home
          </Link>
          
          <Link to="/events" className={getLinkClasses('/events')}>
            <span className="mr-3">🎫</span>
            Events
          </Link>
        </div>

        {/* User Actions */}
        {user?.role === UserRole.REGISTERED && (
          <div className="space-y-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              My Account
            </div>
            
            <Link to="/reservations" className={getLinkClasses('/reservations')}>
              <span className="mr-3">📋</span>
              My Reservations
            </Link>
          </div>
        )}

        {/* Permission Information */}
        <div className="px-4 py-3 bg-blue-50 rounded-md">
          <div className="text-xs font-medium text-blue-900 mb-2">
            Available Actions:
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>✓ View Events</div>
            {user?.role === UserRole.REGISTERED && (
              <>
                <div>✓ Create Reservations</div>
                <div>✓ Manage Bookings</div>
                <div>✓ Process Payments</div>
              </>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="space-y-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Help
          </div>
          
          <div className="px-4 py-2 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="text-xs">
                <strong>Demo Accounts:</strong>
              </div>
              <div className="text-xs text-gray-500">
                Admin: admin@example.com
              </div>
              <div className="text-xs text-gray-500">
                User: user@example.com
              </div>
              <div className="text-xs text-gray-500">
                Password: admin123 / user123
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;