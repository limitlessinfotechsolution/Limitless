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
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Mark the session as inactive
    const { error: updateError } = await supabaseAdmin
      .from('admin_sessions')
      .update({
        is_active: false,
        terminated_at: new Date().toISOString(),
        termination_reason: 'user_logout',
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (updateError) {
      console.error('Session update error:', updateError);
      // Continue with logout even if session update fails
    }

    // Log the logout action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'logout',
      resource_type: 'session',
      resource_id: null,
      details: { reason: 'user_initiated_logout' },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'info',
      success: true,
    });

    // Clear the httpOnly cookies
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set({
      name: 'admin_auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set({
      name: 'admin_refresh_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
