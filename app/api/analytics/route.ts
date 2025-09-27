import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { page, timestamp, FCP, LCP, FID, CLS, TTFB, userAgent, url } = body;

    if (!page || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: page and timestamp' },
        { status: 400 }
      );
    }

    // Insert analytics data
    const { error } = await supabase
      .from('analytics')
      .insert({
        page,
        timestamp: new Date(timestamp).toISOString(),
        fcp: FCP || null,
        lcp: LCP || null,
        fid: FID || null,
        cls: CLS || null,
        ttfb: TTFB || null,
        user_agent: userAgent,
        url,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_id: null, // Will be set if user is logged in
      });

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save analytics data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const days = parseInt(searchParams.get('days') || '30');

    let query = supabase
      .from('analytics')
      .select('*')
      .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (page) {
      query = query.eq('page', page);
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('Analytics fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Aggregate metrics
    const aggregated = data.reduce((acc, item) => {
      const metrics = ['fcp', 'lcp', 'fid', 'cls', 'ttfb'];
      metrics.forEach(metric => {
        if (item[metric] !== null) {
          if (!acc[metric]) acc[metric] = [];
          acc[metric].push(item[metric]);
        }
      });
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate averages
    const averages = Object.entries(aggregated).reduce((acc, [key, values]) => {
      acc[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      data,
      summary: {
        totalEvents: data.length,
        averages,
        dateRange: {
          from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
