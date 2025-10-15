import React from 'react';

interface EnterpriseKPIProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

const EnterpriseKPI: React.FC<EnterpriseKPIProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600">{change}</p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export default EnterpriseKPI;
