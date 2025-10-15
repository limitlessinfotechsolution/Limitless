import React from 'react';

const EnterpriseAnalytics: React.FC = () => {
  return (
    <div className="enterprise-analytics">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">$125,430</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">New Customers</h3>
          <p className="text-2xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
          <p className="text-2xl font-bold text-gray-900">3.2%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Avg. Session</h3>
          <p className="text-2xl font-bold text-gray-900">4m 32s</p>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart placeholder</p>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart placeholder</p>
        </div>
      </div>

      {/* Top Performing Pages */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Top Performing Pages</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>/home</span>
            <span className="font-medium">12,345 views</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>/products</span>
            <span className="font-medium">8,901 views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAnalytics;
