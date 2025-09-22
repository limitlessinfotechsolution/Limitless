import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to create a Supabase client with user session
const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

// POST: Verify a testimonial
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get verification data
    const { verificationMethod } = await request.json();
    
    // Update testimonial with verification info
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        verified: true,
        verification_method: verificationMethod,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying testimonial:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify testimonial';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}