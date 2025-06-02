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
    </div>
  );
};

export default Layout;