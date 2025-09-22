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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    
    // Get query parameters for date range filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build date filter
    let dateFilter = supabase.from('testimonials').select('*');
    if (startDate) {
      dateFilter = dateFilter.gte('created_at', startDate);
    }
    if (endDate) {
      dateFilter = dateFilter.lte('created_at', endDate);
    }
    
    // Fetch all testimonials for analysis
    const { data: testimonials, error } = await dateFilter;
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Calculate analytics
    const totalTestimonials = testimonials.length;
    const approvedTestimonials = testimonials.filter(t => t.approved).length;
    const unapprovedTestimonials = totalTestimonials - approvedTestimonials;
    
    // Rating distribution
    const ratingDistribution = {
      5: testimonials.filter(t => t.rating === 5).length,
      4: testimonials.filter(t => t.rating === 4).length,
      3: testimonials.filter(t => t.rating === 3).length,
      2: testimonials.filter(t => t.rating === 2).length,
      1: testimonials.filter(t => t.rating === 1).length,
    };
    
    // Average rating
    const averageRating = totalTestimonials > 0 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / totalTestimonials
      : 0;
    
    // Testimonials by company (top 10)
    const companyCount: Record<string, number> = {};
    testimonials.forEach(t => {
      companyCount[t.company] = (companyCount[t.company] || 0) + 1;
    });
    
    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }));
    
    // Approval rate
    const approvalRate = totalTestimonials > 0 
      ? (approvedTestimonials / totalTestimonials) * 100 
      : 0;
    
    // Testimonials over time (grouped by month)
    const testimonialsOverTime: Record<string, number> = {};
    testimonials.forEach(t => {
      const date = new Date(t.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      testimonialsOverTime[monthYear] = (testimonialsOverTime[monthYear] || 0) + 1;
    });
    
    const sortedMonths = Object.keys(testimonialsOverTime).sort();
    const testimonialsTrend = sortedMonths.map(month => ({
      month,
      count: testimonialsOverTime[month]
    }));
    
    return NextResponse.json({
      totalTestimonials,
      approvedTestimonials,
      unapprovedTestimonials,
      ratingDistribution,
      averageRating: parseFloat(averageRating.toFixed(2)),
      topCompanies,
      approvalRate: parseFloat(approvalRate.toFixed(2)),
      testimonialsTrend
    });
  } catch (error) {
    console.error('Error fetching testimonial analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonial analytics';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}