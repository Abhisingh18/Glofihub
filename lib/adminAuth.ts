// Admin authentication.
// Uses Supabase Auth (secure, server-verified) when configured; otherwise
// falls back to a hardcoded demo credential gate (client-side only).

import { supabase, isSupabaseConfigured } from './supabase';

// Fallback demo credentials (used only when Supabase is NOT configured)
export const ADMIN_EMAIL = 'admin@glofihub.com';
export const ADMIN_PASSWORD = 'Glofihub@123';

const SESSION_KEY = 'glofihub_admin_session';

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }
  // Fallback
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') sessionStorage.setItem(SESSION_KEY, 'true');
    return { ok: true };
  }
  return { ok: false, error: 'Invalid email or password.' };
}

export async function adminIsAuthed(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  }
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export async function adminSignOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  if (typeof window !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
}
