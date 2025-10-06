import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EnterpriseAuralisAI } from '../../../../../src/lib/ai/enterpriseAuralisAI';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
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

    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    // Initialize Enterprise Auralis AI
    const ai = new EnterpriseAuralisAI();

    // Process the command
    const response = await ai.processEnterpriseCommand(command);

    // Log the AI interaction
    await supabase
      .from('ai_logs')
      .insert({
        user_id: user.id,
        command: command,
        response: response,
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Command API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
