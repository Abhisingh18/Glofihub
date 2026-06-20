import { requireRole } from '@/lib/auth';
import { DashboardShell, type NavItem } from '@/components/crm/DashboardShell';
import { LayoutDashboard, Users, MessagesSquare } from 'lucide-react';

const NAV: NavItem[] = [
  { href: '/counsellor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/counsellor/students', label: 'My Students', icon: Users },
  { href: '/counsellor/messages', label: 'Messages', icon: MessagesSquare },
];

export default async function CounsellorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('counsellor');
  return <DashboardShell user={user} nav={NAV}>{children}</DashboardShell>;
}
