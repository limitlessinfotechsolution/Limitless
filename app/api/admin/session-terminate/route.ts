import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Load environment variables for JWT secret
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_jwt_secret';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('admin_auth_token')?.value;
    const clientIP = getClientIP(request);

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userRole = decoded.role;

    // Check if user has permission to terminate sessions (admin or super_admin)
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { sessionId, reason } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Fetch the session to terminate
    const { data: session, error: fetchError } = await supabaseAdmin
      .from('admin_sessions')
      .select('id, user_id, is_active')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.is_active) {
      return NextResponse.json({ error: 'Session is already terminated' }, { status: 400 });
    }

    // Terminate the session
    const { error: updateError } = await supabaseAdmin
      .from('admin_sessions')
      .update({
        is_active: false,
        terminated_at: new Date().toISOString(),
        terminated_by: userId,
        termination_reason: reason || 'admin_terminated',
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Session termination error:', updateError);
      return NextResponse.json({ error: 'Failed to terminate session' }, { status: 500 });
    }

    // Log the action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'terminate',
      resource_type: 'session',
      resource_id: sessionId,
      details: {
        terminated_user_id: session.user_id,
        reason: reason || 'admin_terminated'
      },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'warning',
      success: true,
    });

    return NextResponse.json({ message: 'Session terminated successfully' });
  } catch (error) {
    console.error('Session termination error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
