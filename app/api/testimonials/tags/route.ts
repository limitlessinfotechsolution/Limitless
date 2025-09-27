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

// GET: Fetch all tags
export async function GET() {
  try {
    // Return empty array as testimonial_tags table doesn't exist in current schema
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching tags:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tags';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new tag
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
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
    
    const { name, color } = await request.json();
    
    const { data, error } = await supabase
      .from('testimonial_tags')
      .insert([{ name, color: color || '#3b82f6' }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating tag:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create tag';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}