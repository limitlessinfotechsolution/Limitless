'use client';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';
import Dashboard from '@/components/enterprise/Dashboard';
import KPI from '@/components/enterprise/KPI';
import Skeleton from '@/components/ui/Skeleton';

interface KPIItem {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  description: string;
  target: string;
  progress: number;
}

import { TypedSupabaseClient } from '@/types';

async function fetchKPIs(supabase: TypedSupabaseClient): Promise<KPIItem[]> {
  // Fetch KPIs from Supabase (assume 'kpis' table with fields: title, value, change, change_type, description, target, progress)
  const { data, error } = await supabase
    .from('kpis')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error('No KPI data available');
  }

  // Map data to KPIItem interface
  const { DollarSign, Users, ShoppingCart, TrendingUp } = await import('lucide-react');
  const icons = [DollarSign, Users, ShoppingCart, TrendingUp];
  return data.map((item, index: number) => ({
    ...item,
    changeType: item.change > 0 ? 'positive' : 'negative',
    icon: icons[index % icons.length]({ className: 'w-6 h-6' }),
  }));
}

const DashboardContent = () => {
  const supabase = createClientComponentClient();

  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['enterprise-kpis'],
    queryFn: () => fetchKPIs(supabase),
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading KPIs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your enterprise.</p>
      </div>

      {/* KPIs Section */}
      <Suspense fallback={<KPILoading />}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Key Performance Indicators</h2>
          {isLoading ? (
            <KPILoading />
          ) : (
            <KPI kpis={kpis || []} />
          )}
        </div>
      </Suspense>

      {/* Dashboard Section */}
      <Suspense fallback={<DashboardLoading />}>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
          {isLoading ? (
            <DashboardLoading />
          ) : (
            <Dashboard />
          )}
        </div>
      </Suspense>
    </div>
  );
};

const KPILoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
);

const DashboardLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-64 w-full" />
    ))}
  </div>
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
