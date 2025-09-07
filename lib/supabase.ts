import { createClient } from '@supabase/supabase-js';

// supabase client factory (srv/cli both) - env fallback for url/key (aka cfg)
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('supabase env vars missing'); // dbg: fail fast if miscfg
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false }, // svr-safe, no cookies (aka stateless)
  });
}


