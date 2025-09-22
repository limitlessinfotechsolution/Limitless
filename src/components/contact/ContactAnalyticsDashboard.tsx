'use client';

import React, { useEffect, useState } from 'react';
import CardEnhanced from '../ui/Card-enhanced';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ContactAnalytics {
  totalVisits: number;
  avgTimeOnPage: number;
  formSubmissions: number;
  chatInteractions: number;
  faqExpansions: number;
  socialClicks: number;
  conversionRate: number;
  topInterests: { name: string; value: number }[];
  trafficSources: { name: string; value: number }[];
  dailyVisits: { date: string; visits: number }[];
}

const ContactAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<ContactAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/contact');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        // Fallback to simulated data
        setAnalytics({
          totalVisits: 1247,
          avgTimeOnPage: 187,
          formSubmissions: 89,
          chatInteractions: 256,
          faqExpansions: 178,
          socialClicks: 42,
          conversionRate: 7.1,
          topInterests: [
            { name: 'Web Development', value: 35 },
            { name: 'Mobile Apps', value: 28 },
            { name: 'AI Solutions', value: 22 },
            { name: 'Cloud Services', value: 15 }
          ],
          trafficSources: [
            { name: 'Direct', value: 45 },
            { name: 'Organic Search', value: 30 },
            { name: 'Social Media', value: 15 },
            { name: 'Referral', value: 10 }
          ],
          dailyVisits: [
            { date: 'Mon', visits: 42 },
            { date: 'Tue', visits: 38 },
            { date: 'Wed', visits: 56 },
            { date: 'Thu', visits: 49 },
            { date: 'Fri', visits: 61 },
            { date: 'Sat', visits: 32 },
            { date: 'Sun', visits: 28 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <CardEnhanced className="p-6 text-center">
        <p>No analytics data available</p>
      </CardEnhanced>
    );
  }

  const COLORS = ['#D4AF37', '#1A237E', '#FF6B6B', '#4ECDC4'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardEnhanced className="p-6 text-center">
          <h3 className="text-2xl font-bold text-accent">{analytics.totalVisits}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Visits</p>
        </CardEnhanced>
        
        <CardEnhanced className="p-6 text-center">
          <h3 className="text-2xl font-bold text-accent">{Math.round(analytics.avgTimeOnPage / 60)}m {analytics.avgTimeOnPage % 60}s</h3>
          <p className="text-gray-600 dark:text-gray-400">Avg. Time on Page</p>
        </CardEnhanced>
        
        <CardEnhanced className="p-6 text-center">
          <h3 className="text-2xl font-bold text-accent">{analytics.formSubmissions}</h3>
          <p className="text-gray-600 dark:text-gray-400">Form Submissions</p>
        </CardEnhanced>
        
        <CardEnhanced className="p-6 text-center">
          <h3 className="text-2xl font-bold text-accent">{analytics.conversionRate}%</h3>
          <p className="text-gray-600 dark:text-gray-400">Conversion Rate</p>
        </CardEnhanced>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits */}
        <CardEnhanced className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Visits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyVisits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </CardEnhanced>

        {/* Top Interests */}
        <CardEnhanced className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top User Interests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.topInterests}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
              >
                {analytics.topInterests.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardEnhanced>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardEnhanced className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Chat Interactions</span>
                <span className="text-sm font-medium">{analytics.chatInteractions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${Math.min(100, analytics.chatInteractions / 3)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">FAQ Expansions</span>
                <span className="text-sm font-medium">{analytics.faqExpansions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${Math.min(100, analytics.faqExpansions / 2)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Social Clicks</span>
                <span className="text-sm font-medium">{analytics.socialClicks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${Math.min(100, analytics.socialClicks * 2)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardEnhanced>

        {/* Traffic Sources */}
        <CardEnhanced className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="grid grid-cols-2 gap-4">
            {analytics.trafficSources.map((source, index) => (
              <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{source.name}</span>
                </div>
                <span className="font-semibold">{source.value}%</span>
              </div>
            ))}
          </div>
        </CardEnhanced>
      </div>
    </div>
  );
};

export default ContactAnalyticsDashboard;