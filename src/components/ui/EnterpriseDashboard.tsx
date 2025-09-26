import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Image from 'next/image';

interface MetricCardProps {
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
    <Card variant="elevated" className="hover:shadow-enterprise-lg transition-all duration-300">
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

const EnterpriseDashboard: React.FC = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up' as const
    },
    {
      title: "Subscriptions",
      value: "+12,234",
      change: "+18.2%",
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      trend: 'up' as const
    },
    {
      title: "Sales",
      value: "+1,234",
      change: "-1.2%",
      isPositive: false,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'down' as const
    },
    {
      title: "Active Now",
      value: "573",
      change: "+2.1%",
      isPositive: true,
      icon: <Activity className="w-6 h-6" />,
      trend: 'up' as const
    }
  ];

  const activities = [
    {
      name: "Olivia Martin",
      action: "made a purchase",
      time: "2 minutes ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Jackson Lee",
      action: "subscribed to premium",
      time: "15 minutes ago",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Isabella Nguyen",
      action: "left a comment",
      time: "1 hour ago",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "William Kim",
      action: "shared a document",
      time: "3 hours ago",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

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
        <Card className="lg:col-span-2 p-6" variant="elevated">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Analytics for the last 12 months
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>
          <div className="mt-6 h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Performance chart visualization
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6" variant="elevated">
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

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <Card variant="elevated" className="p-6">
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
        <Card variant="elevated" className="p-6">
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

export default EnterpriseDashboard;