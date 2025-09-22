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

// GET: Fetch a specific testimonial by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
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
    console.error('Error fetching testimonial:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonial';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: Update a testimonial by ID
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;
    
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, created_at: __, ...cleanData } = updateData;
    
    // Add updated_at timestamp
    cleanData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(cleanData)
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
    console.error('Error updating testimonial:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update testimonial';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a testimonial by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const { id } = params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete testimonial';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}