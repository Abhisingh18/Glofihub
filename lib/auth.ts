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
  const user = await one<AppUser>(
    `select id, full_name, email, role, phone, profile_image, created_at
     from users where id = $1`,
    [session.sub]
  );
  return user;
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(role: UserRole): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== role) redirect(ROLE_HOME[user.role]);
  return user;
}
