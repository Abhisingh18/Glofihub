import { requireRole } from '@/lib/auth';
import { DashboardShell } from '@/components/crm/DashboardShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('super_admin');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
