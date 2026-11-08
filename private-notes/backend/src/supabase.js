import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check your .env file.');
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };

// Used for signup / login / checking tokens.
export const supabase = createClient(url, anonKey, options);

// A client that acts *as the logged-in user*. Because we pass their JWT along,
// Supabase can work out auth.uid() and apply the RLS rules to every query.
export function clientForUser(accessToken) {
  return createClient(url, anonKey, {
    ...options,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
