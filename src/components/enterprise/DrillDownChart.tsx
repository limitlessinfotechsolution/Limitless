'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { BarChart3, PieChart, ArrowLeft } from 'lucide-react';

interface DrillDownChartProps {
  data: any[];
  title: string;
  onBack?: () => void;
}

const DrillDownChart: React.FC<DrillDownChartProps> = ({ data, title, onBack }) => {
  const [drillDownData, setDrillDownData] = useState<any[] | null>(null);

  const handleBarClick = (item: any) => {
    // Simulate drill-down by showing details of clicked item
    setDrillDownData(item.details || []);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        {drillDownData && (
          <button
            onClick={() => setDrillDownData(null)}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
        )}
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        {drillDownData ? (
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 overflow-auto max-h-56 w-full">
            {drillDownData.length > 0 ? (
              drillDownData.map((detail, idx) => (
                <li key={idx} className="border-b border-gray-200 dark:border-gray-700 py-1">
                  {detail.name}: {detail.value}
                </li>
              ))
            ) : (
              <li>No details available</li>
            )}
          </ul>
        ) : (
          <div className="text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>Click on a bar to drill down</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DrillDownChart;
