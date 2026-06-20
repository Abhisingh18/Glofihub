import { requireRole } from '@/lib/auth';
import { DashboardShell, type NavItem } from '@/components/crm/DashboardShell';
import { LayoutDashboard, MessagesSquare, CreditCard, UserCircle } from 'lucide-react';

const NAV: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/chat', label: 'Chat', icon: MessagesSquare },
  { href: '/student/payments', label: 'Payments', icon: CreditCard },
  { href: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('student');
  return <DashboardShell user={user} nav={NAV}>{children}</DashboardShell>;
}
