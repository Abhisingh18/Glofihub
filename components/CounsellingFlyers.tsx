'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  Stethoscope,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { SITE } from '@/lib/site';

interface Flyer {
  key: string;
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  icon: LucideIcon;
  gradient: string;   // header background
  accent: string;     // tag tint
  wa: string;         // prefilled WhatsApp text
}

const FLYERS: Flyer[] = [
  {
    key: 'mbbs',
    tag: 'Admissions Open 2026',
    title: 'MBBS Abroad Counselling',
    subtitle: 'Study medicine in Russia, Georgia, Kazakhstan & more — at a fraction of the cost.',
    points: ['NMC & WHO approved universities', 'No donation · Affordable fees', 'End-to-end visa & admission support'],
    icon: Stethoscope,
    gradient: 'from-primary via-primary to-blue-950',
    accent: 'text-emerald-300',
    wa: 'Hi GlofiHub! 👋 I saw the MBBS Abroad counselling flyer. I want free counselling for MBBS admission.',
  },
  {
    key: 'mba',
    tag: 'Limited Seats',
    title: 'MBA Counselling',
    subtitle: 'Top B-schools in India & abroad — pick the right programme for your career.',
    points: ['Profile evaluation & college shortlisting', 'Scholarship & education loan guidance', 'Application + interview preparation'],
    icon: Briefcase,
    gradient: 'from-violet-700 via-violet-800 to-indigo-950',
    accent: 'text-amber-300',
    wa: 'Hi GlofiHub! 👋 I saw the MBA counselling flyer. I want free counselling for MBA admission.',
  },
];

/** Engagement gate: show once per session after the visitor has really browsed. */
const ENGAGE_AFTER_MS = 25000;   // 25 s on the page ...
const ENGAGE_SCROLL = 0.5;       // ... or 50% scrolled, whichever comes first
const SCROLL_GRACE_MS = 4000;    // ignore instant anchor-jumps: scroll-trigger counts after 4 s
const ROTATE_AFTER_MS = 12000;   // auto-switch to the next flyer while open (paused on hover/focus)

const STORAGE_KEY = 'glofihub:education-flyers';

// sessionStorage can throw (private mode, blocked site data, SSR) — never let it break the page.
function readStored(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function writeStored(value: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the in-memory guard below still prevents re-opening */
  }
}

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';

/**
 * Non-modal GlofiHub Education offer popup (MBBS / MBA counselling).
 *
 * Placement (never overlaps the other floating UI):
 *  - mobile: centred, above the Get Started pill (bottom 6.5rem + 44px) which sits above the chat launcher
 *  - md+:    right-20 (clear of the right-edge Get Started tab), above the chat launcher + its hint pill
 * z-40 so the chat window/backdrop (z-45/50) and modals (z-120) always layer above it.
 */
export function CounsellingFlyers() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // In-memory guard: once shown/dismissed it never re-opens in this page view, even if storage is unavailable.
  const doneRef = useRef(false);

  // Appear once per session, after real engagement.
  useEffect(() => {
    if (readStored()) {
      doneRef.current = true;
      return;
    }

    const startedAt = Date.now();
    let dwellTimer: number | undefined;
    let scrollTimer: number | undefined;

    function cleanup() {
      window.clearTimeout(dwellTimer);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onScroll);
    }

    function reveal() {
      if (doneRef.current) return;
      doneRef.current = true;
      writeStored('shown');
      cleanup();
      setOpen(true);
    }

    function onScroll() {
      if (scrollTimer !== undefined) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= ENGAGE_SCROLL) {
        scrollTimer = window.setTimeout(reveal, Math.max(0, SCROLL_GRACE_MS - (Date.now() - startedAt)));
      }
    }

    dwellTimer = window.setTimeout(reveal, ENGAGE_AFTER_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
    return cleanup;
  }, []);

  // While open: rotate to the next flyer (paused on hover/focus; skipped for reduced-motion users).
  useEffect(() => {
    if (!open || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % FLYERS.length), ROTATE_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [open, paused, index]);

  // Dismiss for the rest of the session — never auto-reopens.
  const close = useCallback(() => {
    doneRef.current = true;
    writeStored('dismissed');
    setOpen(false);
  }, []);

  // Esc closes (but not while another modal is open or the visitor is typing, e.g. in the chatbot).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  const f = FLYERS[index];
  const Icon = f.icon;
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(f.wa)}`;

  return (
    <div
      role="complementary"
      aria-label="GlofiHub Education offers"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      className="fixed z-40 bottom-[10.5rem] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-20 md:bottom-28 w-[min(22rem,calc(100vw-2rem))] animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none"
    >
      <div
        key={f.key}
        className="relative rounded-3xl overflow-x-hidden overflow-y-auto overscroll-contain bg-card border border-foreground/10 shadow-2xl max-h-[calc(100dvh-15.5rem)] md:max-h-[calc(100dvh-12rem)] animate-in fade-in duration-300 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${f.gradient} text-white p-5 overflow-hidden`}>
          <span aria-hidden className="pointer-events-none absolute -top-10 -right-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
          <button
            type="button"
            onClick={close}
            aria-label="Close offer popup"
            className="absolute top-2.5 right-2.5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
          >
            <X size={16} />
          </button>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-3 pr-9">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold tracking-wide text-white">
              <GraduationCap size={11} /> GlofiHub Education offer
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide ${f.accent}`}>
              <CalendarClock size={11} /> {f.tag}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center shrink-0">
              <Icon size={22} />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold leading-tight">{f.title}</h2>
              <p className="text-[11px] text-white/80 font-medium mt-0.5 leading-snug">{f.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <ul className="space-y-2 mb-4">
            {f.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[13px] text-foreground/75 font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /> {p}
              </li>
            ))}
          </ul>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-md shadow-[#25D366]/30 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all ${FOCUS_RING}`}
          >
            Book Free Counselling <ArrowRight size={15} />
          </a>

          <button
            type="button"
            onClick={() => {
              close();
              window.dispatchEvent(new CustomEvent('openGetStarted'));
            }}
            className={`w-full mt-2 py-2 rounded-full text-xs font-semibold text-primary dark:text-blue-300 hover:underline cursor-pointer ${FOCUS_RING}`}
          >
            Or create your free account →
          </button>

          {/* Flyer dots (padded buttons for a comfortable tap target) */}
          <div role="group" aria-label="Choose an offer" className="flex items-center justify-center gap-0.5 mt-2">
            {FLYERS.map((x, i) => (
              <button
                key={x.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${x.title}`}
                aria-current={i === index ? 'true' : undefined}
                className={`group/dot p-2 rounded-full cursor-pointer ${FOCUS_RING}`}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-primary dark:bg-blue-300' : 'w-1.5 bg-foreground/20 group-hover/dot:bg-foreground/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
