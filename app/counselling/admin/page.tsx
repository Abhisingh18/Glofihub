import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/counselling/AdminLoginForm';
import { getSession } from '@/lib/session-cookie';

// The admin portal's sign-in. It is deliberately not linked from the public site and kept out of search engines;
// only an account with the administrator role can get past it (see adminSignIn in lib/actions/auth.ts).
export const metadata: Metadata = {
  title: { absolute: 'Admin Portal — GlofiHub Counselling' },
  robots: { index: false, follow: false },
};

export default async function AdminPortalPage() {
  const session = await getSession();
  if (session?.role === 'super_admin') redirect('/admin/dashboard');
  return <AdminLoginForm signedInAs={session ? session.role : null} />;
}
