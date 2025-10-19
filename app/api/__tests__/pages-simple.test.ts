import { GET } from '../pages/route';
import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: (global as any).NextRequest,
  NextResponse: (global as any).NextResponse,
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

describe('/api/pages GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pages successfully', async () => {
    const mockPages = [
      { id: 1, page_name: 'Home', is_published: true },
      { id: 2, page_name: 'About', is_published: true },
    ];

    const mockSupabase = {
      auth: {
        getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'admin-id' } } } })),
      },
      from: jest.fn()
        .mockImplementation((table) => {
          if (table === 'profiles') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn(() => Promise.resolve({ data: { role: 'admin' }, error: null })),
            };
          } else if (table === 'pages') {
            return {
              select: jest.fn().mockReturnThis(),
              order: jest.fn(() => Promise.resolve({ data: mockPages, error: null })),
            };
          }
          return {};
        }),
    };

    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const mockRequest = new NextRequest('http://localhost:3000/api/pages');
    const response = await GET(mockRequest);
    const result = await response!.json();

    expect(response.status).toBe(200);
    expect(result.pages).toEqual(mockPages);
  });

  it('should handle database errors', async () => {
    const mockError = { message: 'Database connection failed' };

    const mockSupabase = {
      auth: {
        getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'admin-id' } } } })),
      },
      from: jest.fn()
        .mockImplementation((table) => {
          if (table === 'profiles') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn(() => Promise.resolve({ data: { role: 'admin' }, error: null })),
            };
          } else if (table === 'pages') {
            return {
              select: jest.fn().mockReturnThis(),
              order: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
            };
          }
          return {};
        }),
    };

    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const mockRequest = new NextRequest('http://localhost:3000/api/pages');
    const response = await GET(mockRequest);
    const result = await response!.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Failed to fetch pages');
  });
});
