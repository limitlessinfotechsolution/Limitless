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

// GET: Fetch tags for a specific testimonial
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('testimonial_tag_assignments')
      .select(`
        testimonial_tags(name, color)
      `)
      .eq('testimonial_id', id);

    if (error) throw error;

    // Extract tag names and colors from the joined data
    const tags = data.map(item => item.testimonial_tags);

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching testimonial tags:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tags';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Assign tags to a testimonial
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id: testimonialId } = params;
    
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
    
    const { tagIds } = await request.json();
    
    // First, remove all existing tag assignments for this testimonial
    const { error: deleteError } = await supabase
      .from('testimonial_tag_assignments')
      .delete()
      .eq('testimonial_id', testimonialId);
      
    if (deleteError) throw deleteError;
    
    // Then, insert new tag assignments
    if (tagIds && tagIds.length > 0) {
      const assignments = tagIds.map((tagId: string) => ({
        testimonial_id: testimonialId,
        tag_id: tagId
      }));
      
      const { error: insertError } = await supabase
        .from('testimonial_tag_assignments')
        .insert(assignments);
        
      if (insertError) throw insertError;
    }

    return NextResponse.json({ message: 'Tags assigned successfully' });
  } catch (error) {
    console.error('Error assigning tags:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign tags';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}