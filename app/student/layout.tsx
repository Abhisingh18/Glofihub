import { requireRole } from '@/lib/auth';
import { DashboardShell } from '@/components/crm/DashboardShell';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('student');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
