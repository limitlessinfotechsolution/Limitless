import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { GET, POST } from '../testimonials/route';
import { createMockSupabaseClient } from './supabaseMock';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock NextRequest and NextResponse from next/server
jest.mock('next/server', () => {
  class NextResponse {
    _data: any;
    status: number;
    constructor(data: any, options?: { status?: number }) {
      this._data = data;
      this.status = options?.status || 200;
    }
    async json() {
      return this._data;
    }
    static json(data: any, options?: { status?: number }) {
      return new NextResponse(data, options);
    }
  }

  class NextRequest {
    url: string;
    method: string;
    _body: string | undefined;
    constructor(url: string, options?: { method?: string; body?: string }) {
      this.url = url;
      this.method = options?.method || 'GET';
      this._body = options?.body;
    }
    async json() {
      if (this._body) {
        try {
          return JSON.parse(this._body);
        } catch (e) {
          return null;
        }
      }
      return {};
    }
  }
  return {
    NextRequest,
    NextResponse,
  };
});

// Mock next/headers cookies to resolve with a get method mock for stability
jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({
      get: jest.fn(),
    })
  ),
}));

describe('/api/testimonials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/testimonials', () => {
    it('should return testimonials successfully', async () => {
      const mockTestimonials = [
        { id: 1, name: 'John', company: 'XYZ', content: 'Great!', rating: 5 },
        { id: 2, name: 'Jane', company: 'ABC', content: 'Awesome!', rating: 4 },
      ];

      const mockSupabase = createMockSupabaseClient(mockTestimonials, 2);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials?page=1&limit=10');
      const response = await GET(request);
      const result = await response.json();

      expect(result.testimonials).toEqual(mockTestimonials);
      expect(result.page).toEqual(1);
      expect(result.totalPages).toEqual(1);
    });

    it('should handle errors properly', async () => {
      const mockError = { message: 'Database error' };

      const mockSupabase = createMockSupabaseClient(null, 0, mockError);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials');
      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe('Database error');
    });
  });

  describe('POST /api/testimonials', () => {
    it('should create testimonial successfully', async () => {
      const newTestimonial = {
        name: 'New User',
        company: 'Company',
        content: 'Fantastic service!',
        rating: 5,
      };

      const mockSupabase = createMockSupabaseClient([ { id: 1, ...newTestimonial } ], 1);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(newTestimonial),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(result.id).toBe(1);
    });

    it('should handle missing required fields', async () => {
      const invalidTestimonial = { name: '', company: '', content: '', rating: 0 };

      const mockSupabase = createMockSupabaseClient();

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(invalidTestimonial),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe('Name, company, and content are required');
    });

    it('should handle rating validation error', async () => {
      const invalidTestimonial = { name: 'Name', company: 'Company', content: 'some content', rating: 6 };

      const mockSupabase = createMockSupabaseClient();

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(invalidTestimonial),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe('Rating must be between 1 and 5');
    });

    it('should handle database insert errors gracefully', async () => {
      const newTestimonial = {
        name: 'User',
        company: 'Company',
        content: 'Good service',
        rating: 4,
      };

      const mockError = { message: 'Insert failed' };
      const mockSupabase = createMockSupabaseClient(null, 0, mockError);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(newTestimonial),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe('Insert failed');
    });
  });
});
