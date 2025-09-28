import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const runtime = 'edge';

// Zod schema for order update
const orderUpdateSchema = z.object({
  pageOrders: z.array(z.object({
    id: z.string(),
    display_order: z.number().min(0)
  }))
});

// Helper function to create a Supabase client with user session
const createSupabaseClient = async () => {
  try {
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
  } catch (error) {
    // Fallback for test environment or when cookies are not available
    if (process.env.NODE_ENV === 'test') {
      return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    throw error;
  }
};

// PUT: Update page display order (admin-only)
export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseClient();
  try {
    const body = await request.json();
    const validated = orderUpdateSchema.parse(body);

    // Update each page's display_order sequentially
    for (const order of validated.pageOrders) {
      const { error } = await supabase
        .from('pages')
        .update({ display_order: order.display_order })
        .eq('id', order.id);

      if (error) {
        throw new Error(`Failed to update page ${order.id}: ${error.message}`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map(issue => issue.message) }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to update page order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
