import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  Globe,
  Network,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Gradient classes for the icon tile. */
  tile: string;
  /** Gradient classes for the connector that leads to the NEXT step (none on the last). */
  link?: string;
}

const STEPS: Step[] = [
  {
    title: 'Discover',
    description: 'Find the path that fits your goals.',
    icon: Search,
    tile: 'from-blue-500 to-blue-600',
    link: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Learn',
    description: 'Gain the knowledge your path demands.',
    icon: BookOpen,
    tile: 'from-indigo-500 to-violet-600',
    link: 'from-indigo-500 to-emerald-500',
  },
  {
    title: 'Build Skills',
    description: 'Develop practical, real-world skills.',
    icon: Wrench,
    tile: 'from-emerald-500 to-green-600',
    link: 'from-emerald-500 to-cyan-500',
  },
  {
    title: 'Connect',
    description: 'Meet the people and networks that open doors.',
    icon: Network,
    tile: 'from-cyan-500 to-teal-600',
    link: 'from-cyan-500 to-amber-500',
  },
  {
    title: 'Apply',
    description: 'Move ahead with admissions, jobs or programs.',
    icon: Send,
    tile: 'from-amber-500 to-orange-600',
    link: 'from-amber-500 to-rose-500',
  },
  {
    title: 'Grow',
    description: 'Keep growing with support at every stage.',
    icon: TrendingUp,
    tile: 'from-rose-500 to-pink-600',
  },
];

/** The five pillars GlofiHub brings together (per the ecosystem blueprint). */
const PILLARS: { label: string; icon: LucideIcon }[] = [
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Wrench },
  { label: 'Career opportunities', icon: Briefcase },
  { label: 'Technology', icon: Code2 },
  { label: 'Global connections', icon: Globe },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Home-page "How GlofiHub Works": Discover → Learn → Build Skills → Connect → Apply → Grow. */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-muted/30 py-16 md:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      {/* Component-scoped styles: connector "draw-in" + desktop-only stagger */}
      <style>{`
        .hiw-step { --reveal-delay: 0ms; }
        .hiw-link {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--reveal-delay, 0ms) + 350ms);
        }
        .reveal-in .hiw-link { transform: none; }
        @media (min-width: 1024px) {
          .hiw-step { --reveal-delay: var(--hiw-d, 0ms); }
          .hiw-link { transform: scaleX(0); transform-origin: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hiw-link { transform: none !important; transition: none !important; }
        }
      `}</style>

      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-aurora"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16" data-reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
            <Sparkles size={14} className="text-primary dark:text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">The GlofiHub Journey</span>
          </div>
          <h2
            id="how-it-works-heading"
            className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            How GlofiHub{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Works
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">
            GlofiHub brings education, skills, career opportunities, technology and global connections together, so
            every step of your journey leads naturally to the next.
          </p>
        </div>

        {/* Stepper: vertical on mobile, horizontal with a connecting line on lg */}
        <ol role="list" className="mx-auto max-w-md lg:grid lg:max-w-none lg:grid-cols-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                data-reveal
                style={{ '--hiw-d': `${80 + i * 90}ms` } as CSSProperties}
                className="hiw-step group relative flex gap-5 pb-9 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:px-2 lg:pb-0 lg:text-center"
              >
                {/* Connector to the next step (draws in after the step appears) */}
                {step.link && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 left-[31px] top-[4.5rem] w-0.5 overflow-hidden rounded-full bg-foreground/10 lg:bottom-auto lg:left-1/2 lg:top-[31px] lg:h-0.5 lg:w-full"
                  >
                    <span className={`hiw-link block h-full w-full bg-gradient-to-b lg:bg-gradient-to-r ${step.link}`} />
                  </span>
                )}

                {/* Icon tile + step number */}
                <div className="relative z-10 shrink-0">
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg shadow-black/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${step.tile}`}
                  >
                    <Icon size={28} className="text-white" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-foreground/10 bg-card text-[10px] font-bold text-foreground shadow-sm"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Copy */}
                <div className="min-w-0 pt-1 lg:pt-5">
                  <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* What gets brought together + CTA */}
        <div className="mt-14 flex flex-col items-center text-center md:mt-16" data-reveal>
          <p className="text-xs font-semibold tracking-wide text-foreground/55">Brought together in one ecosystem</p>
          <ul role="list" className="mt-4 flex flex-wrap items-center justify-center gap-y-2">
            {PILLARS.map(({ label, icon: PillarIcon }) => (
              <li key={label} className="group flex items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
                  <PillarIcon size={15} className="shrink-0 text-primary dark:text-accent" aria-hidden="true" />
                  {label}
                </span>
                <span aria-hidden className="mx-2 text-sm font-bold text-foreground/30 group-last:hidden">
                  +
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className={`btn-shine group/cta mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
          >
            Start Your Journey
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover/cta:translate-x-1 motion-reduce:group-hover/cta:translate-x-0"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
