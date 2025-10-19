import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Function to create client with validation
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided in .env.local');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public',
    },
  });
}

// Initialize supabase client immediately
export const supabase = createSupabaseClient();
