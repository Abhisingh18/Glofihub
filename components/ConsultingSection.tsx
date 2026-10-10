'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Compass,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const REQUIREMENT = 'consulting';
const PREFILL_MESSAGE = "Hi GlofiHub, I'd like to talk to a consultant.";

const FALLBACK_CATEGORIES = [
  'Education Consulting',
  'Career Consulting',
  'Business Consulting',
  'International Opportunities',
  'Institutional Consulting',
  'Partnership Advisory',
];

// Icon + one neutral line per offering (generic copy; no specifics promised).
const OFFERING_META: Record<string, { icon: LucideIcon; blurb: string }> = {
  'Education Consulting': { icon: GraduationCap, blurb: 'Guidance on courses, institutions and study pathways.' },
  'Career Consulting': { icon: TrendingUp, blurb: 'Clarity on direction, skills and next steps.' },
  'Business Consulting': { icon: Building2, blurb: 'Practical advice for planning and growing a business.' },
  'International Opportunities': { icon: Globe, blurb: 'Understanding your study, work and program options abroad.' },
  'Institutional Consulting': { icon: Landmark, blurb: 'Support for schools, colleges and training organisations.' },
  'Partnership Advisory': { icon: Handshake, blurb: 'Advice on building and structuring collaborations.' },
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

/** Home-page "Consulting" section (id="consulting"). Layout: split header + hairline-divided offering grid. */
export function ConsultingSection() {
  const division = DIVISIONS.find((d) => d.slug === 'consulting');
  const offerings = division?.categories?.length ? division.categories : FALLBACK_CATEGORIES;
  const iconBg = division?.iconBg ?? 'bg-gradient-to-br from-cyan-500 to-teal-600';
  const description =
    division?.description ??
    'Education, career and business consulting — plus institutional consulting and partnership advisory.';
  const soon = (division?.status ?? 'soon') === 'soon';

  return (
    <section
      id="consulting"
      aria-labelledby="consulting-heading"
      className="relative scroll-mt-20 overflow-hidden bg-muted/30 px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-10 left-1/3 h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-aurora" />
        <div
          className="absolute bottom-0 right-1/4 h-[35%] w-[35%] rounded-full bg-emerald-500/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Split header: heading left, CTAs right */}
        <div className="mb-10 flex flex-col gap-8 md:mb-12 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
                <Compass size={14} className="text-primary dark:text-accent" aria-hidden />
                <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">Consulting</span>
              </div>
              <StatusBadge soon={soon} />
            </div>
            <h2
              id="consulting-heading"
              className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              Consulting for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                People, Institutions &amp; Businesses
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70 md:text-base">{description}</p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 lg:shrink-0">
            <button
              type="button"
              onClick={() => goToContact(REQUIREMENT, PREFILL_MESSAGE)}
              className={`btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              Talk to a consultant
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </button>
            <Link
              href="/consulting"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-accent ${FOCUS_RING}`}
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Offerings: one card, cells separated by hairlines */}
        <ul
          role="list"
          data-reveal
          data-reveal-d="2"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 shadow-lg shadow-black/5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {offerings.map((name, i) => {
            const meta = OFFERING_META[name];
            const Icon = meta?.icon ?? Compass;
            return (
              <li key={name} className="group relative flex gap-4 bg-card p-5 transition-colors duration-300 hover:bg-cyan-500/[0.04] sm:p-6">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/20 transition-colors duration-300 group-hover:text-white dark:text-cyan-300">
                  {/* Vertical's gradient fades in on hover */}
                  <span
                    aria-hidden
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${iconBg}`}
                  />
                  <Icon size={22} aria-hidden className="relative" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">{name}</h3>
                    <span aria-hidden className="select-none text-[11px] font-semibold tabular-nums text-foreground/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {meta && <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/65">{meta.blurb}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
