import { NextRequest } from 'next/server';
import { GET, POST } from '../pages/route';
import { createServerClient } from '@supabase/ssr';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    url,
    method: options?.method || 'GET',
    json: jest.fn().mockResolvedValue(options?.body ? JSON.parse(options.body) : {}),
    ...options,
  })),
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock the createServerClient and cookies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

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

      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'admin-id' } } } }),
        },
        from: jest.fn()
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
              }),
            }),
          })
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: mockPages, error: null }),
            }),
          }),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://limitlessinfotech.com/api/pages');
      const response = await GET(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.pages).toEqual(mockPages);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };

      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'admin-id' } } } }),
        },
        from: jest.fn()
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
              }),
            }),
          })
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
            }),
          }),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await GET(request);
      const result = await response.json();

      expect(response.status).toBe(500);
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

      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'admin-id' } } } }),
        },
        from: jest.fn()
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
              }),
            }),
          })
          .mockReturnValueOnce({
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
              }),
            }),
          }),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(201);
      expect(result.id).toBe(1);
    });

    it('should handle missing page name', async () => {
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

      expect(response.status).toBe(400);
      expect(Array.isArray(result.error)).toBe(true);
      expect(result.error.length).toBeGreaterThan(0);
    });

    it('should handle database errors', async () => {
      const pageData = {
        page_name: 'Test Page',
        content: { title: 'Test' },
        is_published: true,
      };

      const mockError = { message: 'Insert failed' };
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'admin-id' } } } }),
        },
        from: jest.fn()
          .mockReturnValueOnce({
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
              }),
            }),
          })
          .mockReturnValueOnce({
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
              }),
            }),
          }),
      };

      (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify(pageData),
      });
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.error).toBe('Insert failed');
    });
  });
});
