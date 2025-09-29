import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    }

    // Fetch all pages
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pages:', error);
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Unexpected error in pages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    // Auth check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { page_name, content, is_published } = body;

    // Basic validation
    const errors = [];
    if (!page_name || typeof page_name !== 'string' || page_name.trim() === '') {
      errors.push('Page name is required and must be a non-empty string');
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    // Create page
    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        page_name: page_name.trim(),
        content,
        is_published: is_published || false,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating page:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in pages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
