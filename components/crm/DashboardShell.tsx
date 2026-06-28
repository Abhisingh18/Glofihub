'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, LogOut, GraduationCap, type LucideIcon,
  LayoutDashboard, Users, UserCog, CreditCard, Network, BarChart3, Settings,
  MessagesSquare, UserCircle,
} from 'lucide-react';
import { signOut } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/database.types';
import { NotificationBell } from '@/components/crm/NotificationBell';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: 'Administrator',
  counsellor: 'Counsellor',
  student: 'Student',
};

// Defined in the client component so icon functions never cross the server→client boundary.
const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  super_admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/counsellors', label: 'Counsellors', icon: UserCog },
    { href: '/admin/assignments', label: 'Assignments', icon: Network },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  counsellor: [
    { href: '/counsellor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/counsellor/students', label: 'My Students', icon: Users },
    { href: '/counsellor/messages', label: 'Messages', icon: MessagesSquare },
  ],
  student: [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/chat', label: 'Chat', icon: MessagesSquare },
    { href: '/student/payments', label: 'Payments', icon: CreditCard },
    { href: '/student/profile', label: 'Profile', icon: UserCircle },
  ],
};

interface Props {
  user: { id: string; full_name: string; email: string; role: UserRole; profile_image?: string | null };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: Props) {
  const nav = NAV_BY_ROLE[user.role] ?? [];
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const initials = user.full_name?.trim()?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || '?';

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-foreground/10">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/25">
          <GraduationCap size={18} />
        </span>
        <div className="leading-tight">
          <p className="font-display font-bold text-foreground text-sm">GlofiHub</p>
          <p className="text-[10px] font-semibold text-foreground/45 tracking-wide">{ROLE_LABEL[user.role]}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-foreground/65 hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-foreground/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user.full_name || 'User'}</p>
            <p className="text-[11px] text-foreground/50 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-card border-r border-foreground/10 z-30">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-card border-r border-foreground/10 animate-in slide-in-from-left duration-200">
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur-md border-b border-foreground/10 flex items-center justify-between px-4 sm:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted cursor-pointer" aria-label="Menu">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <NotificationBell userId={user.id} />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* close icon helper for a11y on mobile (hidden visually) */}
      <span className="sr-only"><X size={0} /></span>
    </div>
  );
}
