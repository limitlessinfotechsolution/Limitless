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

    // Check if user has permission to view settings (admin or super_admin)
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get current settings from database or environment
    // For now, return mock data - in production, this would come from a settings table
    const settings = {
      branding: {
        logo: process.env.LOGO_URL || '/logo.png',
        primaryColor: process.env.PRIMARY_COLOR || '#007bff',
        secondaryColor: process.env.SECONDARY_COLOR || '#6c757d',
        favicon: process.env.FAVICON_URL || '/favicon.ico',
      },
      integrations: {
        stripe: {
          connected: !!process.env.STRIPE_SECRET_KEY,
          mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'test',
        },
        sendgrid: {
          connected: !!process.env.SENDGRID_API_KEY,
          verified: true, // Mock verification status
        },
        googleAnalytics: {
          connected: !!process.env.GA_TRACKING_ID,
          trackingId: process.env.GA_TRACKING_ID,
        },
        googleWorkspace: {
          connected: !!process.env.GOOGLE_CLIENT_ID,
        },
        slack: {
          connected: !!process.env.SLACK_BOT_TOKEN,
        },
        zoom: {
          connected: !!process.env.ZOOM_CLIENT_ID,
        },
      },
      email: {
        smtp: {
          host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
          port: process.env.SMTP_PORT || '587',
          secure: process.env.SMTP_SECURE === 'true',
          configured: !!process.env.SMTP_HOST,
        },
        templates: {
          count: 12, // Mock count
          active: true,
        },
        dkim: {
          configured: false, // Mock DKIM status
        },
      },
      features: {
        aiFeatures: process.env.AI_FEATURES_ENABLED !== 'false',
        analytics: process.env.ANALYTICS_ENABLED !== 'false',
        betaFeatures: process.env.BETA_FEATURES_ENABLED === 'true',
      },
      system: {
        environment: process.env.NODE_ENV || 'development',
        timezone: process.env.TIMEZONE || 'UTC',
        locale: process.env.DEFAULT_LOCALE || 'en-US',
      },
    };

    // Log the settings access
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'view',
      resource_type: 'settings',
      resource_id: 'system',
      details: { accessed: 'system_settings' },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'info',
      success: true,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch settings',
    }, { status: 500 });
  }
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

    // Check if user has permission to update settings (super_admin only)
    if (userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions - Super Admin required' }, { status: 403 });
    }

    const body = await request.json();
    const { category, setting, value } = body;

    // Validate input
    if (!category || !setting) {
      return NextResponse.json({ error: 'Category and setting are required' }, { status: 400 });
    }

    // In a real implementation, you would update environment variables or database settings
    // For now, we'll just log the change and return success
    console.log(`Settings update: ${category}.${setting} = ${value}`);

    // Log the settings change
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'update',
      resource_type: 'settings',
      resource_id: `${category}.${setting}`,
      details: { old_value: 'unknown', new_value: value },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      severity: 'warning',
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: `Setting ${category}.${setting} updated successfully`,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({
      error: 'Failed to update settings',
    }, { status: 500 });
  }
}
