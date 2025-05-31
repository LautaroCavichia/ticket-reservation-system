/**
 * Landing page showcasing the application features.
 * 
 * Demonstrates different user permission levels and
 * provides clear navigation to main functionality.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to TicketReserve
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A demo REST API application showcasing role-based permissions, 
          secure authentication, and ticket reservation management.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/events"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-lg transition-colors"
          >
            Browse Events
          </Link>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg text-lg transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>

      {/* Permission Levels Demo */}
      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          User Permission Levels Demo
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Anonymous Users */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
              <h3 className="text-lg font-medium">Anonymous Users</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>✓ View all events</li>
              <li>✓ Search and filter events</li>
              <li>✓ View event details</li>
              <li>✗ Cannot make reservations</li>
              <li>✗ Cannot access reservation history</li>
            </ul>
            {!isAuthenticated && (
              <p className="text-sm text-blue-600 mt-4">
                🔍 You are currently browsing as an anonymous user
              </p>
            )}
          </div>

          {/* Registered Users */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <h3 className="text-lg font-medium">Registered Users</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>✓ All anonymous permissions</li>
              <li>✓ Create ticket reservations</li>
              <li>✓ Process payments</li>
              <li>✓ View reservation history</li>
              <li>✓ Cancel reservations</li>
            </ul>
            {isAuthenticated && user?.role === UserRole.REGISTERED && (
              <p className="text-sm text-green-600 mt-4">
                ✅ You have registered user access
              </p>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Ready to make reservations? Create an account to unlock full features.
            </p>
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded transition-colors"
            >
              Register Now
            </Link>
          </div>
        )}
      </section>

      {/* API Features Showcase */}
      <section className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          REST API Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              🔐
            </div>
            <h3 className="font-medium mb-2">JWT Authentication</h3>
            <p className="text-sm text-gray-600">
              Secure token-based authentication with role-based permissions
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              🎫
            </div>
            <h3 className="font-medium mb-2">Event Management</h3>
            <p className="text-sm text-gray-600">
              Full CRUD operations for events with real-time availability tracking
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="font-medium mb-2">Reservation System</h3>
            <p className="text-sm text-gray-600">
              Complete ticket booking with payment processing and cancellation
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;