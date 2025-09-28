import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const runtime = 'edge';

// Zod schema for page update
const updatePageSchema = z.object({
  page_name: z.string().min(1, 'Page name is required').optional(),
  content: z.string().optional(),
  is_published: z.boolean().optional(),
});

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

// GET: Fetch a specific page by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ page: data }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update a specific page by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updatePageSchema.parse(body);

    const updateData: Partial<{
      page_name: string;
      content: string;
      is_published: boolean;
      updated_at: string;
    }> = {};
    if (validated.page_name !== undefined) updateData.page_name = validated.page_name;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (validated.is_published !== undefined) updateData.is_published = validated.is_published;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ page: data }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map(issue => issue.message) }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to update page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a specific page by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseClient();
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
