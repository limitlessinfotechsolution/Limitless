'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< Updated upstream:src/components/admin/AdvancedDashboard.tsx
import { Card } from '../ui/Card';
import Breadcrumb from '../ui/Breadcrumb';
import Skeleton from '../ui/Skeleton';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
=======
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ProjectsAndProducts from '@/components/home/ProjectsAndProducts';
>>>>>>> Stashed changes:src/components/admin/dashboard/AdvancedDashboard.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  Activity,
  Zap,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  totalLeads: number;
  recentLeads: number;
  totalProjects: number;
  publishedProjects: number;
}

interface RecentActivity {
  id: string;
  type: 'page' | 'testimonial' | 'lead' | 'project';
  action: string;
  title: string;
  timestamp: string;
}

interface PageData {
  id: string;
  page_name: string;
  content: Record<string, unknown> | null;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  approved: boolean;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

interface LeadData {
  id: string;
  business_basics: Record<string, unknown>;
  project_details: Record<string, unknown>;
  timeline_budget: Record<string, unknown>;
  source_page: string;
  lead_score: number;
  created_at: string;
  updated_at: string;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: Record<string, unknown>;
  tech_stack: Record<string, unknown>;
  industry: string;
  service_type: string;
  project_size: string;
  image: string;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

type WebSocketData =
  | { type: 'stats'; stats: DashboardStats }
  | { type: 'activity'; activity: RecentActivity }
  | { type: 'health'; health: { uptime: string; responseTime: number; memoryUsage: number; status: 'healthy' | 'warning' | 'error' } }
  | { type: string };

const AdvancedDashboard: React.FC = () => {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<{ date: string; leads: number }[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<{
    uptime: string;
    responseTime: number;
    memoryUsage: number;
    status: 'healthy' | 'warning' | 'error';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [timeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [trendData, setTrendData] = useState<{
    [key: string]: { change: number; trend: 'up' | 'down' | 'neutral' };
  }>({});

  // Calculate trend data based on time range
  const calculateTrends = useCallback((pages: PageData[], testimonials: TestimonialData[], leads: LeadData[], projects: ProjectData[]) => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000);

    const currentPeriod = {
      pages: pages.filter(p => new Date(p.created_at) >= periodStart).length,
      testimonials: testimonials.filter(t => new Date(t.created_at) >= periodStart).length,
      leads: leads.filter(l => new Date(l.created_at) >= periodStart).length,
      projects: projects.filter(p => new Date(p.created_at) >= periodStart).length,
    };

    const previousPeriod = {
      pages: pages.filter(p => new Date(p.created_at) >= previousPeriodStart && new Date(p.created_at) < periodStart).length,
      testimonials: testimonials.filter(t => new Date(t.created_at) >= previousPeriodStart && new Date(t.created_at) < periodStart).length,
      leads: leads.filter(l => new Date(l.created_at) >= previousPeriodStart && new Date(l.created_at) < periodStart).length,
      projects: projects.filter(p => new Date(p.created_at) >= previousPeriodStart && new Date(p.created_at) < periodStart).length,
    };

    const trends = {
      pages: previousPeriod.pages > 0 ? ((currentPeriod.pages - previousPeriod.pages) / previousPeriod.pages) * 100 : 0,
      testimonials: previousPeriod.testimonials > 0 ? ((currentPeriod.testimonials - previousPeriod.testimonials) / previousPeriod.testimonials) * 100 : 0,
      leads: previousPeriod.leads > 0 ? ((currentPeriod.leads - previousPeriod.leads) / previousPeriod.leads) * 100 : 0,
      projects: previousPeriod.projects > 0 ? ((currentPeriod.projects - previousPeriod.projects) / previousPeriod.projects) * 100 : 0,
    };

    const trendData: { [key: string]: { change: number; trend: 'up' | 'down' | 'neutral' } } = {
      pages: { change: Math.abs(trends.pages), trend: trends.pages > 0 ? 'up' : trends.pages < 0 ? 'down' : 'neutral' },
      testimonials: { change: Math.abs(trends.testimonials), trend: trends.testimonials > 0 ? 'up' : trends.testimonials < 0 ? 'down' : 'neutral' },
      leads: { change: Math.abs(trends.leads), trend: trends.leads > 0 ? 'up' : trends.leads < 0 ? 'down' : 'neutral' },
      projects: { change: Math.abs(trends.projects), trend: trends.projects > 0 ? 'up' : trends.projects < 0 ? 'down' : 'neutral' },
    };

    setTrendData(trendData);
  }, [timeRange]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasError(false);

    let pagesData = { pages: [] as PageData[] };
    let testimonialsData = { testimonials: [] as TestimonialData[] };
    let leadsData = { leads: [] as LeadData[] };
    let projectsData = { projects: [] as ProjectData[] };

    try {
      // Fetch pages
      try {
        const pagesRes = await fetch('/api/pages');
        if (pagesRes.ok) {
          pagesData = await pagesRes.json();
        }
      } catch (err) {
        console.error('Pages fetch error:', err);
      }

      // Fetch testimonials
      try {
        const testimonialsRes = await fetch('/api/testimonials');
        if (testimonialsRes.ok) {
          testimonialsData = await testimonialsRes.json();
        }
      } catch (err) {
        console.error('Testimonials fetch error:', err);
      }

      // Fetch leads
      try {
        const leadsRes = await fetch('/api/leads');
        if (leadsRes.ok) {
          leadsData = await leadsRes.json();
        }
      } catch (err) {
        console.error('Leads fetch error:', err);
      }

      // Fetch projects
      try {
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          projectsData = await projectsRes.json();
        }
      } catch (err) {
        console.error('Projects fetch error:', err);
      }

      // Calculate stats with fallbacks
      const dashboardStats: DashboardStats = {
        totalPages: pagesData.pages.length,
        publishedPages: pagesData.pages.filter((p) => p.is_published).length,
        totalTestimonials: testimonialsData.testimonials.length,
        approvedTestimonials: testimonialsData.testimonials.filter((t) => t.approved).length,
        totalLeads: leadsData.leads.length,
        recentLeads: leadsData.leads.filter((l) =>
          new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        totalProjects: projectsData.projects.length,
        publishedProjects: projectsData.projects.filter((p) => p.is_published).length,
      };

      setStats(dashboardStats);

      // Generate recent activity from available data
      const allActivities: RecentActivity[] = [];

      // Process pages
      pagesData.pages.forEach((page: PageData) => {
        allActivities.push({
          id: `page-${page.id}`,
          type: 'page',
          action: page.is_published ? 'Page published' : 'Page updated',
          title: page.page_name,
          timestamp: page.updated_at,
        });
      });

      // Process testimonials
      testimonialsData.testimonials.forEach((testimonial: TestimonialData) => {
        allActivities.push({
          id: `testimonial-${testimonial.id}`,
          type: 'testimonial',
          action: testimonial.approved ? 'Testimonial approved' : 'Testimonial submitted',
          title: `${testimonial.name} - ${testimonial.company}`,
          timestamp: testimonial.updated_at,
        });
      });

      // Process leads
      leadsData.leads.forEach((lead: LeadData) => {
        const businessBasics = lead.business_basics as { companyName?: string; contactName?: string };
        allActivities.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          action: 'New lead received',
          title: `${businessBasics.contactName || 'Unknown'} - ${businessBasics.companyName || 'Project Inquiry'}`,
          timestamp: lead.created_at,
        });
      });

      // Process projects
      projectsData.projects.forEach((project: ProjectData) => {
        allActivities.push({
          id: `project-${project.id}`,
          type: 'project',
          action: project.is_published ? 'Project published' : 'Project updated',
          title: project.title,
          timestamp: project.updated_at,
        });
      });

      // Sort by timestamp descending and take the 10 most recent
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(allActivities.slice(0, 10));

      // Generate chart data for leads over last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartDataMap = last7Days.map(date => {
        const count = leadsData.leads.filter((lead: LeadData) =>
          new Date(lead.created_at).toISOString().split('T')[0] === date
        ).length;
        return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), leads: count };
      });

      setChartData(chartDataMap);

      // Mock system health metrics
      const mockHealthMetrics = {
        uptime: '7d 4h 23m',
        responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
        memoryUsage: Math.floor(Math.random() * 30) + 60, // 60-90%
        status: 'healthy' as const,
      };
      setHealthMetrics(mockHealthMetrics);
      setLastUpdate(new Date());

      // Calculate trends
      calculateTrends(pagesData.pages, testimonialsData.testimonials, leadsData.leads, projectsData.projects);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(msg);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [calculateTrends]);

  // Type guards for WebSocket data
  const isStats = (data: WebSocketData): data is { type: 'stats'; stats: DashboardStats } => data.type === 'stats';
  const isActivity = (data: WebSocketData): data is { type: 'activity'; activity: RecentActivity } => data.type === 'activity';
  const isHealth = (data: WebSocketData): data is { type: 'health'; health: { uptime: string; responseTime: number; memoryUsage: number; status: 'healthy' | 'warning' | 'error' } } => data.type === 'health';

  // Handle real-time data updates
  const handleDataUpdate = useCallback((data: unknown) => {
    console.log('Real-time data update received:', data);
    const wsData = data as WebSocketData;
    // Update specific data based on the update type
    if (isStats(wsData)) {
      setStats(wsData.stats);
      setLastUpdate(new Date());
    } else if (isActivity(wsData)) {
      setRecentActivity(prev => [wsData.activity, ...prev.slice(0, 9)]);
    } else if (isHealth(wsData)) {
      setHealthMetrics(wsData.health);
    } else {
      // Trigger full refresh for other updates
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  const { isConnected, isConnecting } = useWebSocket({
    url: process.env.NEXT_PUBLIC_SOCKET_URL || '    ',
    autoConnect: true,
    onDataUpdate: handleDataUpdate,
  });

  useEffect(() => {
    fetchDashboardData();

    // Fallback polling every 5 minutes if WebSocket fails
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchDashboardData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboardData, isConnected]);

  if (loading) {
  return (
    <div className="w-full space-y-6">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-28 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Skeleton className="h-6 w-6 mb-2" />
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (hasError && error) {
    return (
      <div className="w-full space-y-6 p-6">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Failed to load dashboard data</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Retry</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) return (
    <div className="w-full space-y-6 p-6">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <Card className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No data available. Please check your connections.</p>
      </Card>
    </div>
  );

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.totalPages,
      subtitle: `${stats.publishedPages} published`,
      icon: FileText,
      color: 'blue',
      trend: trendData.pages,
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      subtitle: `${stats.approvedTestimonials} approved`,
      icon: MessageSquare,
      color: 'green',
      trend: trendData.testimonials,
    },
    {
      title: 'Leads',
      value: stats.totalLeads,
      subtitle: `${stats.recentLeads} this week`,
      icon: Users,
      color: 'purple',
      trend: trendData.leads,
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} published`,
      icon: TrendingUp,
      color: 'orange',
      trend: trendData.projects,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'testimonial':
        return <MessageSquare className="w-4 h-4" />;
      case 'lead':
        return <Users className="w-4 h-4" />;
      case 'project':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'text-blue-600';
      case 'testimonial':
        return 'text-green-600';
      case 'lead':
        return 'text-purple-600';
      case 'project':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : isConnecting ? (
              <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-gray-500">
              {isConnected ? 'Live' : isConnecting ? 'Connecting...' : 'Offline'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend?.trend === 'up' ? TrendingUp : card.trend?.trend === 'down' ? TrendingDown : Minus;
          const trendColor = card.trend?.trend === 'up' ? 'text-green-600' : card.trend?.trend === 'down' ? 'text-red-600' : 'text-gray-600';
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {card.subtitle}
                    </p>
                    {card.trend && card.trend.change > 0 && (
                      <div className={`flex items-center space-x-1 ${trendColor}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {card.trend.change.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* System Health */}
      {healthMetrics && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 capitalize">
                  {healthMetrics.status}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {healthMetrics.responseTime}ms
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {healthMetrics.memoryUsage}%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uptime: {healthMetrics.uptime}
            </p>
          </div>
        </Card>
      )}

      {/* Analytics Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Leads Trend (Last 7 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.title}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/pages')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <FileText className="w-6 h-6 mb-2 text-blue-600" />
            <h3 className="font-medium">Create New Page</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add a new page to your website</p>
          </button>
          <button
            onClick={() => router.push('/admin/testimonials')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <MessageSquare className="w-6 h-6 mb-2 text-green-600" />
            <h3 className="font-medium">Review Testimonials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approve pending testimonials</p>
          </button>
          <button
            onClick={() => router.push('/admin/leads')}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <Users className="w-6 h-6 mb-2 text-purple-600" />
            <h3 className="font-medium">View Leads</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check recent inquiries</p>
          </button>
        </div>
      </Card>
      
      {/* Projects and Products Section */}
      <ProjectsAndProducts />
    </div>
  );
};

export default AdvancedDashboard;
