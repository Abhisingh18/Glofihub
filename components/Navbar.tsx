'use client';

import {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun, Phone, Mail, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { ThemeContext } from './ThemeProvider';
import { DIVISIONS, PRIMARY_DIVISIONS, type Division } from '@/lib/divisions';
import { SITE } from '@/lib/site';

/**
 * Navbar of the GlofiHub parent site (the five business websites have their own: components/site).
 *   xl (>=1280)  Home | the five websites inline | More ▾ (all nine businesses) | About | Contact | Get Started
 *   lg (>=1024)  Home | Ecosystem ▾ (the same menu)                             | About | Contact | Get Started
 *   < lg         hamburger panel with a "Businesses" accordion listing all nine (websites first)
 */
interface NavItem {
  key: string;
  label: string;
  href: string;
  soon?: boolean;
}

const HOME: NavItem = { key: 'home', label: 'Home', href: '/#home' };
const ABOUT: NavItem = { key: 'about', label: 'About', href: '/about' };
const CONTACT: NavItem = { key: 'contact', label: 'Contact', href: '/#contact' };

/** The five businesses that have a website of their own — inline links from xl. */
const SITE_ITEMS: NavItem[] = PRIMARY_DIVISIONS.map((d) => ({
  key: d.slug,
  label: d.short,
  href: d.href,
  soon: d.status === 'soon',
}));

/** The rest of the group: sections on the parent site and "launching soon" pages. */
const OTHER_DIVISIONS: Division[] = DIVISIONS.filter((d) => !d.primary);

/** Menu groups (desktop mega-menu + mobile accordion) — together they list every business, websites first. */
const MENU_GROUPS: { id: string; label: string; items: Division[] }[] = [
  { id: 'nav-group-sites', label: 'GlofiHub websites', items: PRIMARY_DIVISIONS },
  { id: 'nav-group-more', label: 'More from GlofiHub', items: OTHER_DIVISIONS },
];

/** Home-page section ids observed by the scroll-spy. Ones without a nav link just clear the highlight. */
const SPY_IDS = [
  'home',
  'businesses',
  'how-it-works',
  'services',
  'service-education',
  'service-skills',
  'service-jobs',
  'service-partnerships',
  'academy-courses',
  'faculty',
  'careers',
  'global',
  'consulting',
  'technology',
  'partner-network',
  'institutions',
  'why-glofihub',
  'portfolio',
  'reviews',
  'videos',
  'achievements',
  'contact',
];

const RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const RING_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/70';

/** Horizontal padding of the desktop nav items (2xl is tighter: that is where the "Soon" pills appear). */
const NAV_PAD = 'px-3 2xl:px-2.5';

const getLinks = (root: HTMLElement | null): HTMLElement[] =>
  root ? Array.from(root.querySelectorAll<HTMLElement>('a[href]')) : [];

const isHashHref = (href: string) => href.startsWith('/#');

const currentFor = (href: string, isActive: boolean) =>
  isActive ? (isHashHref(href) ? ('location' as const) : ('page' as const)) : undefined;

// xl breakpoint as an external store: only used to decide which businesses light up the menu trigger,
// so the server snapshot (false) costs nothing on hydration.
const XL_QUERY = '(min-width: 1280px)';
const subscribeXl = (onChange: () => void) => {
  const mq = window.matchMedia(XL_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const getXl = () => window.matchMedia(XL_QUERY).matches;
const getXlServer = () => false;

/** "Soon" marker for businesses that haven't launched. `compact` = dot until 2xl, pill from 2xl. */
function SoonBadge({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {compact ? (
        <>
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 2xl:hidden" />
          <span
            aria-hidden="true"
            className="hidden shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-amber-700 dark:text-amber-300 2xl:inline-block"
          >
            Soon
          </span>
        </>
      ) : (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-amber-700 dark:text-amber-300"
        >
          Soon
        </span>
      )}
      <span className="sr-only">(launching soon)</span>
    </>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile panel
  const [mobileBiz, setMobileBiz] = useState(false); // mobile "Businesses" accordion
  const [ecoOpen, setEcoOpen] = useState(false); // desktop mega-menu ("More" at xl, "Ecosystem" at lg)
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const { isDark, setIsDark } = useContext(ThemeContext);
  const pathname = usePathname();
  const isXl = useSyncExternalStore(subscribeXl, getXl, getXlServer);

  // Close every menu when the route changes (adjust-state-during-render pattern).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setIsOpen(false);
    setEcoOpen(false);
    setMobileBiz(false);
  }

  // Mega-menu plumbing
  const ecoWrapRef = useRef<HTMLDivElement | null>(null);
  const ecoBtnRef = useRef<HTMLButtonElement>(null);
  const ecoPanelRef = useRef<HTMLDivElement>(null);
  const ecoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 'hover' menus close when the pointer leaves; 'click' (pinned / keyboard / touch) menus don't. */
  const ecoMode = useRef<'hover' | 'click'>('hover');
  const focusFirstRef = useRef(false);

  // Mobile plumbing
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);

  const toggleTheme = () => setIsDark(!isDark);

  // Hash links follow the scroll-spy (home only); route links follow the pathname (subpaths count).
  const isHrefActive = (href: string) =>
    isHashHref(href)
      ? pathname === '/' && active === href.slice(2)
      : pathname === href || pathname.startsWith(`${href}/`);
  const isItemActive = (item: NavItem) => isHrefActive(item.href);

  // The menu trigger lights up for what it holds: the four "more" businesses and the #businesses section,
  // plus the five websites below xl (there they are only reachable through the menu).
  const menuActive =
    (pathname === '/' && active === 'businesses') ||
    OTHER_DIVISIONS.some((d) => isHrefActive(d.href)) ||
    (!isXl && PRIMARY_DIVISIONS.some((d) => isHrefActive(d.href)));
  const ecoLit = menuActive || ecoOpen;

  const closeMobile = () => setIsOpen(false);

  /* ── Mega-menu behaviour ─────────────────────────────────────────────── */
  const clearEcoTimer = useCallback(() => {
    if (ecoTimer.current) {
      clearTimeout(ecoTimer.current);
      ecoTimer.current = null;
    }
  }, []);

  const closeEco = useCallback(
    (returnFocus = false) => {
      clearEcoTimer();
      ecoMode.current = 'hover';
      setEcoOpen(false);
      if (returnFocus) ecoBtnRef.current?.focus();
    },
    [clearEcoTimer]
  );

  // Hover intent — mouse only, so touch taps on tablets use the click path instead.
  const onEcoPointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    clearEcoTimer();
    if (ecoOpen) return;
    ecoTimer.current = setTimeout(() => {
      ecoMode.current = 'hover';
      setEcoOpen(true);
    }, 90);
  };

  const onEcoPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    clearEcoTimer();
    if (ecoMode.current !== 'hover') return;
    ecoTimer.current = setTimeout(() => setEcoOpen(false), 160);
  };

  const onEcoButtonClick = () => {
    clearEcoTimer();
    if (!ecoOpen) {
      ecoMode.current = 'click';
      setEcoOpen(true);
    } else if (ecoMode.current === 'hover') {
      ecoMode.current = 'click'; // clicking a hover-opened menu pins it open
    } else {
      closeEco();
    }
  };

  const onEcoButtonKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    clearEcoTimer();
    ecoMode.current = 'click';
    if (ecoOpen) getLinks(ecoPanelRef.current)[0]?.focus();
    else {
      focusFirstRef.current = true;
      setEcoOpen(true);
    }
  };

  // Up / Down / Home / End walk the links in DOM order (websites column, then the rest, then the footer link);
  // Left / Right hop between the two columns, keeping the row where possible.
  const onEcoPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = getLinks(ecoPanelRef.current);
    if (items.length === 0) return;
    const current = document.activeElement as HTMLElement | null;
    const i = current ? items.indexOf(current) : -1;
    let next = -1;
    if (e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowUp') next = i <= 0 ? items.length - 1 : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && current?.dataset.ecoCol !== undefined) {
      const col = Number(current.dataset.ecoCol);
      const inCol = (c: number) => items.filter((el) => el.dataset.ecoCol === String(c));
      const target = inCol(e.key === 'ArrowRight' ? col + 1 : col - 1);
      if (target.length > 0) {
        e.preventDefault();
        target[Math.min(inCol(col).indexOf(current), target.length - 1)]?.focus();
      }
      return;
    }
    if (next >= 0) {
      e.preventDefault();
      items[next]?.focus();
    }
  };

  // Close when keyboard focus tabs out of the menu.
  const onEcoBlur = (e: ReactFocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !e.currentTarget.contains(next)) closeEco();
  };

  // Logo: smooth-scroll to top when already on the home page, otherwise route to "/".
  const onLogoClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    closeEco();
    if (pathname === '/' && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Move focus into the panel after a keyboard open (ArrowDown on the toggle).
  useEffect(() => {
    if (ecoOpen && focusFirstRef.current) {
      focusFirstRef.current = false;
      getLinks(ecoPanelRef.current)[0]?.focus();
    }
  }, [ecoOpen]);

  // Outside click / tap closes the mega-menu.
  useEffect(() => {
    if (!ecoOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!ecoWrapRef.current?.contains(e.target as Node)) closeEco();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [ecoOpen, closeEco]);

  // Esc closes whichever menu is open and returns focus to its trigger.
  useEffect(() => {
    if (!ecoOpen && !isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const activeEl = document.activeElement;
      if (ecoOpen) {
        closeEco(ecoWrapRef.current?.contains(activeEl) ?? false);
      }
      if (isOpen) {
        const inside =
          activeEl === menuToggleRef.current || (mobilePanelRef.current?.contains(activeEl) ?? false);
        if (inside) menuToggleRef.current?.focus();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ecoOpen, isOpen, closeEco]);

  // Don't leave a pending hover timer behind on unmount.
  useEffect(() => clearEcoTimer, [clearEcoTimer]);

  // Crossing lg swaps the desktop nav and the hamburger panel — reset so nothing stays locked / stuck open.
  // (The mega-menu is the same element at lg and xl, so crossing xl needs no reset.)
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (lg.matches) setIsOpen(false);
      else closeEco();
    };
    lg.addEventListener('change', onChange);
    return () => lg.removeEventListener('change', onChange);
  }, [closeEco]);

  // Glass-shrink after a bit of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy — highlight the section currently in view (home page only)
  useEffect(() => {
    if (pathname !== '/') {
      setActive('');
      return;
    }
    const sections = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const inView = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) inView.add(en.target as HTMLElement);
          else inView.delete(en.target as HTMLElement);
        });
        // Several nested sections can cross the line — the one latest in the DOM is the most specific.
        let best: HTMLElement | undefined;
        for (const el of Array.from(inView)) {
          if (!best || best.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) best = el;
        }
        if (best) setActive(best.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // Lock body scroll while the mobile menu is open (restore only what we changed)
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const desktopItemClass = (isActive: boolean) =>
    `relative flex items-center gap-1.5 whitespace-nowrap rounded-lg ${NAV_PAD} py-2 text-[12.5px] font-semibold tracking-normal transition-colors duration-200 ${RING} ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent'
        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
    }`;

  const ariaCurrent = (item: NavItem, isActive: boolean) => currentFor(item.href, isActive);

  const groupLabelClass =
    'px-3 pb-1.5 pt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45';

  /** One business in the desktop mega-menu: icon tile, name, tagline, "Soon" badge. `col` drives Left/Right. */
  const renderMenuItem = (d: Division, col: number) => {
    const Icon = d.icon;
    const isActive = isHrefActive(d.href);
    return (
      <li key={d.slug}>
        <Link
          href={d.href}
          data-eco-col={col}
          onClick={() => closeEco()}
          aria-current={currentFor(d.href, isActive)}
          className={`group flex items-center gap-3 rounded-xl p-2.5 transition-colors duration-200 hover:bg-foreground/5 ${RING_INSET} ${
            isActive ? 'bg-primary/8' : ''
          }`}
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-all duration-300 group-hover:scale-105 motion-reduce:transition-none ${d.iconBg} ${d.glow}`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate font-display text-sm font-bold tracking-tight text-foreground">
                {d.short}
              </span>
              {d.status === 'soon' && <SoonBadge />}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-foreground/60">{d.tagline}</span>
          </span>
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="shrink-0 -translate-x-1 text-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
        </Link>
      </li>
    );
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto flex items-center justify-between gap-3 transition-all duration-500 ease-out
          ${scrolled ? 'mt-2 max-w-7xl' : 'mt-3 sm:mt-4 max-w-[88rem]'}
          rounded-2xl border px-3 sm:px-4
          ${scrolled ? 'h-14' : 'h-[60px] sm:h-16'}
          border-foreground/10 bg-background/70 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(2,12,40,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
          relative`}
      >
        {/* Subtle premium gradient ring on top edge */}
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Logo */}
        <Link
          href="/"
          onClick={onLogoClick}
          aria-label={`${SITE.name} home`}
          className={`flex items-center gap-2.5 group shrink-0 rounded-xl ${RING}`}
        >
          <div
            className={`relative rounded-xl overflow-hidden ring-1 ring-foreground/10 shadow-sm transition-all duration-300 group-hover:ring-primary/50 ${
              scrolled ? 'w-9 h-9' : 'w-10 h-10'
            }`}
          >
            <img
              src="/logo/logo.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {SITE.name}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.24em] font-bold text-foreground/40 leading-none mt-1 hidden sm:block xl:hidden 2xl:block">
              Global Future Initiative
            </span>
          </div>
        </Link>

        {/* Desktop navigation (lg and up) — one row; the five websites only appear from xl */}
        <nav aria-label="Primary" className="relative hidden min-w-0 self-stretch lg:flex">
          <div className="flex items-center gap-0.5">
            <Link
              href={HOME.href}
              aria-current={ariaCurrent(HOME, isItemActive(HOME))}
              className={desktopItemClass(isItemActive(HOME))}
            >
              {HOME.label}
            </Link>

            {/* xl and up — the five businesses that have their own website */}
            <div className="hidden items-center gap-0.5 xl:flex">
              {SITE_ITEMS.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={ariaCurrent(item, isActive)}
                    className={desktopItemClass(isActive)}
                  >
                    {item.label}
                    {item.soon && <SoonBadge compact />}
                  </Link>
                );
              })}
            </div>

            {/* "More ▾" at xl / "Ecosystem ▾" at lg — the same mega-menu listing all nine businesses */}
            <div
              ref={ecoWrapRef}
              onPointerEnter={onEcoPointerEnter}
              onPointerLeave={onEcoPointerLeave}
              onBlur={onEcoBlur}
              className="relative flex items-center self-stretch"
            >
              <button
                ref={ecoBtnRef}
                type="button"
                onClick={onEcoButtonClick}
                onKeyDown={onEcoButtonKeyDown}
                aria-haspopup="true"
                aria-expanded={ecoOpen}
                aria-controls="ecosystem-menu"
                className={`${desktopItemClass(ecoLit)} cursor-pointer`}
              >
                <span className="xl:hidden">Ecosystem</span>
                <span className="hidden xl:inline">More</span>
                <span className="sr-only">(all GlofiHub businesses)</span>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                    ecoOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Mega-menu — centred under the trigger, capped to the viewport width */}
              <div
                id="ecosystem-menu"
                ref={ecoPanelRef}
                role="group"
                aria-label="GlofiHub businesses"
                inert={!ecoOpen}
                onKeyDown={onEcoPanelKeyDown}
                className={`absolute left-1/2 top-full z-20 -translate-x-1/2 w-[min(44rem,calc(100vw-2rem))] origin-top pt-2.5 transition-[opacity,transform,translate,scale] duration-200 ease-out motion-reduce:transition-none ${
                  ecoOpen
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-y-2 scale-[0.98] opacity-0'
                }`}
              >
                <div className="relative max-h-[calc(100dvh-6.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl border border-foreground/10 bg-card p-2 shadow-2xl shadow-black/15 dark:shadow-black/60">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                  />
                  <div className="grid grid-cols-2 gap-1">
                    {MENU_GROUPS.map((group, col) => (
                      <div key={group.id} className={`rounded-xl pb-1 ${col > 0 ? 'bg-foreground/[0.04]' : ''}`}>
                        <p id={group.id} className={groupLabelClass}>
                          {group.label}
                        </p>
                        <ul aria-labelledby={group.id} className="space-y-0.5">
                          {group.items.map((d) => renderMenuItem(d, col))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 border-t border-foreground/10 pt-1">
                    <Link
                      href="/#businesses"
                      onClick={() => closeEco()}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-foreground/5 dark:text-accent ${RING_INSET}`}
                    >
                      Explore all businesses
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={ABOUT.href}
              aria-current={ariaCurrent(ABOUT, isItemActive(ABOUT))}
              className={desktopItemClass(isItemActive(ABOUT))}
            >
              {ABOUT.label}
            </Link>
            <Link
              href={CONTACT.href}
              aria-current={ariaCurrent(CONTACT, isItemActive(CONTACT))}
              className={desktopItemClass(isItemActive(CONTACT))}
            >
              {CONTACT.label}
            </Link>
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 cursor-pointer active:scale-90 ${RING}`}
          >
            <span className="block transition-transform duration-500 motion-reduce:transition-none" style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              {isDark ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            </span>
          </button>

          {/* Primary CTA (desktop) — on the parent site this opens the business chooser */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('openGetStarted'))}
            className={`btn-shine hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 text-[13px] font-semibold tracking-normal shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${RING}`}
          >
            <Sparkles size={14} aria-hidden="true" />
            Get Started
          </button>

          {/* Mobile menu toggle */}
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            className={`lg:hidden p-2 rounded-xl text-foreground hover:bg-foreground/5 transition-colors active:scale-90 cursor-pointer ${RING}`}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {/* Backdrop (header is pointer-events-none, so opt back in while open) */}
      <div
        aria-hidden="true"
        onClick={closeMobile}
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ zIndex: -1 }}
      />
      {/* Panel */}
      <nav
        id="mobile-nav"
        ref={mobilePanelRef}
        aria-label="Mobile"
        inert={!isOpen}
        className={`lg:hidden mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-foreground/10 bg-background/90 backdrop-blur-xl shadow-2xl transition-[max-height,opacity] duration-400 ease-out motion-reduce:transition-none ${
          isOpen
            ? 'pointer-events-auto max-h-[calc(100dvh-6rem)] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain px-3 py-3 space-y-1">
          {(() => {
            const anim = `transition-all duration-300 motion-reduce:transition-none ${
              isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`;
            const delayFor = (i: number) => ({ transitionDelay: isOpen ? `${i * 45}ms` : '0ms' });
            const rowClass = (isActive: boolean) =>
              `flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm tracking-normal ${RING_INSET} ${anim} ${
                isActive
                  ? 'bg-gradient-to-r from-primary/15 to-accent/10 text-primary dark:text-accent'
                  : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground'
              }`;
            const simple = (item: NavItem, i: number) => {
              const isActive = isItemActive(item);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMobile}
                  aria-current={ariaCurrent(item, isActive)}
                  className={rowClass(isActive)}
                  style={delayFor(i)}
                >
                  {item.label}
                  <ArrowRight size={14} aria-hidden="true" className="text-foreground/30" />
                </Link>
              );
            };

            return (
              <>
                {simple(HOME, 0)}

                {/* Businesses accordion — all nine, the five websites first */}
                <div className={anim} style={delayFor(1)}>
                  <div
                    className={`flex items-stretch rounded-xl transition-colors duration-300 ${
                      menuActive ? 'bg-gradient-to-r from-primary/15 to-accent/10' : 'hover:bg-foreground/5'
                    }`}
                  >
                    <Link
                      href="/#businesses"
                      onClick={closeMobile}
                      className={`flex flex-1 items-center rounded-xl px-4 py-3 text-sm font-semibold tracking-normal ${RING_INSET} ${
                        menuActive ? 'text-primary dark:text-accent' : 'text-foreground/75 hover:text-foreground'
                      }`}
                    >
                      Businesses
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileBiz((v) => !v)}
                      aria-label="Businesses submenu"
                      aria-expanded={mobileBiz}
                      aria-controls="mobile-businesses"
                      className={`flex min-w-12 items-center justify-center rounded-xl px-3 text-foreground/50 hover:text-foreground cursor-pointer ${RING_INSET}`}
                    >
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={`transition-transform duration-300 motion-reduce:transition-none ${
                          mobileBiz ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    id="mobile-businesses"
                    inert={!mobileBiz}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                      mobileBiz ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="ml-4 mt-1 mb-1 border-l border-foreground/10 pl-2">
                        {MENU_GROUPS.map((group) => (
                          <div key={group.id}>
                            <p
                              id={`mobile-${group.id}`}
                              className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45"
                            >
                              {group.label}
                            </p>
                            <ul aria-labelledby={`mobile-${group.id}`} className="space-y-0.5">
                              {group.items.map((d) => {
                                const Icon = d.icon;
                                const isActive = isHrefActive(d.href);
                                return (
                                  <li key={d.slug}>
                                    <Link
                                      href={d.href}
                                      onClick={closeMobile}
                                      aria-current={currentFor(d.href, isActive)}
                                      className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-foreground/5 ${RING_INSET} ${
                                        isActive ? 'bg-primary/8' : ''
                                      }`}
                                    >
                                      <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${d.iconBg}`}
                                      >
                                        <Icon size={17} aria-hidden="true" />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2">
                                          <span className="truncate text-[13px] font-semibold text-foreground">
                                            {d.short}
                                          </span>
                                          {d.status === 'soon' && <SoonBadge />}
                                        </span>
                                        <span className="block truncate text-[11px] text-foreground/55">
                                          {d.tagline}
                                        </span>
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {simple(ABOUT, 2)}
                {simple(CONTACT, 3)}
              </>
            );
          })()}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('openGetStarted'));
            }}
            className={`btn-shine mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white px-5 py-3.5 text-sm font-semibold tracking-normal shadow-lg shadow-primary/25 cursor-pointer ${RING}`}
          >
            <Sparkles size={15} aria-hidden="true" />
            Get Started
          </button>

          {/* Mobile contact quick row */}
          <div className="flex items-center justify-center gap-2 pt-3 mt-2 border-t border-foreground/10 text-foreground/60">
            <a
              href={`tel:${SITE.phone}`}
              aria-label={`Call ${SITE.phoneDisplay}`}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold hover:text-primary transition-colors ${RING_INSET}`}
            >
              <Phone size={13} aria-hidden="true" /> Call
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label={`Email ${SITE.email}`}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold hover:text-primary transition-colors ${RING_INSET}`}
            >
              <Mail size={13} aria-hidden="true" /> Email
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp (opens in a new tab)"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold text-[#25D366] ${RING_INSET}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
