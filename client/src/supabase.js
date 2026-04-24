import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Supabase URL or Anon Key is missing. This will cause authentication and data fetching to fail.');
}

// Providing fallback empty strings prevents the app from crashing on boot
export const supabase = createClient(supabaseUrl, supabaseKey);
