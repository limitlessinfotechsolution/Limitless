'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';
import EnterpriseReporting from '../../../src/components/enterprise/EnterpriseReporting';
import Skeleton from '@/components/ui/Skeleton';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

import { TypedSupabaseClient } from '../../../src/types';

async function fetchReports(supabase: TypedSupabaseClient): Promise<ReportData[]> {
  // Fetch reports from Supabase (assume 'reports' table with fields: title, type, period, generated_at, data (json), summary (json))
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false })
    .limit(6);

  if (error) throw error;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (!data || data.length === 0) {
    throw new Error('No reports found');
  }

  // Map data to ReportData (parse JSON fields if stored as jsonb)
  return data.map((item) => ({
    ...item,
    data: item.data || [],
    description: item.description || 'No description available',
    xAxisKey: item.x_axis_key || 'name',
    yAxisKey: item.y_axis_key || 'value',
    color: item.color || COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}


const ReportingContent = () => {
  const supabase = createClientComponentClient();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['enterprise-reports'],
    queryFn: () => fetchReports(supabase),
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading reports: {error.message}</p>
      </div>
    );
  }

  const handleExportPDF = (doc: jsPDF) => {
    doc.text('Enterprise Reports', 20, 20);
    if (reports) {
      reports.forEach((report, index) => {
        doc.text(`${report.title}: ${report.description}`, 20, 40 + index * 20);
      });
    }
    doc.save('enterprise-reports.pdf');
  };

  const handleExport = () => {
    const doc = new jsPDF();
    handleExportPDF(doc);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporting</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Business intelligence and comprehensive reporting</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option>All Reports</option>
            <option>Sales</option>
            <option>User</option>
            <option>Performance</option>
            <option>Financial</option>
          </select>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <Suspense fallback={<ReportingLoading />}>
        {isLoading ? (
          <ReportingLoading />
        ) : (
          <EnterpriseReporting reports={reports || []} onExport={handleExport} />
        )}
      </Suspense>
    </div>
  );
};

const ReportingLoading = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);

export default function ReportingPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading reports...</div>}>
      <ReportingContent />
    </Suspense>
  );
}
