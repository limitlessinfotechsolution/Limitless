import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Filter,
  Download,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Card } from';
import Button from '../ui/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ChartDataPoint {
  name: string;
  value: number;
  previous?: number;
}

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative';
  data: ChartDataPoint[];
  color: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeType,
  data,
  color
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`flex items-center ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`w-4 h-4 ${changeType === 'positive' ? 'rotate-0' : 'rotate-180'}`} />
          <span className="ml-1 text-sm font-medium">
            {changeType === 'positive' ? '+' : ''}{change}%
          </span>
        </div>
      </div>

      <div className="mt-4 h-24 flex items-end space-x-1">
        {data.map((point, index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-t ${color}`}
            style={{ height: `${(point.value / maxValue) * 100}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${(point.value / maxValue) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {data.map((point, index) => (
          <span key={index}>{point.name}</span>
        ))}
      </div>
    </Card>
  );
};

interface AnalyticsProps {
  className?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsCardProps[]>([]);
  const [trafficSources, setTrafficSources] = useState<{ source: string; percentage: number; value: string; color: string }[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; views: string; change: number; changeType: 'positive' | 'negative' }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Get auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch analytics data from API
        const response = await fetch(`/api/enterprise/analytics?timeRange=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();

        setAnalyticsData(data.cards);
        setTrafficSources(data.trafficSources);
        setTopPages(data.topPages);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Keep default data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [supabase, timeRange]);

  if (isLoading) {
    return (
      <div className={className}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading analytics data...
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4 animate-spin" />}>
              Refreshing
            </Button>
          </div>
        </div>

        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-5">
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
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AnalyticsCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Revenue and user growth over time
            </p>
          </div>
          <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
            &nbsp;
          </Button>
        </div>

        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Detailed analytics chart visualization
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Traffic Sources
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>

          <div className="space-y-4">
            {trafficSources.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{item.source}</span>
                  <span className="text-gray-600 dark:text-gray-400">{item.percentage}% ({item.value})</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Performing Pages
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Most visited pages in the last 30 days
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              &nbsp;
            </Button>
          </div>

          <div className="space-y-4">
            {topPages.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.page}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.views} views</p>
                </div>
                <div className={`flex items-center ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`w-4 h-4 ${item.changeType === 'positive' ? 'rotate-0' : 'rotate-180'}`} />
                  <span className="ml-1 text-sm font-medium">
                    {item.changeType === 'positive' ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

