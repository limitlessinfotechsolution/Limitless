'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/ui/useTheme';
import {
  UserCheck,
  Users,
  HelpCircle,
  Search,
  X,
  Bell,
  Moon,
  Sun,
  Shield,
  Settings,
  Activity,
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

export type AdminView =
  | 'dashboard'
  | 'pages'
  | 'portfolio'
  | 'testimonials'
  | 'leads'
  | 'users'
  | 'faq';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeView?: AdminView;
  setActiveView?: (view: AdminView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = true,
  onClose,
  activeView,
  setActiveView,
}) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsOpen &&
        !(event.target as Element).closest('.notifications-container')
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const { theme, setTheme } = useTheme();

  const notifications = [
    {
      id: '1',
      type: 'lead',
      message: 'New lead received: John Doe - Web Development Project',
      time: '2 minutes ago',
      unread: true,
    },
    {
      id: '2',
      type: 'testimonial',
      message: 'Testimonial pending approval: Sarah Johnson',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      type: 'page',
      message: 'Page updated: Services page content changed',
      time: '3 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const navigationGroups = [
    {
      name: 'Core Management',
      items: [
        { name: 'Dashboard', view: 'dashboard' as AdminView, icon: LayoutDashboard },
        { name: 'Pages', view: 'pages' as AdminView, icon: FileText },
        { name: 'Portfolio', view: 'portfolio' as AdminView, icon: Briefcase },
        { name: 'Testimonials', view: 'testimonials' as AdminView, icon: MessageSquare },
        { name: 'Leads', view: 'leads' as AdminView, icon: Users },
        { name: 'Users', view: 'users' as AdminView, icon: UserCheck },
        { name: 'FAQ', view: 'faq' as AdminView, icon: HelpCircle },
      ],
    },
    { name: 'Audit Logs', href: '/admin/audit', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security', href: '/admin/security', icon: Shield },
  ];

  const filteredGroups = searchQuery
    ? navigationGroups
        .map((group: any) => {
          if (group.items) {
            return {
              ...group,
              items: group.items.filter((item: any) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              ),
            };
          }
          return group.name.toLowerCase().includes(searchQuery.toLowerCase()) ? group : null;
        })
        .filter(Boolean)
    : navigationGroups;

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isViewActive = activeView && item.view && activeView === item.view;
    const isPathActive = item.href && pathname === item.href;
    const isActive = isViewActive || isPathActive;

    const baseClasses = `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

    if (item.href) {
      return (
        <Link href={item.href} className={baseClasses}>
          <Icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      );
    }

    return (
      <button
        onClick={() => setActiveView && item.view && setActiveView(item.view)}
        className={baseClasses}
      >
        <Icon className="w-5 h-5" />
        <span>{item.name}</span>
      </button>
    );
  };

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
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group: any, index: number) => (
                <div key={group.name || index}>
                  {group.items ? (
                    <>
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {group.name}
                      </h3>
                      <ul className="space-y-1">
                        {group.items.map((item: any) => (
                          <li key={item.name}>
                            {renderNavItem(item)}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    renderNavItem(group)
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No navigation items found.</p>
            )}
          </div>
        </nav>
      </aside>

      {/* Notifications dropdown */}
      {notificationsOpen && (
        <div className="notifications-container absolute top-20 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    notification.unread ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                >
                  <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mark all as read</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;