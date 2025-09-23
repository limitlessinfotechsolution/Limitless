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
    const categoryId = searchParams.get('category');
    const tagId = searchParams.get('tag');
    
    // Build the base query
    let query = supabase
      .from('testimonials')
      .select(`
        *,
        testimonial_category_assignments(
          testimonial_categories(name, description)
        ),
        testimonial_tag_assignments(
          testimonial_tags(name, color)
        )
      `)
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
    
    // Apply category filter if provided
    if (categoryId && categoryId !== 'all') {
      // First get testimonial IDs that belong to this category
      const { data: categoryAssignments, error: categoryError } = await supabase
        .from('testimonial_category_assignments')
        .select('testimonial_id')
        .eq('category_id', categoryId);
      
      if (categoryError) throw categoryError;
      
      const testimonialIds = categoryAssignments.map((assignment: { testimonial_id: string }) => assignment.testimonial_id);
      query = query.in('id', testimonialIds);
    }
    
    // Apply tag filter if provided
    if (tagId && tagId !== 'all') {
      // First get testimonial IDs that have this tag
      const { data: tagAssignments, error: tagError } = await supabase
        .from('testimonial_tag_assignments')
        .select('testimonial_id')
        .eq('tag_id', tagId);
      
      if (tagError) throw tagError;
      
      const testimonialIds = tagAssignments.map((assignment: { testimonial_id: string }) => assignment.testimonial_id);
      query = query.in('id', testimonialIds);
    }
    
    // Apply pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Transform the data to include flattened categories and tags
    const testimonials = data.map((testimonial) => {
       
      const categories = testimonial.testimonial_category_assignments
        ? (testimonial.testimonial_category_assignments as Array<{ testimonial_categories: unknown }>)
          .map(assignment => assignment.testimonial_categories)
        : [];
      
       
      const tags = testimonial.testimonial_tag_assignments
        ? (testimonial.testimonial_tag_assignments as Array<{ testimonial_tags: unknown }>)
          .map(assignment => assignment.testimonial_tags)
        : [];
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { testimonial_category_assignments, testimonial_tag_assignments, ...rest } = testimonial;
      
      return {
        ...rest,
        categories,
        tags
      };
    });
    
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