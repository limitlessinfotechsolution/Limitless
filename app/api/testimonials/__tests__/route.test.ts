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
              data: [
                {
                  id: 1,
                  name: 'John Doe',
                  company: 'Test Corp',
                  content: 'Great service!',
                  rating: 5,
                  approved: true,
                  created_at: '2024-01-01T00:00:00Z'
                }
              ],
              count: 1,
              error: null
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 2, name: 'Jane Smith' },
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'test-cookie' }))
  }))
}));

describe('/api/testimonials', () => {
  describe('GET', () => {
    it('should return testimonials with proper structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/testimonials?page=1&limit=10');

      const response = await GET(request);
      const data = await response.json();

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

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonialData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.name).toBe('Jane Smith'); // Mocked response
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '', // Empty name
        content: 'Test content'
      };

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

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

      const request = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Rating');
    });
  });
});
