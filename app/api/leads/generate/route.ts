import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();

    // Validate required fields
    if (!leadData.message || !leadData.sessionId) {
      return NextResponse.json({ error: 'Message and session ID are required' }, { status: 400 });
    }

    // Generate lead using Supabase directly since AuralisBrain doesn't have generateLead method
    const { data: lead, error } = await supabase.from('leads').insert({
      message: leadData.message,
      session_id: leadData.sessionId,
      user_details: leadData.userDetails || {},
      status: 'new',
      created_at: new Date().toISOString()
    }).select().single();

    if (error) {
      throw new Error('Failed to create lead: ' + error.message);
    }

    // Track lead generation in analytics
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

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead created successfully. An agent will contact you soon.'
    });

  } catch (error) {
    console.error('Lead generation error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}