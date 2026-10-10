'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarDays,
  Globe,
  GraduationCap,
  Rocket,
  Telescope,
  type LucideIcon,
} from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const REQUIREMENT = 'global-opportunities';
const PREFILL_MESSAGE = "Hi GlofiHub, I'd like to know about international opportunities.";

const FALLBACK_CATEGORIES = [
  'Study Abroad',
  'International Jobs',
  'Scholarships',
  'Fellowships & Programs',
  'Internships',
  'International Events',
];

// Icon + one neutral line per category (generic copy; no specifics promised).
const CATEGORY_META: Record<string, { icon: LucideIcon; blurb: string }> = {
  'Study Abroad': { icon: GraduationCap, blurb: 'Degree programs at universities overseas.' },
  'International Jobs': { icon: Briefcase, blurb: 'Roles with employers in other countries.' },
  Scholarships: { icon: Award, blurb: 'Funding options for international study.' },
  'Fellowships & Programs': { icon: Telescope, blurb: 'Structured programs for learning and growth.' },
  Internships: { icon: Rocket, blurb: 'Early-career experience with international exposure.' },
  'International Events': { icon: CalendarDays, blurb: 'Conferences, exchanges and gatherings.' },
};

/** Sends the visitor to the contact form with the requirement preselected. */
function goToContact(requirement: string, message?: string) {
  window.dispatchEvent(new CustomEvent('prefillContact', { detail: { requirement, message } }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

function StatusBadge({ soon }: { soon: boolean }) {
  const tone = soon
    ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
  const dot = soon ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:animate-none ${dot}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      {soon ? 'Launching soon' : 'Live'}
    </span>
  );
}

/** Home-page "Global Opportunities" section (id="global"). Layout: centred header + category tile grid. */
export function GlobalOpportunitiesSection() {
  const division = DIVISIONS.find((d) => d.slug === 'global-opportunities');
  const categories = division?.categories?.length ? division.categories : FALLBACK_CATEGORIES;
  const iconBg = division?.iconBg ?? 'bg-gradient-to-br from-rose-500 to-pink-600';
  const description = division?.description ?? 'International education, jobs, events and opportunities.';
  const soon = (division?.status ?? 'soon') === 'soon';

  return (
    <section
      id="global"
      aria-labelledby="global-heading"
      className="relative scroll-mt-20 overflow-hidden bg-background px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      {/* Ambient glow + faint globe motif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-10 left-1/4 h-[40%] w-[40%] rounded-full bg-rose-500/10 blur-[120px] animate-aurora" />
        <div
          className="absolute bottom-0 right-1/4 h-[35%] w-[35%] rounded-full bg-primary/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
        <Globe
          className="absolute -right-24 -top-24 h-72 w-72 text-rose-500/[0.07] sm:h-96 sm:w-96 dark:text-rose-400/[0.08]"
          strokeWidth={0.6}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-14" data-reveal>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
              <Globe size={14} className="text-primary dark:text-accent" aria-hidden />
              <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">Global Opportunities</span>
            </div>
            <StatusBadge soon={soon} />
          </div>
          <h2
            id="global-heading"
            className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Study, Work &amp; Grow{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Across Borders
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">{description}</p>
        </div>

        {/* Category tiles */}
        <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {categories.map((name, i) => {
            const meta = CATEGORY_META[name];
            const Icon = meta?.icon ?? Globe;
            return (
              <li
                key={name}
                data-reveal
                data-reveal-d={`${(i % 5) + 1}`}
                className="group relative flex overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
              >
                {/* Top accent bar */}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-500 group-hover:opacity-100 ${iconBg}`}
                />
                {/* Ghost number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-3 right-4 select-none font-display text-7xl font-extrabold leading-none text-foreground/[0.04] transition-colors group-hover:text-foreground/[0.07]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative flex min-w-0 flex-col">
                  <span
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${iconBg}`}
                  >
                    <Icon size={26} className="text-white" aria-hidden />
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{name}</h3>
                  {meta && <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">{meta.blurb}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Launch note + CTAs */}
        <div data-reveal className="mx-auto mt-10 max-w-2xl text-center md:mt-12">
          <p className="text-sm font-medium leading-relaxed text-foreground/65">
            This vertical is launching soon. Verified opportunities will be listed here once they are ready.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/global-opportunities"
              className={`btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              Explore Opportunities
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </Link>
            <button
              type="button"
              onClick={() => goToContact(REQUIREMENT, PREFILL_MESSAGE)}
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-card px-7 py-3.5 text-sm font-semibold tracking-wide text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              Ask about opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
