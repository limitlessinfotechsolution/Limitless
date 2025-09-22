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

// GET: Fetch categories for a specific testimonial
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('testimonial_category_assignments')
      .select(`
        testimonial_categories(name, description)
      `)
      .eq('testimonial_id', id);

    if (error) throw error;

    // Extract category names from the joined data
    const categories = data.map(item => item.testimonial_categories);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching testimonial categories:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Assign categories to a testimonial
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
    
    const { categoryIds } = await request.json();
    
    // First, remove all existing category assignments for this testimonial
    const { error: deleteError } = await supabase
      .from('testimonial_category_assignments')
      .delete()
      .eq('testimonial_id', testimonialId);
      
    if (deleteError) throw deleteError;
    
    // Then, insert new category assignments
    if (categoryIds && categoryIds.length > 0) {
      const assignments = categoryIds.map((categoryId: string) => ({
        testimonial_id: testimonialId,
        category_id: categoryId
      }));
      
      const { error: insertError } = await supabase
        .from('testimonial_category_assignments')
        .insert(assignments);
        
      if (insertError) throw insertError;
    }

    return NextResponse.json({ message: 'Categories assigned successfully' });
  } catch (error) {
    console.error('Error assigning categories:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign categories';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}