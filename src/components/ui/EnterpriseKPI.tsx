import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3
} from 'lucide-react';
import Card from './Card';

interface KPIItem {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  target?: string;
  progress?: number;
}

interface EnterpriseKPIProps {
  kpis: KPIItem[];
  className?: string;
  title?: string;
  description?: string;
}

const EnterpriseKPI: React.FC<EnterpriseKPIProps> = ({
  kpis,
  className = '',
  title = 'Key Performance Indicators',
  description = 'Track your most important business metrics'
}) => {
  const getChangeIcon = (changeType: string, size: number = 16) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className={`w-${size} h-${size} text-green-500`} />;
      case 'negative':
        return <TrendingDown className={`w-${size} h-${size} text-red-500`} />;
      default:
        return <Minus className={`w-${size} h-${size} text-gray-500`} />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className="p-5 h-full hover:shadow-enterprise transition-all duration-300"
              variant="feature"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  {kpi.icon}
                </div>
                <div className={`flex items-center ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType, 4)}
                  <span className="ml-1 font-medium">
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {kpi.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {kpi.value}
                </p>
              </div>
              
              {kpi.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {kpi.description}
                </p>
              )}
              
              {kpi.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Target</span>
                    <span className="font-medium text-gray-900 dark:text-white">{kpi.target}</span>
                  </div>
                </div>
              )}
              
              {kpi.progress !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-accent h-2 rounded-full" 
                      style={{ width: `${kpi.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{kpi.progress}%</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="mt-6 p-6" variant="feature">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Summary
          </h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm rounded-lg bg-accent text-white">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              Quarterly
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Performance chart visualization
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnterpriseKPI;