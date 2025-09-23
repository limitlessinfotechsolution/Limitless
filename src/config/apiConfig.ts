// API Configuration
export const API_CONFIG = {
  // Base URLs
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  // Endpoints
  endpoints: {
    testimonials: '/api/testimonials',
    testimonialsCategories: '/api/testimonials/categories',
    testimonialsTags: '/api/testimonials/tags',
    testimonialsAnalytics: '/api/testimonials/analytics',
    leads: '/api/leads',
    analytics: '/api/analytics',
    chat: '/api/chat',
    faq: '/api/faq',
    pages: '/api/pages',
    email: {
      send: '/api/email/send',
      inbound: '/api/email/inbound',
    },
  },

  // Request configuration
  request: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // Cache configuration
  cache: {
    defaultTtl: 300, // 5 minutes
    maxSize: 100, // maximum number of items in cache
  },
} as const;
