import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AppUser, UserRole } from '@/lib/database.types';
import { ROLE_HOME } from '@/lib/roles';

export { ROLE_HOME };

/** Returns the signed-in user's profile, or null. */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (profile as AppUser) ?? null;
}

/** Require any signed-in user (redirects to /login otherwise). */
export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Require a specific role (redirects to the user's own home if mismatched). */
export async function requireRole(role: UserRole): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== role) redirect(ROLE_HOME[user.role]);
  return user;
}
