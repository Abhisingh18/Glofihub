import { requireRole } from '@/lib/auth';
import { DashboardShell, type NavItem } from '@/components/crm/DashboardShell';
import { LayoutDashboard, Users, UserCog, CreditCard, Network, BarChart3, Settings } from 'lucide-react';

const NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/counsellors', label: 'Counsellors', icon: UserCog },
  { href: '/admin/assignments', label: 'Assignments', icon: Network },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('super_admin');
  return <DashboardShell user={user} nav={NAV}>{children}</DashboardShell>;
}
