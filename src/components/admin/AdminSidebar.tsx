'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Users,
  UserCheck,
  HelpCircle,
  Mail,
  Search,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Pages',
      href: '/admin/pages',
      icon: FileText,
    },
    {
      name: 'Portfolio',
      href: '/admin/portfolio',
      icon: Briefcase,
    },
    {
      name: 'Testimonials',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      name: 'Leads',
      href: '/admin/leads',
      icon: Users,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UserCheck,
    },
    {
      name: 'FAQ',
      href: '/admin/faq',
      icon: HelpCircle,
    },
    {
      name: 'Mail',
      href: '/admin/mail',
      icon: Mail,
    },
    {
      name: 'SEO',
      href: '/admin/seo',
      icon: Search,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose} // Close sidebar on mobile when navigating
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
