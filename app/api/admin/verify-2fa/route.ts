import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import speakeasy from 'speakeasy';

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Load environment variables for JWT secret and token expiry
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRY = '1h'; // 1 hour expiry for access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

async function hashToken(token: string): Promise<string> {
  const saltRounds = 10;
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(token, salt);
}

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
    const body = await request.json();
    const { email, twoFactorCode, deviceFingerprint } = body;

    if (!email || !twoFactorCode) {
      return NextResponse.json({ error: 'Email and 2FA code are required' }, { status: 400 });
    }

    const clientIP = getClientIP(request);

    // Fetch user profile and 2FA secret
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, two_factor_enabled, two_factor_method, totp_secret')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    if (!userData.two_factor_enabled) {
      return NextResponse.json({ error: '2FA not enabled for user' }, { status: 400 });
    }

    let verified = false;

    if (userData.two_factor_method === 'totp') {
      // Verify TOTP code
      verified = speakeasy.totp.verify({
        secret: userData.totp_secret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1,
      });
    } else if (userData.two_factor_method === 'email') {
      // TODO: Implement email OTP verification logic
      // For now, reject
      return NextResponse.json({ error: 'Email OTP verification not implemented' }, { status: 501 });
    } else {
      return NextResponse.json({ error: 'Unsupported 2FA method' }, { status: 400 });
    }

    if (!verified) {
      // Log failed 2FA attempt
      await supabaseAdmin.from('admin_login_logs').insert({
        email,
        user_id: userData.id,
        success: false,
        failure_reason: 'invalid_2fa_code',
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        device_fingerprint: deviceFingerprint || null,
        two_factor_method: userData.two_factor_method,
        two_factor_success: false,
      });
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
    }

    // Generate JWT tokens
    const sessionToken = jwt.sign({ userId: userData.id, role: userData.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Hash tokens for storage
    const sessionTokenHash = await hashToken(sessionToken);
    const refreshTokenHash = await hashToken(refreshToken);

    // Store session in admin_sessions table
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    const { data: sessionData, error: sessionError } = await supabaseAdmin.from('admin_sessions').insert({
      user_id: userData.id,
      session_token_hash: sessionTokenHash,
      refresh_token_hash: refreshTokenHash,
      device_fingerprint: deviceFingerprint || null,
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      expires_at: expiresAt.toISOString(),
      last_activity: new Date().toISOString(),
      is_active: true,
    }).select('id').single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Log successful 2FA login
    await supabaseAdmin.from('admin_login_logs').insert({
      email,
      user_id: userData.id,
      success: true,
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      device_fingerprint: deviceFingerprint || null,
      session_id: sessionData.id,
      two_factor_method: userData.two_factor_method,
      two_factor_success: true,
    });

    // Set httpOnly cookies for session and refresh tokens
    const response = NextResponse.json({ message: '2FA verification successful' });
    response.cookies.set({
      name: 'admin_auth_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set({
      name: 'admin_refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
