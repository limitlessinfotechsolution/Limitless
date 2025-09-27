import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '../../../src/lib/logger';

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Get filter parameters
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');
    const service = searchParams.get('service');
    const rating = searchParams.get('rating');
    
    // Build the base query
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    // Apply industry filter if provided
    if (industry && industry !== 'all') {
      // Note: Industry field doesn't exist in current schema, would need to be added
    }
    
    // Apply service filter if provided
    if (service && service !== 'all') {
      // Note: Service field doesn't exist in current schema, would need to be added
    }
    
    // Apply rating filter if provided
    if (rating && rating !== 'all') {
      query = query.eq('rating', parseInt(rating));
    }
    
    // Note: Category and tag filters disabled as tables don't exist in current schema
    
    // Apply pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Return testimonials as is (categories and tags not implemented in current schema)
    const testimonials = data;
    
    return NextResponse.json({
      testimonials,
      count,
      page,
      totalPages: Math.ceil(count! / limit)
    });
  } catch (error) {
    logger.error('Error fetching testimonials', { error });
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonials';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
    const testimonialData = await request.json();
    
    // Validate required fields
    if (!testimonialData.name || !testimonialData.company || !testimonialData.content) {
      return NextResponse.json(
        { error: 'Name, company, and content are required' },
        { status: 400 }
      );
    }
    
    // Validate rating
    if (testimonialData.rating < 1 || testimonialData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Set default values
    const newTestimonial = {
      ...testimonialData,
      approved: false, // Testimonials need approval by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([newTestimonial])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error creating testimonial', { error });
    const errorMessage = error instanceof Error ? error.message : 'Failed to create testimonial';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}