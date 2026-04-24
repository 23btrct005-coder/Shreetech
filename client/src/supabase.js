import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Secure initialization to prevent White Screen of Death on Vercel
let supabaseInstance;

if (supabaseUrl && supabaseUrl.startsWith('https://') && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
} else {
  console.error('CRITICAL: Supabase environment variables are missing or invalid.');
  // Create a dummy client that doesn't throw but warns on use
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
      signOut: async () => {}
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => ({ data: [], error: null })
        }),
        order: () => ({ data: [], error: null })
      }),
      insert: async () => ({ error: { message: 'Supabase not configured' } }),
      update: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
      delete: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) })
    })
  };
}

export const supabase = supabaseInstance;
