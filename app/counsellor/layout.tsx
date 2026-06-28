import { requireRole } from '@/lib/auth';
import { DashboardShell } from '@/components/crm/DashboardShell';

export default async function CounsellorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('counsellor');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
