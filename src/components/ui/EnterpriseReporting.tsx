import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar, BarChart3, PieChartIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie';
  data: Record<string, unknown>[];
  xAxisKey: string;
  yAxisKey: string;
  color?: string;
}

interface EnterpriseReportingProps {
  reports: ReportData[];
  title?: string;
  description?: string;
  className?: string;
  onExport?: () => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const EnterpriseReporting: React.FC<EnterpriseReportingProps> = ({
  reports,
  title = 'Enterprise Reporting',
  description,
  className = '',
  onExport,
  onFilterChange,
}) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeReport, setActiveReport] = useState(0);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    if (onFilterChange) {
      onFilterChange({ dateRange: newRange });
    }
  };

  const exportReport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export implementation
      const dataStr = JSON.stringify(reports[activeReport].data);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `${reports[activeReport].title.replace(/\s+/g, '_')}_report.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const renderChart = (report: ReportData) => {
    switch (report.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={report.xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={report.yAxisKey} fill={report.color || COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={report.xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={report.yAxisKey} 
                stroke={report.color || COLORS[0]} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={report.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey={report.yAxisKey}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
              >
                {report.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportReport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              data-testid="start-date-input"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              data-testid="end-date-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>All Categories</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 overflow-x-auto">
          {reports.map((report, index) => (
            <motion.button
              key={report.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveReport(index)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeReport === index
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {report.type === 'bar' && <BarChart3 className="w-4 h-4 mr-1" />}
              {report.type === 'line' && <TrendingUp className="w-4 h-4 mr-1" />}
              {report.type === 'pie' && <PieChartIcon className="w-4 h-4 mr-1" />}
              {report.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            {reports[activeReport]?.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {reports[activeReport]?.description}
          </p>
        </div>
        
        {reports[activeReport] && renderChart(reports[activeReport])}
        
        {reports.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new report.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnterpriseReporting;