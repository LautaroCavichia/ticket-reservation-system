/**
 * Application header with navigation and user authentication status.
 * 
 * Shows different navigation options based on user authentication
 * state, demonstrating the permission-based UI differences.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            TicketReserve
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/events" 
              className="hover:text-primary-200 transition-colors"
            >
              Events
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === UserRole.REGISTERED && (
                  <Link 
                    to="/reservations" 
                    className="hover:text-primary-200 transition-colors"
                  >
                    My Reservations
                  </Link>
                )}
                
                <div className="flex items-center space-x-4">
                  <span className="text-primary-200">
                    Welcome, {user?.first_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-primary-200 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* User permission level indicator */}
        <div className="mt-2 text-sm text-primary-200">
          {isAuthenticated ? (
            user?.role === UserRole.REGISTERED ? (
              <span>✓ Registered User - Can make reservations</span>
            ) : (
              <span>○ Anonymous User - View events only</span>
            )
          ) : (
            <span>○ Not logged in - View events only</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;