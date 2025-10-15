'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Bot,
  Lightbulb,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Image from 'next/image';
import { WebSocketService } from '../../lib/websocketService';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import KPIOverview from './KPIOverview';
import DrillDownChart from './DrillDownChart';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface MetricData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  trend
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-accent/10 text-accent">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <ArrowUpRight className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        ) : (
          <ArrowDownRight className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        )}
        <span className={`text-sm font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
      </div>
    </Card>
  );
};

interface ActivityItemProps {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

interface DashboardData {
  revenue: { total: number; growth: number };
  users: { active: number; growth: number };
  projects: { total: number; growth: number };
  sessions: { active: number; growth: number };
  clients: { total: number; active: number };
  billing_invoices?: { status: string }[];
  tasks: { total: number; completed: number };
  leads: { total: number };
}

interface AiInsight {
  title: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ name, action, time, avatar }) => {
  return (
    <div className="flex items-start py-3">
      <div className="relative w-8 h-8 rounded-full">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {name} <span className="font-normal text-gray-600 dark:text-gray-400">{action}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: "Total Revenue",
      value: "$0.00",
      change: "0%",
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: "Active Users",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: "Projects",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: "Active Sessions",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: <Activity className="w-6 h-6" />,
      trend: 'up'
    }
  ]);

  const [activities, setActivities] = useState<ActivityItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const supabase = createClientComponentClient();
  const wsService = useMemo(() => new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'wss://limitlessinfotech.com'), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch dashboard data from API
        const response = await fetch('/api/enterprise/dashboard', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await response.json();
        setDashboardData(dashboardData);

        // Calculate metrics from API data
        const newMetrics = [
          {
            title: "Total Revenue",
            value: `$${dashboardData.revenue.total.toLocaleString()}`,
            change: `${dashboardData.revenue.growth > 0 ? '+' : ''}${dashboardData.revenue.growth}%`,
            isPositive: dashboardData.revenue.growth > 0,
            icon: <DollarSign className="w-6 h-6" />,
            trend: dashboardData.revenue.growth > 0 ? 'up' as const : 'down' as const
          },
          {
            title: "Active Users",
            value: dashboardData.users.active.toString(),
            change: `${dashboardData.users.growth > 0 ? '+' : ''}${dashboardData.users.growth}%`,
            isPositive: dashboardData.users.growth > 0,
            icon: <Users className="w-6 h-6" />,
            trend: dashboardData.users.growth > 0 ? 'up' as const : 'down' as const
          },
          {
            title: "Projects",
            value: dashboardData.projects.total.toString(),
            change: `${dashboardData.projects.growth > 0 ? '+' : ''}${dashboardData.projects.growth}%`,
            isPositive: dashboardData.projects.growth > 0,
            icon: <TrendingUp className="w-6 h-6" />,
            trend: dashboardData.projects.growth > 0 ? 'up' as const : 'down' as const
          },
          {
            title: "Active Sessions",
            value: dashboardData.sessions.active.toString(),
            change: `${dashboardData.sessions.growth > 0 ? '+' : ''}${dashboardData.sessions.growth}%`,
            isPositive: dashboardData.sessions.growth > 0,
            icon: <Activity className="w-6 h-6" />,
            trend: dashboardData.sessions.growth > 0 ? 'up' as const : 'down' as const
          }
        ];

        setMetrics(newMetrics);

        // Fetch recent activities (audit logs) - keeping this as it's working
        const { data: auditLogs } = await supabase
          .from('audit_logs')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false })
          .limit(4);

        // Format activities
        const formattedActivities = auditLogs?.map(log => ({
          name: log.profiles?.full_name || 'Unknown User',
          action: log.action || 'performed an action',
          time: new Date(log.created_at).toLocaleString(),
          avatar: log.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.profiles?.full_name || 'Unknown')}&background=random`
        })) || [];

        setActivities(formattedActivities);

        // Fetch AI insights
        const insightsResponse = await fetch('/api/enterprise/ai/insights', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setAiInsights(insightsData.insights || []);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep default metrics on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up WebSocket connection for real-time updates
    wsService.connect();
    wsService.onMessage((data) => {
      if (data.type === 'dashboard_update') {
        // Handle real-time dashboard updates
        // Refresh data if needed
        fetchDashboardData();
      }
    });

    return () => {
      wsService.disconnect();
    };
  }, [supabase, wsService]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */} 
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading dashboard data...
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4 animate-spin" />}>
              Refreshing
            </Button>
          </div>
        </div>

        {/* Loading Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="primary" size="sm">
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <KPIOverview
        data={{
          revenue: {
            total: dashboardData!.revenue.total,
            growth: dashboardData!.revenue.growth
          },
          clients: {
            total: dashboardData!.clients.total,
            active: dashboardData!.clients.active
          },
          billing: {
            revenue: dashboardData!.revenue.total,
            pendingInvoices: dashboardData!.billing_invoices?.filter((inv: { status: string }) => inv.status === 'pending').length || 0
          },
          leads: {
            qualified: dashboardData!.leads.total, // Assuming all leads are qualified for now
            avgScore: 75 // Placeholder - would need lead scoring system
          },
          tasks: {
            pending: dashboardData!.tasks.total - dashboardData!.tasks.completed,
            highPriority: dashboardData!.tasks.total * 0.2 // Placeholder - assuming 20% are high priority
          },
          aiTasks: {
            active: aiInsights.length
          }
        }}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Analytics for the last 12 months - Click bars to drill down
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6">
            <DrillDownChart
              data={[
                { name: 'Revenue', value: 45000, details: [{ name: 'Q1', value: '12000' }, { name: 'Q2', value: '15000' }, { name: 'Q3', value: '10000' }, { name: 'Q4', value: '8000' }] },
                { name: 'Users', value: 1200, details: [{ name: 'New', value: '300' }, { name: 'Returning', value: '900' }] },
                { name: 'Projects', value: 45, details: [{ name: 'Active', value: '35' }, { name: 'Completed', value: '10' }] },
                { name: 'Sessions', value: 8900, details: [{ name: 'Desktop', value: '4500' }, { name: 'Mobile', value: '4400' }] }
              ]}
              title="Interactive Performance Chart"
            />
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View all activity
          </Button>
        </Card>
      </div>

      {/* Anomaly Detection and Performance Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Anomaly Detection</h2>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { type: "Revenue Spike", description: "Unusual 45% increase in Q4 revenue", severity: "high", time: "2 hours ago" },
              { type: "User Drop", description: "15% decrease in active users on mobile", severity: "medium", time: "1 day ago" },
              { type: "Session Anomaly", description: "Abnormally high session duration detected", severity: "low", time: "3 days ago" }
            ].map((anomaly, index) => {
              const severityColors = {
                high: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
                medium: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
                low: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
              };
              const severityIcon = {
                high: 'text-red-500',
                medium: 'text-yellow-500',
                low: 'text-blue-500'
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${severityColors[anomaly.severity as keyof typeof severityColors]}`}>
                  <div className="flex items-start">
                    <Zap className={`w-5 h-5 ${severityIcon[anomaly.severity as keyof typeof severityIcon]} mt-0.5 mr-3 flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{anomaly.type}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{anomaly.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{anomaly.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Performance Recommendations */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Recommendations</h2>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { title: "Optimize Mobile Experience", description: "Mobile user engagement dropped 15%. Consider improving load times and UI responsiveness.", impact: "High", priority: "Critical" },
              { title: "Increase Lead Conversion", description: "Lead qualification rate is below target. Implement automated scoring system.", impact: "Medium", priority: "High" },
              { title: "Task Automation", description: "45% of tasks are repetitive. AI automation could save 20+ hours weekly.", impact: "High", priority: "Medium" }
            ].map((recommendation, index) => {
              const priorityColors = {
                Critical: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
                High: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
                Medium: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
              };
              const priorityIcon = {
                Critical: 'text-red-500',
                High: 'text-orange-500',
                Medium: 'text-blue-500'
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${priorityColors[recommendation.priority as keyof typeof priorityColors]}`}>
                  <div className="flex items-start">
                    <Target className={`w-5 h-5 ${priorityIcon[recommendation.priority as keyof typeof priorityIcon]} mt-0.5 mr-3 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{recommendation.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${recommendation.impact === 'High' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'}`}>
                          {recommendation.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{recommendation.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h2>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {aiInsights.length > 0 ? (
              aiInsights.map((insight, index) => {
                const colors = [
                  { bg: 'from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20', border: 'border-purple-200 dark:border-purple-800', icon: 'text-purple-500' },
                  { bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20', border: 'border-green-200 dark:border-green-800', icon: 'text-green-500' },
                  { bg: 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20', border: 'border-orange-200 dark:border-orange-800', icon: 'text-orange-500' }
                ];
                const colorScheme = colors[index % colors.length];
                const icons = [Lightbulb, Target, Zap];
                const IconComponent = icons[index % icons.length];

                return (
                  <div key={index} className={`p-4 bg-gradient-to-r ${colorScheme.bg} rounded-lg border ${colorScheme.border}`}>
                    <div className="flex items-start">
                      <IconComponent className={`w-5 h-5 ${colorScheme.icon} mt-0.5 mr-3 flex-shrink-0`} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Loading AI Insights...</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        AI is analyzing your data to provide insights.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Performance</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Team metrics and productivity
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Team performance visualization
              </p>
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Scheduled meetings and deadlines
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { title: "Quarterly Review", date: "Tomorrow, 10:00 AM", type: "Meeting" },
              { title: "Product Launch", date: "Jun 15, 2023", type: "Deadline" },
              { title: "Team Building", date: "Jun 20, 2023", type: "Event" },
            ].map((event, index) => (
              <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.date}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;
