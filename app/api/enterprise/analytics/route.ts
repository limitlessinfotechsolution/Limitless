import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || (profile.role !== 'enterprise' && profile.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Fetch analytics data from various sources
    const { data: pageViews } = await supabase
      .from('analytics')
      .select('page, created_at')
      .gte('created_at', startDate.toISOString());

    // User and project counts available for future use

    // Calculate metrics
    const totalRevenue = 0; // Replace with actual revenue calculation
    const newCustomers = Math.floor(Math.random() * 100) + 50; // Mock for now
    const conversionRate = 4.2; // Mock
    const avgSessionTime = 5 * 60 + 23; // Mock in seconds

    // Generate chart data
    const chartData = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 1000) + 500,
        users: Math.floor(Math.random() * 50) + 20,
        sessions: Math.floor(Math.random() * 100) + 50
      };
    });

    // Traffic sources (mock data for now)
    const trafficSources = [
      { source: 'Direct', percentage: 45, value: '12,345', color: 'bg-blue-500' },
      { source: 'Social', percentage: 25, value: '6,789', color: 'bg-green-500' },
      { source: 'Search', percentage: 20, value: '5,432', color: 'bg-yellow-500' },
      { source: 'Referral', percentage: 10, value: '2,345', color: 'bg-purple-500' }
    ];

    // Top pages
    const pageViewCounts = pageViews?.reduce((acc, view) => {
      acc[view.page] = (acc[view.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const topPages = Object.entries(pageViewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({
        page,
        views: views.toString(),
        change: Math.floor(Math.random() * 20) - 10, // Mock change
        changeType: Math.random() > 0.5 ? 'positive' as const : 'negative' as const
      }));

    const analyticsData = {
      cards: [
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          change: 12.5,
          changeType: 'positive' as const,
          color: 'bg-blue-500',
          data: chartData.slice(-7).map(d => ({ name: d.date, value: d.revenue }))
        },
        {
          title: 'New Customers',
          value: newCustomers.toString(),
          change: 18.2,
          changeType: 'positive' as const,
          color: 'bg-green-500',
          data: chartData.slice(-7).map(d => ({ name: d.date, value: d.users }))
        },
        {
          title: 'Conversion Rate',
          value: `${conversionRate}%`,
          change: -1.2,
          changeType: 'negative' as const,
          color: 'bg-yellow-500',
          data: chartData.slice(-7).map(d => ({ name: d.date, value: Math.floor(d.revenue / 100) }))
        },
        {
          title: 'Avg. Session',
          value: `${Math.floor(avgSessionTime / 60)}m ${avgSessionTime % 60}s`,
          change: 2.1,
          changeType: 'positive' as const,
          color: 'bg-purple-500',
          data: chartData.slice(-7).map(d => ({ name: d.date, value: avgSessionTime + Math.floor(Math.random() * 60) - 30 }))
        }
      ],
      trafficSources,
      topPages,
      chartData
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Enterprise Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
