import type { UserRole } from '@/lib/database.types';

/** Where each role lands after login. Client-safe (no server imports). */
export const ROLE_HOME: Record<UserRole, string> = {
  super_admin: '/admin/dashboard',
  counsellor: '/counsellor/dashboard',
  student: '/student/dashboard',
};
