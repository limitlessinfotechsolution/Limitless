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

    // Fetch KPIs from database or use defaults
    const { data: kpis, error: kpiError } = await supabase
      .from('kpis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (kpiError && kpiError.code !== 'PGRST116') { // PGRST116 is "relation does not exist"
      console.error('KPI fetch error:', kpiError);
    }

    // If no KPIs in database, return default ones
    const defaultKPIs = [
      {
        id: '1',
        title: 'Total Revenue',
        value: '$12,450.00',
        change: 15.3,
        changeType: 'positive' as const,
        icon: 'DollarSign',
        description: 'Total revenue generated this month',
        target: '$15,000',
        progress: 83
      },
      {
        id: '2',
        title: 'Active Users',
        value: '1,234',
        change: 8.2,
        changeType: 'positive' as const,
        icon: 'Users',
        description: 'Number of active users',
        target: '1,500',
        progress: 82
      },
      {
        id: '3',
        title: 'Projects Completed',
        value: '89',
        change: 12.5,
        changeType: 'positive' as const,
        icon: 'TrendingUp',
        description: 'Projects completed this quarter',
        target: '100',
        progress: 89
      },
      {
        id: '4',
        title: 'Customer Satisfaction',
        value: '94%',
        change: 2.1,
        changeType: 'positive' as const,
        icon: 'Activity',
        description: 'Average customer satisfaction score',
        target: '95%',
        progress: 94
      }
    ];

    const kpiData = kpis && kpis.length > 0 ? kpis.map(kpi => ({
      ...kpi,
      changeType: kpi.change > 0 ? 'positive' : 'negative'
    })) : defaultKPIs;

    return NextResponse.json(kpiData);
  } catch (error) {
    console.error('Enterprise KPIs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
