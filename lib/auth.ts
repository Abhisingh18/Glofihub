import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-cookie';
import { one } from '@/lib/pg';
import type { AppUser, UserRole } from '@/lib/database.types';
import { ROLE_HOME } from '@/lib/roles';

export { ROLE_HOME };

/** The signed-in user's full profile (no password_hash), or null. */
export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getSession();
  if (!session) return null;
  // A deactivated counsellor counts as signed out even while their cookie is still valid.
  const user = await one<AppUser>(
    `select u.id, u.full_name, u.email, u.role, u.phone, u.profile_image, u.created_at
     from users u
     where u.id = $1
       and not exists (select 1 from counsellors c where c.user_id = u.id and c.active = false)`,
    [session.sub]
  );
  return user;
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    // A cookie that no longer maps to an active user would bounce between /login and the
    // dashboard forever, so drop it first.
    redirect((await getSession()) ? '/api/auth/clear' : '/login');
  }
  return user;
}

export async function requireRole(role: UserRole): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== role) redirect(ROLE_HOME[user.role]);
  return user;
}
