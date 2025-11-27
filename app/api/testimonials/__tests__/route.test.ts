import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            range: jest.fn(() => ({
              data: null,
              count: 0,
              error: null
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }))
}));

import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            range: jest.fn(() => ({
              data: [],
              count: 0,
              error: null
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Mock cookies to simulate cookies() in route handler environment
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name: string) => {
      const cookiesMap: Record<string, { value: string } | undefined> = {
        'sb-access-token': { value: 'test-token' },
        'sb-refresh-token': { value: 'refresh-token' },
      };
      return cookiesMap[name];
    }),
  })),
}));

// Helper function to extract JSON from NextResponse
async function getJsonFromResponse(response: unknown) {
  if (!response) return null;
  const res = response as { json?: () => Promise<unknown>; _json?: unknown; text?: () => Promise<string> };
  if (typeof res.json === 'function') {
    return res.json();
  }
  if (res._json) {
    return Promise.resolve(res._json);
  }
  if (typeof res.text === 'function') {
    return res.text().then((text: string) => JSON.parse(text));
  }
  return Promise.resolve(null);
}

describe('/api/testimonials', () => {
  describe('GET', () => {
    it('should return testimonials with proper structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?page=1&limit=10');

      const response = await GET(request);
      const data = await getJsonFromResponse(response);

      expect(response?.status).toBe(200);
      expect(data).toHaveProperty('testimonials');
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('page');
      expect(data).toHaveProperty('totalPages');
      expect(Array.isArray(data.testimonials)).toBe(true);
    });

    it('should handle search parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?search=test');

      const response = await GET(request);

      expect(response?.status).toBe(200);
    });

    it('should handle rating filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?rating=5');

      const response = await GET(request);

      expect(response?.status).toBe(200);
    });
  });

  describe('POST', () => {
    it('should create a new testimonial', async () => {
      const testimonialData = {
        name: 'John Doe',
        company: 'Test Corp',
        content: 'Excellent service!',
        rating: 5,
      };

      const request = {
        url: 'http://localhost:3000/api/testimonials',
        method: 'POST',
        json: () => Promise.resolve(testimonialData),
        headers: {
          get: (name: string) =>
            name.toLowerCase() === 'content-type' ? 'application/json' : null,
          entries: () => [['content-type', 'application/json']],
        },
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response?.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.name).toBe('Jane Smith');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '',
        content: 'Test content',
      };

      const request = {
        url: 'http://localhost:3000/api/testimonials',
        method: 'POST',
        json: () => Promise.resolve(invalidData),
        headers: {
          get: (name: string) =>
            name.toLowerCase() === 'content-type' ? 'application/json' : null,
          entries: () => [['content-type', 'application/json']],
        },
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response?.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should validate rating range', async () => {
      const invalidData = {
        name: 'John Doe',
        company: 'Test Corp',
        content: 'Test content',
        rating: 6,
      };

      const request = {
        url: 'http://localhost:3000/api/testimonials',
        method: 'POST',
        json: () => Promise.resolve(invalidData),
        headers: {
          get: (name: string) =>
            name.toLowerCase() === 'content-type' ? 'application/json' : null,
          entries: () => [['content-type', 'application/json']],
        },
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response?.status).toBe(400);
      expect(data.error).toContain('Rating');
    });
  });
});

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'test-cookie' }))
  }))
}));



// Mock NextResponse.json to avoid errors in tests
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    __esModule: true,
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: jest.fn((body: unknown, init?: unknown) => {
        return {
          status: init?.status || 200,
          json: async () => body,
          _json: body,
          text: async () => JSON.stringify(body),
        };
      }),
    },
  };
});



describe('/api/testimonials', () => {
  describe('GET', () => {
    it('should return testimonials with proper structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?page=1&limit=10');

      const response = await GET(request);
      // Instead of response.json(), access body directly for NextResponse
      const data = await getJsonFromResponse(response);

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('testimonials');
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('page');
      expect(data).toHaveProperty('totalPages');
      expect(Array.isArray(data.testimonials)).toBe(true);
    });

    it('should handle search parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?search=test');

      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should handle rating filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?rating=5');

      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });

  describe('POST', () => {
    it('should create a new testimonial', async () => {
      const testimonialData = {
        name: 'John Doe',
        company: 'Test Corp',
        content: 'Excellent service!',
        rating: 5
      };

    const request = {
      url: 'http://localhost:3000/api/testimonials',
      method: 'POST',
      json: () => Promise.resolve(testimonialData),
      headers: {
        get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
        entries: () => [['content-type', 'application/json']],
      },
    } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.name).toBe('Jane Smith'); // Mocked response
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '', // Empty name
        content: 'Test content'
      };

    const request = {
      url: 'http://localhost:3000/api/testimonials',
      method: 'POST',
      json: () => Promise.resolve(invalidData),
      headers: {
        get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
        entries: () => [['content-type', 'application/json']],
      },
    } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should validate rating range', async () => {
      const invalidData = {
        name: 'John Doe',
        company: 'Test Corp',
        content: 'Test content',
        rating: 6 // Invalid rating
      };

    const request = {
      url: 'http://localhost:3000/api/testimonials',
      method: 'POST',
      json: () => Promise.resolve(invalidData),
      headers: {
        get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
        entries: () => [['content-type', 'application/json']],
      },
    } as unknown as NextRequest;

      const response = await POST(request);
      const data = await getJsonFromResponse(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Rating');
    });
  });
});
