import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/ui/AdminSidebar';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface AuditLayoutProps {
  children: ReactNode;
}

export default function AuditLayout({ children }: AuditLayoutProps) {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Audit Logs', href: '/admin/audit' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
