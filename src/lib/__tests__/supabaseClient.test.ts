
describe('supabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create Supabase client when environment variables are provided', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    // Mock createClient to avoid actual client creation
    const mockCreateClient = jest.fn().mockReturnValue({});
    jest.doMock('@supabase/supabase-js', () => ({
      createClient: mockCreateClient,
    }));

    // Re-import the module to trigger the client creation
    const { supabase } = await import('../supabaseClient');

    // Access a property to trigger lazy initialization
    supabase.from;

    expect(supabase).toBeDefined();
    expect(mockCreateClient).toHaveBeenCalledWith('https://test.supabase.co', 'test-anon-key', {
      db: { schema: 'public' },
    });
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const { createSupabaseClient } = await import('../supabaseClient');

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { createSupabaseClient } = await import('../supabaseClient');

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });

  it('should throw error when both environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { createSupabaseClient } = await import('../supabaseClient');

    expect(() => {
      createSupabaseClient();
    }).toThrow('Supabase URL and Anon Key must be provided in .env.local');
  });
});
