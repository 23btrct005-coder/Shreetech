import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Secure initialization to prevent White Screen of Death on Vercel
let supabaseInstance;

const createMockThenable = (data = null, error = null) => ({
  then: (resolve) => resolve({ data, error }),
  catch: (reject) => reject(error),
  single: () => createMockThenable(data, error),
  eq: () => createMockThenable(data, error),
  neq: () => createMockThenable(data, error),
  order: () => createMockThenable(data, error),
  limit: () => createMockThenable(data, error),
  select: () => createMockThenable(data, error),
});

if (supabaseUrl && supabaseUrl.startsWith('https://') && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase environment variables are missing. Using mock client.');
  
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
      signOut: async () => {}
    },
    from: () => createMockThenable([], null)
  };
}

export const supabase = supabaseInstance;
