import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — SERVER ONLY. Bypasses RLS.
 * Never import this into a Client Component. Used for admin actions
 * (creating counsellors, recording verified payments, etc.).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
