import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Load environment variables for JWT secret and token expiry
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRY = '1h'; // 1 hour expiry for access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

async function hashToken(token: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
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
    const { email, password, deviceFingerprint } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const clientIP = getClientIP(request);

    // Fetch user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, password_hash, role, two_factor_enabled, two_factor_method')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      // Log failed login attempt
      await supabaseAdmin.from('admin_login_logs').insert({
        email,
        success: false,
        failure_reason: 'invalid_credentials',
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        device_fingerprint: deviceFingerprint || null,
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const passwordValid = await verifyPassword(password, userData.password_hash);
    if (!passwordValid) {
      // Log failed login attempt
      await supabaseAdmin.from('admin_login_logs').insert({
        email,
        user_id: userData.id,
        success: false,
        failure_reason: 'invalid_credentials',
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        device_fingerprint: deviceFingerprint || null,
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check role for admin access
    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    }

    // If 2FA enabled, require 2FA verification step
    if (userData.two_factor_enabled) {
      // Log 2FA required login attempt
      await supabaseAdmin.from('admin_login_logs').insert({
        email,
        user_id: userData.id,
        success: false,
        failure_reason: '2fa_required',
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        device_fingerprint: deviceFingerprint || null,
        two_factor_method: userData.two_factor_method,
      });
      return NextResponse.json({ twoFactorRequired: true, method: userData.two_factor_method });
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

    // Log successful login
    await supabaseAdmin.from('admin_login_logs').insert({
      email,
      user_id: userData.id,
      success: true,
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent'),
      device_fingerprint: deviceFingerprint || null,
      session_id: sessionData.id,
      two_factor_success: true,
    });

    // Set httpOnly cookies for session and refresh tokens
    const response = NextResponse.json({ message: 'Login successful' });
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
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
