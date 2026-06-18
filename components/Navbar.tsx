'use client';

import { useState, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun, Phone, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { ThemeContext } from './ThemeProvider';

interface NavLink {
  label: string;
  href: string;
  /** Section id on the home page (null for standalone routes). */
  id: string | null;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/#home', id: 'home' },
  { label: 'Services', href: '/services', id: null },
  { label: 'Portfolio', href: '/#portfolio', id: 'portfolio' },
  { label: 'Achievements', href: '/#achievements', id: 'achievements' },
  { label: 'About', href: '/about', id: null },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const { isDark, setIsDark } = useContext(ThemeContext);
  const pathname = usePathname();

  // Sliding pill indicator
  const listRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  const toggleTheme = () => setIsDark(!isDark);

  // A link is active when its home-section is in view, or its route is current.
  const isLinkActive = (link: NavLink) =>
    link.id ? pathname === '/' && active === link.id : pathname.startsWith(link.href);

  const movePillTo = (el: HTMLElement | null) => {
    const container = listRef.current;
    if (!el || !container) return;
    const cr = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - cr.left, width: r.width, opacity: 1 });
  };

  const movePillToActive = () => {
    const idx = NAV_LINKS.findIndex(isLinkActive);
    if (idx >= 0 && linkRefs.current[idx]) movePillTo(linkRefs.current[idx]);
    else setPill((p) => ({ ...p, opacity: 0 }));
  };

  // Glass-shrink after a bit of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy — highlight the section currently in view (home page only)
  useEffect(() => {
    if (pathname !== '/') {
      setActive('');
      return;
    }
    const ids = NAV_LINKS.map((l) => l.id).filter((id): id is string => !!id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // Keep the pill aligned to the active link + on resize
  useEffect(() => {
    movePillToActive();
    const onResize = () => movePillToActive();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, scrolled, pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto flex items-center justify-between gap-3 transition-all duration-500 ease-out
          ${scrolled ? 'mt-2 max-w-5xl' : 'mt-3 sm:mt-4 max-w-6xl'}
          rounded-2xl border px-3 sm:px-4
          ${scrolled ? 'h-14' : 'h-[60px] sm:h-16'}
          border-foreground/10 bg-background/70 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(2,12,40,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
          relative`}
      >
        {/* Subtle premium gradient ring on top edge */}
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className={`relative rounded-xl overflow-hidden ring-1 ring-foreground/10 shadow-sm transition-all duration-300 group-hover:ring-primary/50 ${
              scrolled ? 'w-9 h-9' : 'w-10 h-10'
            }`}
          >
            <img src="/logo/logo.png" alt="GlofiHub Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              GlofiHub
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.24em] font-bold text-foreground/40 leading-none mt-1 hidden sm:block">
              Global Future Initiative
            </span>
          </div>
        </a>

        {/* Desktop links with sliding pill */}
        <div
          ref={listRef}
          onMouseLeave={movePillToActive}
          className="hidden lg:flex items-center gap-0.5 relative"
        >
          {/* Sliding pill background */}
          <span
            className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-gradient-to-r from-primary/12 to-accent/12 border border-primary/15 transition-all duration-300 ease-out"
            style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
          />
          {NAV_LINKS.map((link, i) => {
            const isActive = isLinkActive(link);
            return (
              <a
                key={link.href}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                onMouseEnter={(e) => movePillTo(e.currentTarget)}
                className={`relative z-10 px-3.5 py-2 text-[13px] font-semibold tracking-normal rounded-full transition-colors duration-200 ${
                  isActive ? 'text-primary dark:text-accent' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <span className="block transition-transform duration-500" style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              {isDark ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            </span>
          </button>

          {/* Primary CTA (desktop) */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openGetStarted'))}
            className="btn-shine hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 text-[13px] font-semibold tracking-normal shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <Sparkles size={14} />
            Get Started
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-xl text-foreground hover:bg-foreground/5 transition-colors active:scale-90"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: -1 }}
      />
      {/* Panel */}
      <div
        className={`pointer-events-auto lg:hidden mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-foreground/10 bg-background/90 backdrop-blur-xl shadow-2xl transition-[max-height,opacity] duration-400 ease-out ${
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="px-3 py-3 space-y-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm tracking-normal transition-all duration-300 ${
                isLinkActive(link)
                  ? 'bg-gradient-to-r from-primary/15 to-accent/10 text-primary dark:text-accent'
                  : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
              } ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
              style={{ transitionDelay: isOpen ? `${i * 45}ms` : '0ms' }}
            >
              {link.label}
              <ArrowRight size={14} className="text-foreground/30" />
            </a>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('openGetStarted'));
            }}
            className="btn-shine mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white px-5 py-3.5 text-sm font-semibold tracking-normal shadow-lg shadow-primary/25"
          >
            <Sparkles size={15} />
            Get Started
          </button>

          {/* Mobile contact quick row */}
          <div className="flex items-center justify-center gap-5 pt-3 mt-2 border-t border-foreground/10 text-foreground/60">
            <a href="tel:+919241168875" className="flex items-center gap-1.5 text-[11px] font-bold hover:text-primary transition-colors">
              <Phone size={13} /> Call
            </a>
            <a href="mailto:info@glofihub.com" className="flex items-center gap-1.5 text-[11px] font-bold hover:text-primary transition-colors">
              <Mail size={13} /> Email
            </a>
            <a href="https://wa.me/919241168875" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-[#25D366]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
