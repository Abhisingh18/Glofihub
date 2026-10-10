'use client';

import { ArrowRight, Briefcase, FileText, LifeBuoy, Mic, ShieldCheck, TrendingUp, type LucideIcon } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const REQUIREMENT = 'jobs';
const PREFILL_MESSAGE = "Hi GlofiHub, I'd like support with jobs and career preparation.";

interface Pillar {
  title: string;
  blurb: string;
  icon: LucideIcon;
}

// Generic, non-factual descriptions: no listings, salaries or placement promises.
const PILLARS: Pillar[] = [
  { title: 'Jobs', blurb: 'Verified opportunities, shared with you as they become available.', icon: Briefcase },
  { title: 'Resume', blurb: 'Present your education, skills and experience clearly.', icon: FileText },
  { title: 'Interviews', blurb: 'Preparation and practice so you walk in ready.', icon: Mic },
  { title: 'Career support', blurb: 'Guidance on choosing a direction and planning your next step.', icon: LifeBuoy },
  { title: 'Skill development', blurb: 'Build job-relevant skills alongside your search.', icon: TrendingUp },
];

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

/** Home-page "Jobs & Careers" section (id="careers"). Layout: text column + pillar stack. */
export function CareersSection() {
  const division = DIVISIONS.find((d) => d.slug === 'jobs');
  const iconBg = division?.iconBg ?? 'bg-gradient-to-br from-amber-500 to-orange-600';
  const description = division?.description ?? 'Jobs, career preparation, skill development and career guidance.';
  const soon = division?.status === 'soon';

  return (
    <section
      id="careers"
      aria-labelledby="careers-heading"
      className="relative scroll-mt-20 overflow-hidden bg-muted/30 px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-10 right-1/4 h-[40%] w-[40%] rounded-full bg-amber-500/10 blur-[120px] animate-aurora" />
        <div
          className="absolute bottom-0 left-1/4 h-[35%] w-[35%] rounded-full bg-primary/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Text column */}
        <div className="lg:col-span-5" data-reveal>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
              <Briefcase size={14} className="text-primary dark:text-accent" aria-hidden />
              <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">Jobs &amp; Careers</span>
            </div>
            <StatusBadge soon={soon} />
          </div>

          <h2
            id="careers-heading"
            className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Get Ready for Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Next Career Move
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70 md:text-base">{description}</p>

          {/* Honest note */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
            <p className="text-[13px] font-medium leading-relaxed text-foreground/80">
              GlofiHub publishes verified opportunities only. We support your preparation; we don&apos;t promise placements.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <button
              type="button"
              onClick={() => goToContact(REQUIREMENT, PREFILL_MESSAGE)}
              className={`btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              Explore Careers
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </button>
            <a
              href="/counselling#service-jobs"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-accent ${FOCUS_RING}`}
            >
              See placement support details
            </a>
          </div>
        </div>

        {/* Pillars */}
        <div className="lg:col-span-7">
          <ul role="list" className="relative space-y-4">
            {/* Connector line, visible in the gaps between cards */}
            <span
              aria-hidden
              className="absolute bottom-8 left-10 top-8 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/25 to-transparent sm:left-11"
            />
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <li
                  key={p.title}
                  data-reveal
                  data-reveal-d={`${(i % 5) + 1}`}
                  className="group relative flex items-start gap-4 rounded-2xl border border-foreground/10 bg-card p-4 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${iconBg}`}
                  >
                    <Icon size={22} className="text-white" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">{p.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground/65 sm:text-sm">{p.blurb}</p>
                  </div>
                  <span
                    aria-hidden
                    className="select-none font-display text-2xl font-extrabold leading-none text-foreground/[0.08] transition-colors group-hover:text-amber-500/30 sm:text-3xl"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
