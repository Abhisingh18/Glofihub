'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, LogOut, GraduationCap, type LucideIcon,
  LayoutDashboard, Users, UserCog, CreditCard, Network, BarChart3, Settings,
  MessagesSquare, UserCircle, Inbox,
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
    { href: '/admin/leads', label: 'Leads', icon: Inbox },
    { href: '/admin/counsellors', label: 'Staff', icon: UserCog },
    { href: '/admin/assignments', label: 'Assignments', icon: Network },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/analytics', label: 'Activity', icon: BarChart3 },
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
    // Back to where each kind of user signs in: the admin portal, the counselling site, or the shared login.
    router.push(user.role === 'super_admin' ? '/counselling/admin' : user.role === 'student' ? '/counselling' : '/login');
    router.refresh();
  };

  const initials = user.full_name?.trim()?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || '?';
  const firstName = user.full_name?.trim()?.split(' ')[0] || 'there';

  const SidebarInner = (
    <div className="flex flex-col h-full bg-card relative">
      {/* subtle top tint */}
      <div aria-hidden className="pointer-events-none absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/[0.06] to-transparent" />

      {/* Brand */}
      <div className="relative flex items-center gap-2.5 px-5 h-16 border-b border-foreground/10">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/25">
          <GraduationCap size={18} />
        </span>
        <div className="leading-tight">
          <p className="font-display font-bold text-foreground text-sm">GlofiHub</p>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full mt-0.5">
            {ROLE_LABEL[user.role]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-foreground/35">Menu</p>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                  : 'text-foreground/60 hover:bg-muted hover:text-foreground hover:translate-x-0.5'
              )}
            >
              {active && <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white/80" />}
              <span className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
                active ? 'bg-white/15' : 'bg-muted/60 group-hover:bg-background'
              )}>
                <Icon size={17} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="relative p-3 border-t border-foreground/10">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/50 border border-foreground/5">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-sm shrink-0 ring-2 ring-primary/15">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user.full_name || 'User'}</p>
            <p className="text-[11px] text-foreground/50 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 via-muted/20 to-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-foreground/10 z-30 shadow-sm">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-foreground/10 shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-card/70 backdrop-blur-xl border-b border-foreground/10 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted cursor-pointer" aria-label="Menu">
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-foreground leading-tight">Welcome back, {firstName} 👋</p>
              <p className="text-[11px] text-foreground/45 font-medium">{ROLE_LABEL[user.role]} · GlofiHub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userId={user.id} />
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-sm ring-2 ring-primary/15">
              {initials}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* close icon helper for a11y on mobile (hidden visually) */}
      <span className="sr-only"><X size={0} /></span>
    </div>
  );
}
