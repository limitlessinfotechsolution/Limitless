import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

let cachedSupabase: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided in .env.local')
  }

  if (!cachedSupabase) {
    cachedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'public',
      },
    })
  }

  return cachedSupabase
}

// Removed eager export of supabase instance to prevent premature initialization
// Users should call getSupabaseClient() to get the singleton instance
