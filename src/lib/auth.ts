import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_jwt_secret';

export interface AuthenticatedUser {
  id: string;
  role: string;
  email: string;
}

/**
 * Verify admin authentication token and check super_admin role
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('admin_auth_token')?.value;

    if (!authToken) {
      throw new Error('No authentication token provided');
    }

    // Verify JWT token
    const decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };

    if (!decoded.userId || !decoded.role) {
      throw new Error('Invalid token payload');
    }

    // Check if user has super_admin role
    if (decoded.role !== 'super_admin') {
      throw new Error('Super admin privileges required');
    }

    // Verify user still exists and is active
    const { data: userData, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !userData) {
      throw new Error('User not found');
    }

    if (!userData.is_active) {
      throw new Error('User account is inactive');
    }

    if (userData.role !== 'super_admin') {
      throw new Error('Super admin privileges required');
    }

    return {
      id: userData.id,
      role: userData.role,
      email: userData.email
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid authentication token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Authentication token expired');
    }
    throw error;
  }
}

/**
 * Verify admin authentication token (admin or super_admin role)
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('admin_auth_token')?.value;

    if (!authToken) {
      throw new Error('No authentication token provided');
    }

    // Verify JWT token
    const decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; role: string };

    if (!decoded.userId || !decoded.role) {
      throw new Error('Invalid token payload');
    }

    // Check if user has admin or super_admin role
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      throw new Error('Admin privileges required');
    }

    // Verify user still exists and is active
    const { data: userData, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !userData) {
      throw new Error('User not found');
    }

    if (!userData.is_active) {
      throw new Error('User account is inactive');
    }

    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      throw new Error('Admin privileges required');
    }

    return {
      id: userData.id,
      role: userData.role,
      email: userData.email
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid authentication token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Authentication token expired');
    }
    throw error;
  }
}
