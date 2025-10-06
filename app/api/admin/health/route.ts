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

    // Check if user has permission to view health data (admin or super_admin)
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get database health metrics
    const { error: dbError } = await supabaseAdmin
      .from('audit_logs')
      .select('id')
      .limit(1);

    // Get active sessions count
    const { count: activeSessions, error: sessionsError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get recent login attempts (last hour)
    const { count: recentLogins, error: loginsError } = await supabaseAdmin
      .from('admin_login_logs')
      .select('*', { count: 'exact', head: true })
      .gte('attempt_time', oneHourAgo.toISOString());

    // Get failed login attempts (last hour)
    const { count: failedLogins, error: failedError } = await supabaseAdmin
      .from('admin_login_logs')
      .select('*', { count: 'exact', head: true })
      .eq('success', false)
      .gte('attempt_time', oneHourAgo.toISOString());

    // Get system uptime (mock - in real implementation, get from process)
    const uptime = process.uptime();

    // Get memory usage
    const memUsage = process.memoryUsage();

    const healthData = {
      status: 'healthy',
      timestamp: now.toISOString(),
      database: {
        status: dbError ? 'error' : 'healthy',
        error: dbError?.message || null,
      },
      sessions: {
        active: activeSessions || 0,
        error: sessionsError?.message || null,
      },
      security: {
        recent_logins: recentLogins || 0,
        failed_logins: failedLogins || 0,
        error: loginsError?.message || failedError?.message || null,
      },
      system: {
        uptime_seconds: Math.floor(uptime),
        memory_usage_mb: {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heap_used: Math.round(memUsage.heapUsed / 1024 / 1024),
          heap_total: Math.round(memUsage.heapTotal / 1024 / 1024),
        },
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development',
      },
    };

    // Determine overall status
    if (dbError || sessionsError || loginsError || failedError) {
      healthData.status = 'degraded';
    }

    // Log the health check
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'view',
      resource_type: 'system',
      resource_id: 'health',
      details: { status: healthData.status },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'info',
      success: true,
    });

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, { status: 500 });
  }
}
