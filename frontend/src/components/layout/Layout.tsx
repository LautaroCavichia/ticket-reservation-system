/**
 * Main layout component providing consistent page structure.
 * 
 * Wraps page content with navigation, header, and footer
 * providing the overall application layout structure.
 */
import React, { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Sidebar navigation (optional) */}
        {showSidebar && (
          <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
            <Navigation />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TicketReserve</h3>
              <p className="text-gray-300 text-sm">
                A modern ticket reservation system demonstrating secure authentication, 
                role-based permissions, and seamless booking experience.
              </p>
            </div>

            <div>
              <h4 className="text-md font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• JWT Authentication</li>
                <li>• Role-based Permissions</li>
                <li>• Real-time Availability</li>
                <li>• Secure Payment Processing</li>
                <li>• RESTful API Design</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-medium mb-4">API Documentation</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>This is a demo application showcasing:</p>
                <ul className="space-y-1">
                  <li>• Flask REST API</li>
                  <li>• React TypeScript Frontend</li>
                  <li>• Permission-based Access Control</li>
                  <li>• Modern Development Practices</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TicketReserve. Demo application for API showcase.</p>
            <p className="mt-2">Built with Flask, React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;