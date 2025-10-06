'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { BarChart3, Users, DollarSign, Target, Activity, CheckSquare, Shield, TrendingUp } from 'lucide-react';

interface KPIOverviewProps {
  data: {
    revenue: { total: number; growth: number };
    clients: { total: number; active: number };
    billing: { revenue: number; pendingInvoices: number };
    leads: { qualified: number; avgScore: number };
    tasks: { pending: number; highPriority: number };
    aiTasks: { active: number };
  };
}

const KPIOverview: React.FC<KPIOverviewProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      <Card className="p-4 flex flex-col items-center">
        <DollarSign className="w-8 h-8 text-green-500 mb-2" />
        <h3 className="text-lg font-semibold">${data.revenue.total.toLocaleString()}</h3>
        <p className="text-sm text-gray-600">Revenue</p>
        <p className={`text-sm ${data.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {data.revenue.growth >= 0 ? '+' : ''}{data.revenue.growth}%
        </p>
      </Card>

      <Card className="p-4 flex flex-col items-center">
        <Users className="w-8 h-8 text-blue-500 mb-2" />
        <h3 className="text-lg font-semibold">{data.clients.active}</h3>
        <p className="text-sm text-gray-600">Active Clients</p>
        <p className="text-sm text-gray-500">Total: {data.clients.total}</p>
      </Card>

      <Card className="p-4 flex flex-col items-center">
        <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
        <h3 className="text-lg font-semibold">${data.billing.revenue.toLocaleString()}</h3>
        <p className="text-sm text-gray-600">Billing Revenue</p>
        <p className="text-sm text-gray-500">Pending: {data.billing.pendingInvoices}</p>
      </Card>

      <Card className="p-4 flex flex-col items-center">
        <Target className="w-8 h-8 text-yellow-500 mb-2" />
        <h3 className="text-lg font-semibold">{data.leads.qualified}</h3>
        <p className="text-sm text-gray-600">Qualified Leads</p>
        <p className="text-sm text-gray-500">Avg Score: {data.leads.avgScore.toFixed(1)}</p>
      </Card>

      <Card className="p-4 flex flex-col items-center">
        <CheckSquare className="w-8 h-8 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold">{data.tasks.pending}</h3>
        <p className="text-sm text-gray-600">Pending Tasks</p>
        <p className="text-sm text-gray-500">High Priority: {data.tasks.highPriority}</p>
      </Card>

      <Card className="p-4 flex flex-col items-center">
        <Activity className="w-8 h-8 text-indigo-500 mb-2" />
        <h3 className="text-lg font-semibold">{data.aiTasks.active}</h3>
        <p className="text-sm text-gray-600">Active AI Tasks</p>
      </Card>
    </div>
  );
};

export default KPIOverview;
