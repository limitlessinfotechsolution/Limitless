'use client';

import React, { useState } from 'react';
import LoginGate from '../../src/components/admin/LoginGate';
import AdminSidebar from '../../src/components/admin/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LoginGate>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="lg:hidden h-16"></div> {/* Spacer for mobile menu button */}
          {children}
        </main>
      </div>
    </LoginGate>
  );
};

export default AdminLayout;
