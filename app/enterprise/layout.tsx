'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, User, BarChart3, FileText, DollarSign, MessageCircle, Calendar, Bell, Table, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import AuralisAssistant from '../../src/components/ui/AuralisAssistant';

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClientComponentClient(), []);

  useEffect(() => {
    // For login page, bypass auth and loading
    if (pathname === '/enterprise/login') {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/enterprise/login');
        return;
      }

      // Fetch user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || (profile.role !== 'enterprise' && profile.role !== 'super_admin')) {
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [supabase, router, pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/enterprise/dashboard', icon: LayoutDashboard },
    { name: 'Team', href: '/enterprise/team', icon: Users },
    { name: 'Profile', href: '/enterprise/profile', icon: User },
    { name: 'Analytics', href: '/enterprise/analytics', icon: BarChart3 },
    { name: 'Reporting', href: '/enterprise/reporting', icon: FileText },
    { name: 'Pricing', href: '/enterprise/pricing', icon: DollarSign },
    { name: 'Chat', href: '/enterprise/chat', icon: MessageCircle },
    { name: 'Calendar', href: '/enterprise/calendar', icon: Calendar },
    { name: 'Notifications', href: '/enterprise/notifications', icon: Bell },
    { name: 'Data Management', href: '/enterprise/data', icon: Table },
    { name: 'Forms', href: '/enterprise/form', icon: Edit3 },
  ];

  if (isLoading && pathname !== '/enterprise/login') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Enterprise Suite...</p>
        </div>
      </div>
    );
  }

  // For login page, render children directly without auth check or sidebar
  if (pathname === '/enterprise/login') {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        } relative`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md z-10"
        >
          {isExpanded ? (
            <ChevronLeft className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {isExpanded ? (
            <>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Enterprise Suite</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Management Dashboard</p>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-white border-r-4 border-accent-dark'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={!isExpanded ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : ''} flex-shrink-0`} />
                    {isExpanded && <span className="truncate">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Auralis AI Assistant */}
      <AuralisAssistant />
    </div>
  );
}
