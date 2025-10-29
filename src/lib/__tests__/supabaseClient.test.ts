
import { createClient } from '@supabase/supabase-js';
import { supabase, createSupabaseClient } from '../supabaseClient';

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('supabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    // Properly clear env variables by deleting keys
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    mockCreateClient.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create Supabase client when environment variables are provided', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const mockSupabaseClient = {};
    mockCreateClient.mockReturnValue(mockSupabaseClient as any);

    // Access a property to trigger lazy initialization
    expect(supabase.from).toBeDefined();

    expect(mockCreateClient).toHaveBeenCalledWith('https://test.supabase.co', 'test-anon-key', {
      db: { schema: 'public' },
    });
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when both environment variables are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should reuse the same client instance on multiple accesses', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const mockSupabaseClient = {
      from: jest.fn(),
      auth: jest.fn(),
      storage: jest.fn(),
    };
    mockCreateClient.mockReturnValue(mockSupabaseClient as any);

    // Access multiple properties to trigger lazy initialization multiple times
    expect(supabase.from).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.storage).toBeDefined();

    // createClient should only be called once due to lazy initialization caching
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });
});
