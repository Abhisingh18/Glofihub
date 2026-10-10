import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Cpu,
  Globe,
  HeartHandshake,
  Rocket,
  Route,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { SITE } from '@/lib/site';

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Gradient classes shared by the icon tile and the left accent bar. */
  tile: string;
}

// Copy follows the Ecosystem Blueprint (section 7).
const REASONS: Reason[] = [
  {
    title: 'One Ecosystem',
    description: 'Multiple services connected in one platform.',
    icon: Blocks,
    tile: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Practical Guidance',
    description: 'Support focused on real decisions and real processes.',
    icon: Route,
    tile: 'from-cyan-500 to-teal-600',
  },
  {
    title: 'Global Network',
    description: 'Connections across India, Russia and international markets.',
    icon: Globe,
    tile: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Learning + Opportunity',
    description: 'Skills and opportunities in the same ecosystem.',
    icon: Rocket,
    tile: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Technology Enabled',
    description: 'Digital platforms, CRM and AI-powered tools.',
    icon: Cpu,
    tile: 'from-indigo-500 to-violet-600',
  },
  {
    title: 'Human Support',
    description: 'Technology supported by real people.',
    icon: HeartHandshake,
    tile: 'from-amber-500 to-orange-600',
  },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Home-page "Why GlofiHub": six reasons as accent-edged cards beside a sticky intro. */
export function WhyGlofiHub() {
  return (
    <section
      id="why-glofihub"
      aria-labelledby="why-glofihub-heading"
      className="relative overflow-clip bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute -top-10 right-1/4 h-[35%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-[35%] w-[35%] rounded-full bg-emerald-500/10 blur-[120px] animate-aurora"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Intro column (sticks while the cards scroll on desktop) */}
        <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28" data-reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
            <BadgeCheck size={14} className="text-primary dark:text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">The GlofiHub Difference</span>
          </div>
          <h2
            id="why-glofihub-heading"
            className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Why{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              GlofiHub
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">
            Education, skills, careers, technology and global opportunities, connected in one ecosystem and backed by
            real people.
          </p>

          {/* Brand-line card */}
          <div className="relative mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-5 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10">
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-base font-bold leading-snug">{SITE.tagline}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">
                  {SITE.name} connects learners, professionals, institutions and businesses with what they need to move
                  forward.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/#contact"
            className={`group/cta mt-6 inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-primary transition-colors hover:text-accent dark:text-accent dark:hover:text-blue-300 ${FOCUS_RING}`}
          >
            Start a conversation
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover/cta:translate-x-1 motion-reduce:group-hover/cta:translate-x-0"
            />
          </Link>
        </div>

        {/* Reasons: 2 x 3 accent-edged cards */}
        <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <li key={reason.title} data-reveal data-reveal-d={`${(i % 2) + 1}`} className="flex">
                <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card py-6 pl-8 pr-6 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  {/* Left accent bar */}
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b transition-all duration-500 group-hover:w-2.5 motion-reduce:transition-none ${reason.tile}`}
                  />
                  {/* Soft colour wash on hover */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 motion-reduce:transition-none ${reason.tile}`}
                  />

                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md shadow-black/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${reason.tile}`}
                  >
                    <Icon size={22} className="text-white" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-4 font-display text-lg font-bold tracking-tight text-foreground">
                    {reason.title}
                  </h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-foreground/65">{reason.description}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
