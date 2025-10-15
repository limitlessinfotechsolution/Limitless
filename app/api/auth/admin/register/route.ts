import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePassword } from '@/lib/passwordValidation';
import { requireSuperAdmin } from '@/lib/auth';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AdminRegistrationData {
  email: string;
  password: string;
  fullName: string;
  adminLevel: 'admin' | 'super_admin';
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require super admin authentication
    try {
      await requireSuperAdmin(request);
    } catch (authError) {
      return NextResponse.json(
        { error: authError instanceof Error ? authError.message : 'Authentication required' },
        { status: 401 }
      );
    }

    const { email, password, fullName, adminLevel, phone }: AdminRegistrationData = await request.json();

    // Validate required fields
    if (!email || !password || !fullName || !adminLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullName, adminLevel' },
        { status: 400 }
      );
    }

    // Validate admin level
    if (!['admin', 'super_admin'].includes(adminLevel)) {
      return NextResponse.json(
        { error: 'Invalid admin level. Must be "admin" or "super_admin"' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admins
      user_metadata: {
        full_name: fullName,
        role: adminLevel
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create profile entry
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: adminLevel,
        phone,
        is_active: true,
        is_verified: true, // Auto-verify admins
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Log the registration
    console.log(`New ${adminLevel} registered: ${profileData.id} - ${fullName} (${email})`);

    return NextResponse.json({
      message: `${adminLevel.charAt(0).toUpperCase() + adminLevel.slice(1)} account created successfully`,
      userId: profileData.id,
      email: profileData.email,
      role: profileData.role
    }, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin registration error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
