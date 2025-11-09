import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getEnhancedAnalytics } from '@/lib/analytics/enhancedAnalytics';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get analytics summary from database
    const { data, error } = await supabase
      .from('analytics_summary')
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }

    // Get recent events for additional context
    const { data: recentEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) {
      console.warn('Failed to fetch recent events:', eventsError);
    }

    // Get chatbot interactions
    const { data: chatInteractions, error: chatError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'chatbot_interaction')
      .order('created_at', { ascending: false })
      .limit(5);

    if (chatError) {
      console.warn('Failed to fetch chat interactions:', chatError);
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: data,
        recentEvents: recentEvents || [],
        chatInteractions: chatInteractions || []
      }
    });

  } catch (error) {
    console.error('Analytics data fetch error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    switch (action) {
      case 'increment_site_visits':
        const analytics = getEnhancedAnalytics();
        await analytics.trackSiteVisit();
        break;
        
      case 'increment_clients':
        const analytics2 = getEnhancedAnalytics();
        await analytics2.trackClientInteraction();
        break;
        
      case 'increment_leads':
        const analytics3 = getEnhancedAnalytics();
        await analytics3.trackLeadGeneration();
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics update error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}