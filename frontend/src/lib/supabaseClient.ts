import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey: string | undefined =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigError =
  !supabaseUrl || !supabasePublishableKey
    ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Create frontend/.env.local (see frontend/.env.example).'
    : null

export const supabase: SupabaseClient | null = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabasePublishableKey)
