'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Users, BarChart3, FileText, MessageCircle, Calendar, Bell, LayoutDashboard } from 'lucide-react';
import { Suspense } from 'react';

interface Stats {
  totalUsers: number;
  activeTeams: number;
  totalNotifications: number;
  recentEvents: number;
}

import { TypedSupabaseClient } from '../../src/types';

async function fetchEnterpriseStats(supabase: TypedSupabaseClient): Promise<Stats> {
  // Fetch total users
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  // Fetch active teams (assuming 'team_members' table)
  const { count: activeTeams } = await supabase.from('team_members').select('*', { count: 'exact', head: true });

  // Fetch total notifications (assuming 'chat_messages' table)
  const { count: totalNotifications } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true });

  // Fetch recent events (last 7 days, assuming 'chat_sessions' table)
  const { count: recentEvents } = await supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return {
    totalUsers: totalUsers || 0,
    activeTeams: activeTeams || 0,
    totalNotifications: totalNotifications || 0,
    recentEvents: recentEvents || 0,
  };
}

const StatsLoader = () => {
  const supabase = createClientComponentClient<TypedSupabaseClient>();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['enterprise-stats'],
    queryFn: () => fetchEnterpriseStats(supabase),
  });

  if (isLoading) return <div className="animate-pulse bg-gray-200 h-4 rounded w-full"></div>;
  if (error) return <div className="text-red-500">Error loading stats</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-blue-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <LayoutDashboard className="w-6 h-6 text-green-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Teams</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeTeams}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-yellow-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notifications</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalNotifications}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.recentEvents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnterpriseOverview: React.FC = () => {
  const features = [
    {
      name: 'Dashboard',
      description: 'Real-time business metrics and insights',
      icon: LayoutDashboard,
      href: '/enterprise/dashboard',
    },
    {
      name: 'Team Management',
      description: 'Manage your team members and performance',
      icon: Users,
      href: '/enterprise/team',
    },
    {
      name: 'Analytics',
      description: 'Advanced data visualization and reporting',
      icon: BarChart3,
      href: '/enterprise/analytics',
    },
    {
      name: 'Reporting',
      description: 'Generate comprehensive business reports',
      icon: FileText,
      href: '/enterprise/reporting',
    },
    {
      name: 'Team Chat',
      description: 'Real-time collaboration and communication',
      icon: MessageCircle,
      href: '/enterprise/chat',
    },
    {
      name: 'Calendar',
      description: 'Schedule and manage events efficiently',
      icon: Calendar,
      href: '/enterprise/calendar',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Enterprise Suite
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Advanced tools for modern business management. Monitor performance, collaborate with your team, and make data-driven decisions.
        </p>
        <Link
          href="/enterprise/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Quick Stats</h2>
        <Suspense fallback={<div className="text-center py-8">Loading stats...</div>}>
          <StatsLoader />
        </Suspense>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Explore →
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default EnterpriseOverview;
