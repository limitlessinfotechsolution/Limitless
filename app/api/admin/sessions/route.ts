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

export async function GET(request: NextRequest) {
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

    // Check if user has permission to view sessions (admin or super_admin)
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch active sessions
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('admin_sessions')
      .select(`
        id,
        user_id,
        device_fingerprint,
        ip_address,
        user_agent,
        geo_location,
        created_at,
        expires_at,
        last_activity,
        is_active,
        profiles:user_id (
          email,
          role
        )
      `)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Log the action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'view',
      resource_type: 'sessions',
      resource_id: null,
      details: { action: 'list_active_sessions' },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'info',
      success: true,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Sessions list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
