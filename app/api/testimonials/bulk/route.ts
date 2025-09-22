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

// PATCH: Bulk update testimonials (publish/unpublish, feature/unfeature)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
    const { ids, action, value } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }
    
    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }
    
    if (value === undefined) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }
    
    const updateData: Record<string, boolean | string> = {};
    
    switch (action) {
      case 'publish':
        updateData.is_published = Boolean(value);
        break;
      case 'feature':
        updateData.is_featured = Boolean(value);
        break;
      case 'approve':
        updateData.approved = Boolean(value);
        break;
      case 'verify':
        updateData.verified = Boolean(value);
        if (value === true) {
          updateData.verified_at = new Date().toISOString();
          // Note: verification_method and verified_by would need to be provided separately
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .in('id', ids)
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Testimonials updated successfully', data });
  } catch (error) {
    console.error('Error updating testimonials:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update testimonials';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Bulk delete testimonials
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
    const { ids } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({ message: 'Testimonials deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonials:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete testimonials';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}