'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Loader2, LogIn, LogOut, Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { ThemeContext } from '@/components/ThemeProvider';
import { signOut } from '@/lib/actions/auth';
import { ROLE_HOME } from '@/lib/roles';
import { DIVISIONS, PRIMARY_DIVISIONS } from '@/lib/divisions';
import { SITES, type SiteLink, type SiteSlug } from '@/lib/sites';
import type { UserRole } from '@/lib/database.types';

/**
 * Navbar shared by the five GlofiHub business websites. Each site gets its own brand, links and
 * call to action from lib/sites.ts; only the counselling site shows Login / Logout.
 * A slim strip on top leads back to the group site and lets visitors hop between the businesses.
 */
export interface SiteSession {
  name: string;
  role: UserRole;
}

const RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const RING_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A2F6B]';

export function SiteNavbar({ slug, session }: { slug: SiteSlug; session: SiteSession | null }) {
  const cfg = SITES[slug];
  const division = DIVISIONS.find((d) => d.slug === slug);
  const BrandIcon = division?.icon;

  const pathname = usePathname();
  const router = useRouter();
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(`${slug}-home`);
  const [signingOut, setSigningOut] = useState(false);

  const dashboardHref = session ? ROLE_HOME[session.role] : null;
  const firstName = session?.name?.trim().split(' ')[0] || 'Account';
  const initial = (session?.name?.trim()[0] || '?').toUpperCase();

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Scroll-lock + Esc while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Scroll-spy over the home-page sections that have a nav link.
  useEffect(() => {
    if (pathname !== cfg.home) return;
    const sections = cfg.links
      .map((l) => (l.id ? document.getElementById(l.id) : null))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname, cfg]);

  const isActive = (l: SiteLink) => {
    if (l.id) return pathname === cfg.home && active === l.id;
    const path = l.href.split('#')[0];
    return pathname === path || (path !== cfg.home && pathname.startsWith(`${path}/`));
  };

  const logout = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setOpen(false);
      router.push(cfg.home);
      router.refresh();
    }
  };

  const openGetStarted = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('openGetStarted'));
  };

  const linkClass = (activeNow: boolean) =>
    `rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${RING} ${
      activeNow ? 'bg-primary/10 text-primary dark:text-accent' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
    }`;

  const primaryBtn = `btn-shine items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 ${RING}`;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Strip: this is one business of the GlofiHub group — back to the group + hop between businesses */}
      <div className="bg-[#0A2F6B] text-white text-[11px] sm:text-xs">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className={`inline-flex shrink-0 items-center gap-1.5 rounded font-semibold hover:underline ${RING_DARK}`}>
            <ArrowLeft size={12} aria-hidden /> GlofiHub
            <span className="hidden font-medium text-white/60 xl:inline">· A Gateway to Infinite Possibilities</span>
          </Link>
          <nav aria-label="GlofiHub businesses" className="hidden items-center gap-1 md:flex">
            {PRIMARY_DIVISIONS.map((d) => {
              const current = d.slug === slug;
              return (
                <Link
                  key={d.slug}
                  href={d.href}
                  aria-current={current ? 'page' : undefined}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${RING_DARK} ${
                    current ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:underline'
                  }`}
                >
                  {d.short}
                </Link>
              );
            })}
          </nav>
          <Link href="/#businesses" className={`rounded font-medium text-white/80 hover:text-white hover:underline md:hidden ${RING_DARK}`}>
            All businesses
          </Link>
        </div>
      </div>

      <div className="px-3 sm:px-4">
        <div className="relative mx-auto mt-2 flex h-14 max-w-7xl items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/80 px-3 shadow-[0_8px_30px_rgba(2,12,40,0.12)] backdrop-blur-xl sm:h-16 sm:px-4 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {/* Brand */}
          <Link
            href={cfg.home}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl ${RING}`}
            aria-label={`GlofiHub ${cfg.subtitle} — home`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md ${division?.iconBg ?? 'bg-primary'}`}>
              {BrandIcon ? <BrandIcon size={20} aria-hidden /> : null}
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight">GlofiHub</span>
              <span className="mt-1 hidden text-[8.5px] font-bold uppercase tracking-[0.2em] text-foreground/45 sm:block">{cfg.subtitle}</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label={`${cfg.subtitle} navigation`} className="hidden items-center gap-0.5 lg:flex">
            {cfg.links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l) ? 'true' : undefined} className={linkClass(isActive(l))}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: theme + account / call to action */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`rounded-xl p-2 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground ${RING}`}
            >
              {isDark ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            </button>

            {cfg.auth ? (
              session ? (
                <>
                  <Link
                    href={dashboardHref!}
                    className={`hidden items-center gap-2 rounded-full border border-foreground/10 bg-card py-1.5 pl-1.5 pr-3 text-[13px] font-semibold hover:border-primary/40 sm:inline-flex ${RING}`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-xs font-bold text-white">
                      {initial}
                    </span>
                    <span className="max-w-[7rem] truncate">{firstName}</span>
                    <LayoutDashboard size={14} aria-hidden className="text-foreground/50" />
                    <span className="sr-only">Open dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    disabled={signingOut}
                    className={`hidden items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-[13px] font-semibold text-rose-600 transition-colors hover:bg-rose-500/20 disabled:opacity-60 sm:inline-flex ${RING}`}
                  >
                    {signingOut ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <LogOut size={14} aria-hidden />} Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-foreground/80 hover:bg-foreground/5 sm:inline-flex ${RING}`}
                  >
                    <LogIn size={15} aria-hidden /> Login
                  </Link>
                  <button type="button" onClick={openGetStarted} className={`hidden sm:inline-flex ${primaryBtn}`}>
                    <Sparkles size={14} aria-hidden /> Get Started
                  </button>
                </>
              )
            ) : cfg.cta ? (
              <Link href={cfg.cta.href} className={`hidden md:inline-flex ${primaryBtn}`}>
                <Sparkles size={14} aria-hidden /> {cfg.cta.label}
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="site-mobile-menu"
              className={`rounded-xl p-2 text-foreground hover:bg-foreground/5 lg:hidden ${RING}`}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile panel */}
          <div
            id="site-mobile-menu"
            inert={!open}
            className={`absolute inset-x-0 top-full mt-2 overflow-y-auto rounded-2xl border border-foreground/10 bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none lg:hidden ${
              open ? 'max-h-[calc(100dvh-7.5rem)] opacity-100' : 'max-h-0 border-transparent opacity-0'
            }`}
          >
            <nav aria-label={`${cfg.subtitle} mobile navigation`} className="space-y-1 p-3">
              {cfg.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l) ? 'true' : undefined}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${RING} ${
                    isActive(l) ? 'bg-primary/10 text-primary dark:text-accent' : 'text-foreground/75 hover:bg-foreground/5'
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <div className="mt-2 space-y-2 border-t border-foreground/10 pt-3">
                {cfg.auth ? (
                  session ? (
                    <>
                      <Link
                        href={dashboardHref!}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-white ${RING}`}
                      >
                        <LayoutDashboard size={16} aria-hidden /> {firstName}&apos;s dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        disabled={signingOut}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-600 disabled:opacity-60 ${RING}`}
                      >
                        {signingOut ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <LogOut size={16} aria-hidden />} Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-center gap-2 rounded-xl border border-foreground/15 px-5 py-3 text-sm font-semibold ${RING}`}
                      >
                        <LogIn size={16} aria-hidden /> Login
                      </Link>
                      <button
                        type="button"
                        onClick={openGetStarted}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-white ${RING}`}
                      >
                        <Sparkles size={16} aria-hidden /> Get Started
                      </button>
                    </>
                  )
                ) : cfg.cta ? (
                  <Link
                    href={cfg.cta.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-white ${RING}`}
                  >
                    <Sparkles size={16} aria-hidden /> {cfg.cta.label}
                  </Link>
                ) : null}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
