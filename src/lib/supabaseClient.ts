import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Function to create client with validation
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided in .env.local');
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public',
    },
  });
}

// Lazy initialization of supabase client using Proxy
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(target, prop) {
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient();
    }
    const value = supabaseInstance[prop as keyof typeof supabaseInstance];
    if (typeof value === 'function') {
      return value.bind(supabaseInstance);
    }
    return value;
  },
});
