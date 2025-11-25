import React from 'react';
import AdminSidebar, { AdminView } from 'components/admin/ui/AdminSidebar';
import { useTheme } from 'next-themes';

interface AdminLayoutProps {
  activeView: AdminView;
  setActiveView: (v: AdminView) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeView,
  setActiveView,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <AdminSidebar
        isOpen={true}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main area */}
      <section className="flex-1 overflow-y-auto">
        {/* Optional top bar */}
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </h2>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </section>
    </div>
  );
};
