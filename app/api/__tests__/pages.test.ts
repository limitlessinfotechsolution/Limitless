import { createServerClient } from '@supabase/ssr';
import { GET, POST } from '../pages/route';
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

// Mock next/headers cookies to resolve with a get method mock,
// chosen over the alternative throwing mock for test stability
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({
    get: jest.fn(),
  })),
}));

describe('/api/pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pages', () => {
    it('should return pages successfully', async () => {
      const mockPages = [
        { id: 1, page_name: 'Home', is_published: true },
        { id: 2, page_name: 'Service', is_published: true },
        { id: 3, page_name: 'Portfolio', is_published: true },
        { id: 4, page_name: 'Testimonials', is_published: true },
        { id: 5, page_name: 'About', is_published: true },
        { id: 6, page_name: 'Contact', is_published: true },
        { id: 7, page_name: 'Admin', is_published: true },
        { id: 8, page_name: 'Client-Portal', is_published: true },
        { id: 9, page_name: 'Team', is_published: true },
        { id: 10, page_name: 'Faq', is_published: true },
      ];

      const mockSupabase = createMockSupabaseClient(mockPages, 10);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://limitlessinfotech.com/api/pages');
      const response = await GET(request);
      const result = await response.json();

      expect(result.pages).toEqual(mockPages);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };

      const mockSupabase = createMockSupabaseClient(null, 0, mockError);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe('Failed to fetch pages');
    });
  });

  describe('POST /api/pages', () => {
    it('should create page successfully', async () => {
      const pageData = {
        page_name: 'New Page',
        content: 'New Page Content',
        is_published: false,
      };

      const mockSupabase = createMockSupabaseClient([ { id: 1, ...pageData } ], 1);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.id).toBe(1);
    });

    it('should handle missing page_name field in the request body', async () => {
      /**
       * This test ensures that the API validates the presence of the 'page_name' field.
       * It expects a 400 Bad Request response with an array of error messages about the missing field.
       */

      const mockSupabase = createMockSupabaseClient();

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      // Missing 'page_name' key in the post data
      const invalidData = {
        content: { title: 'Test' },
        is_published: true,
      };

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(Array.isArray(result.error)).toBe(true);
      expect(result.error.length).toBeGreaterThan(0);
    });

    it('should handle database insert errors gracefully', async () => {
      const pageData = {
        page_name: 'Test Page',
        content: { title: 'Test' },
        is_published: true,
      };

      const mockError = { message: 'Insert failed' };
      const mockSupabase = createMockSupabaseClient(null, 0, mockError);

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe('Insert failed');
    });
  });
});
