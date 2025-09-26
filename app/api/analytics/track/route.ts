import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { eventType, eventData } = await req.json();

    // Validate required fields
    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    // Handle specific event types
    switch (eventType) {
      case 'site_visit':
        // Note: The existing AuralisBrain doesn't have incrementSiteVisit method
        // We'll implement a simple counter in Supabase instead
        await supabase.from('analytics_counters').upsert({ 
          name: 'site_visits', 
          count: 1 
        }, { 
          onConflict: 'name' 
        }).then(async (result) => {
          if (!result.error) {
            // Increment the count
            await supabase.rpc('increment_counter', { counter_name: 'site_visits' });
          }
        });
        break;
      case 'client_interaction':
        // Note: The existing AuralisBrain doesn't have incrementClientCount method
        await supabase.from('analytics_counters').upsert({ 
          name: 'client_interactions', 
          count: 1 
        }, { 
          onConflict: 'name' 
        }).then(async (result) => {
          if (!result.error) {
            // Increment the count
            await supabase.rpc('increment_counter', { counter_name: 'client_interactions' });
          }
        });
        break;
      case 'lead_generation':
        // Note: The existing AuralisBrain doesn't have incrementClientCount method
        await supabase.from('analytics_counters').upsert({ 
          name: 'leads_count', 
          count: 1 
        }, { 
          onConflict: 'name' 
        }).then(async (result) => {
          if (!result.error) {
            // Increment the count
            await supabase.rpc('increment_counter', { counter_name: 'leads_count' });
          }
        });
        break;
      case 'chat_feedback':
        if (eventData.messageId && eventData.feedback && eventData.sessionId) {
          // Note: The existing AuralisBrain doesn't have saveFeedback method
          await supabase.from('chat_feedback').insert({
            message_id: eventData.messageId,
            feedback: eventData.feedback,
            session_id: eventData.sessionId,
            timestamp: new Date().toISOString()
          });
        }
        break;
      default:
        // Store generic analytics event
        await supabase.from('analytics_events').insert({
          event_type: eventType,
          event_data: eventData || {},
          timestamp: new Date().toISOString()
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}