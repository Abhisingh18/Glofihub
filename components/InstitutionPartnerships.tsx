'use client';

import {
  ArrowRight,
  Building2,
  Check,
  Code2,
  GraduationCap,
  Landmark,
  Presentation,
  UserSearch,
  type LucideIcon,
} from 'lucide-react';

/** Who we partner with (Ecosystem Blueprint §6). */
const AUDIENCES = ['Schools', 'Colleges', 'Universities', 'Training centers', 'Employers', 'Organizations'];

/** The five partnership types (Ecosystem Blueprint §6) — one neutral line each. */
const TYPES: { title: string; text: string; icon: LucideIcon; iconBg: string }[] = [
  {
    title: 'Academic Partnerships',
    text: 'Work with schools, colleges and universities on education pathways for learners.',
    icon: GraduationCap,
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    title: 'Corporate Partnerships',
    text: 'Collaborate with businesses and organizations on shared goals.',
    icon: Building2,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
  },
  {
    title: 'Training Partnerships',
    text: 'Team up with training centers and educators on skills and learning programs.',
    icon: Presentation,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    title: 'Recruitment Partnerships',
    text: 'Connect employers with learners and professionals looking for opportunities.',
    icon: UserSearch,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    title: 'Technology Partnerships',
    text: 'Collaborate on digital platforms, automation and technology solutions.',
    icon: Code2,
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
  },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Send the visitor to the contact form with "Institutional Partnership" preselected. */
function discussPartnership() {
  window.dispatchEvent(
    new CustomEvent('prefillContact', {
      detail: {
        requirement: 'institutional',
        message: "I'd like to discuss a partnership with GlofiHub.",
      },
    })
  );
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Home-page Institution Partnerships: split layout — pitch + CTA on the left, five partnership types on the right.
 * The section uses overflow-clip (not overflow-hidden) so the sticky left column keeps working.
 */
export function InstitutionPartnerships() {
  return (
    <section
      id="institutions"
      className="relative overflow-clip bg-muted/30 px-4 py-16 sm:px-6 md:py-24 lg:px-8 scroll-mt-20"
    >
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-20 left-0 h-[40%] w-[35%] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
        <div
          className="absolute -bottom-20 right-0 h-[40%] w-[35%] rounded-full bg-emerald-500/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left: pitch, audiences and call to action */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start" data-reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
            <Landmark size={14} className="text-primary dark:text-accent" aria-hidden />
            <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">
              Institution Partnerships
            </span>
          </div>
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Partner with{' '}
            <span className="animate-gradient-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              GlofiHub
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/65 md:text-base">
            GlofiHub works with institutions and organizations that want to collaborate on education, skills, careers
            and technology.
          </p>

          <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-[0.18em] text-foreground/55">We partner with</p>
          <ul className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <li
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-card px-3.5 py-1.5 text-[13px] font-medium text-foreground/80 shadow-sm"
              >
                <Check size={12} strokeWidth={3} className="shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {a}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={discussPartnership}
            className={`btn-shine group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto ${FOCUS_RING}`}
          >
            Discuss a partnership
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </button>
        </div>

        {/* Right: the five partnership types as a stack of horizontal cards */}
        <ul className="grid gap-4 lg:col-span-7">
          {TYPES.map(({ title, text, icon: Icon, iconBg }, i) => (
            <li
              key={title}
              data-reveal
              data-reveal-d={`${(i % 5) + 1}`}
              className="group relative flex items-start gap-4 overflow-hidden rounded-3xl border border-foreground/10 bg-card p-5 shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl motion-reduce:hover:translate-y-0 sm:gap-5 sm:p-6"
            >
              {/* Accent bar that appears on hover */}
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${iconBg}`}
              />
              {/* Ghost number */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-2 right-4 select-none font-display text-6xl font-extrabold leading-none text-foreground/[0.04] transition-colors group-hover:text-foreground/[0.07]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 sm:h-14 sm:w-14 ${iconBg}`}
              >
                <Icon size={24} className="text-white" aria-hidden />
              </span>
              <div className="relative min-w-0">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground/65 sm:text-sm">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
