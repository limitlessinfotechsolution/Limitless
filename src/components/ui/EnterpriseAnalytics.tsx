import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import Card from './Card';
import Button from './Button';

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
    <Card className="p-5" variant="feature">
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

interface EnterpriseAnalyticsProps {
  className?: string;
}

const EnterpriseAnalytics: React.FC<EnterpriseAnalyticsProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const analyticsData = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: 12.5,
      changeType: 'positive' as const,
      color: 'bg-blue-500',
      data: [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 2000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 }
      ]
    },
    {
      title: 'New Customers',
      value: '1,234',
      change: 18.2,
      changeType: 'positive' as const,
      color: 'bg-green-500',
      data: [
        { name: 'Mon', value: 240 },
        { name: 'Tue', value: 139 },
        { name: 'Wed', value: 180 },
        { name: 'Thu', value: 190 },
        { name: 'Fri', value: 210 },
        { name: 'Sat', value: 240 },
        { name: 'Sun', value: 280 }
      ]
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: -1.2,
      changeType: 'negative' as const,
      color: 'bg-yellow-500',
      data: [
        { name: 'Mon', value: 4.1 },
        { name: 'Tue', value: 4.3 },
        { name: 'Wed', value: 4.5 },
        { name: 'Thu', value: 4.2 },
        { name: 'Fri', value: 4.0 },
        { name: 'Sat', value: 3.8 },
        { name: 'Sun', value: 4.2 }
      ]
    },
    {
      title: 'Avg. Session',
      value: '5m 23s',
      change: 2.1,
      changeType: 'positive' as const,
      color: 'bg-purple-500',
      data: [
        { name: 'Mon', value: 320 },
        { name: 'Tue', value: 310 },
        { name: 'Wed', value: 330 },
        { name: 'Thu', value: 340 },
        { name: 'Fri', value: 320 },
        { name: 'Sat', value: 310 },
        { name: 'Sun', value: 323 }
      ]
    }
  ];

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
      <Card className="p-6 mb-8" variant="feature">
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
        <Card className="p-6" variant="feature">
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
            {[
              { source: 'Direct', percentage: 45, value: '12,345', color: 'bg-blue-500' },
              { source: 'Social', percentage: 25, value: '6,789', color: 'bg-green-500' },
              { source: 'Search', percentage: 20, value: '5,432', color: 'bg-yellow-500' },
              { source: 'Referral', percentage: 10, value: '2,345', color: 'bg-purple-500' }
            ].map((item, index) => (
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
        
        <Card className="p-6" variant="feature">
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
            {[
              { page: '/dashboard', views: '24,567', change: 12.5, changeType: 'positive' },
              { page: '/products', views: '18,432', change: 8.2, changeType: 'positive' },
              { page: '/pricing', views: '12,876', change: -2.1, changeType: 'negative' },
              { page: '/about', views: '9,234', change: 5.7, changeType: 'positive' },
              { page: '/contact', views: '7,654', change: 3.4, changeType: 'positive' }
            ].map((item, index) => (
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

export default EnterpriseAnalytics;