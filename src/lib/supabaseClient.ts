import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
}) : null

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
