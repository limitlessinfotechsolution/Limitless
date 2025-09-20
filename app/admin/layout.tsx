import React from 'react';
import LoginGate from '../../src/components/admin/LoginGate';
import AdminSidebar from '../../src/components/admin/AdminSidebar-fixed';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoginGate>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </LoginGate>
  );
};

export default AdminLayout;
