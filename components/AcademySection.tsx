'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Clapperboard,
  Cpu,
  GraduationCap,
  Languages,
  Laptop,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Palette,
  PenTool,
  Presentation,
  Rocket,
  Stethoscope,
  TrendingUp,
  UserRound,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

/* ───────────────────────── Data ───────────────────────── */

interface GroupDef {
  id: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  /** Gradient used for the icon tile + top accent bar. */
  tile: string;
  /** Tint for the small per-course icon square. */
  chip: string;
  /** Category names (must match `categories` of the academy entry in DIVISIONS). */
  items: string[];
}

// Four thematic groups covering all 11 academy categories from lib/divisions.ts.
const GROUP_DEFS: GroupDef[] = [
  {
    id: 'tech',
    title: 'Technology & AI',
    blurb: 'Future-ready digital skills',
    icon: Cpu,
    tile: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    items: ['AI & ChatGPT', 'Computer & IT'],
  },
  {
    id: 'creative',
    title: 'Creative & Marketing',
    blurb: 'Create, design and promote',
    icon: Palette,
    tile: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
    chip: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300',
    items: ['Video Editing', 'Graphic Design', 'Digital Marketing'],
  },
  {
    id: 'languages',
    title: 'Languages',
    blurb: 'Communicate with confidence',
    icon: Languages,
    tile: 'bg-gradient-to-br from-emerald-500 to-green-600',
    chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    items: ['Spoken English', 'Russian', 'German'],
  },
  {
    id: 'career',
    title: 'Career & Medical',
    blurb: 'Prepare for the next step',
    icon: Briefcase,
    tile: 'bg-gradient-to-br from-amber-500 to-orange-600',
    chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    items: ['Business Skills', 'Career Skills', 'Medical / FMGE'],
  },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'AI & ChatGPT': BrainCircuit,
  'Computer & IT': Laptop,
  'Video Editing': Clapperboard,
  'Graphic Design': PenTool,
  'Digital Marketing': Megaphone,
  'Spoken English': MessageCircle,
  Russian: Languages,
  German: Languages,
  'Business Skills': TrendingUp,
  'Career Skills': Rocket,
  'Medical / FMGE': Stethoscope,
};

interface ResolvedGroup extends GroupDef {
  items: string[];
}

/** Single source of truth is the academy entry of DIVISIONS; any category not mapped above lands in the last group. */
function resolveGroups(): ResolvedGroup[] {
  const academy = DIVISIONS.find((d) => d.slug === 'academy');
  const available = academy?.categories ?? GROUP_DEFS.flatMap((g) => g.items);
  const mapped = new Set(GROUP_DEFS.flatMap((g) => g.items));
  const unmapped = available.filter((c) => !mapped.has(c));

  return GROUP_DEFS.map((g, i) => ({
    ...g,
    items: [
      ...g.items.filter((c) => available.includes(c)),
      ...(i === GROUP_DEFS.length - 1 ? unmapped : []),
    ],
  })).filter((g) => g.items.length > 0);
}

const GROUPS = resolveGroups();

const ACADEMY = DIVISIONS.find((d) => d.slug === 'academy');
const ACADEMY_HREF = ACADEMY?.href ?? '/academy';
const ACADEMY_CTA = ACADEMY?.cta ?? 'Explore Academy';

const FORMATS: { label: string; icon: LucideIcon }[] = [
  { label: 'Online courses', icon: MonitorPlay },
  { label: 'Live classes', icon: Video },
  { label: 'Workshops', icon: Presentation },
  { label: 'Certifications', icon: Award },
];

/* ───────────────────────── Helpers ───────────────────────── */

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const ON_NAVY_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

/** Send the visitor to the contact form with the requirement (and an optional message) pre-selected. */
function goToContact(requirement: string, message: string) {
  const contact = document.getElementById('contact');
  if (!contact) {
    // Contact form is not on this page — hand over via the URL contract instead.
    window.location.assign(
      `/?requirement=${encodeURIComponent(requirement)}&message=${encodeURIComponent(message)}#contact`
    );
    return;
  }
  window.dispatchEvent(new CustomEvent('prefillContact', { detail: { requirement, message } }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  contact.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

function LaunchingSoonBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
      </span>
      Launching soon
    </span>
  );
}

/* ───────────────────────── Component ───────────────────────── */

/** Home-page GlofiHub Academy section: course categories (launching soon) + faculty shell. */
export function AcademySection() {
  return (
    <section
      id="academy-courses"
      aria-labelledby="academy-heading"
      className="relative bg-background overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      {/* Ambient aurora accents (emerald = Academy colour) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-10 right-0 h-[45%] w-[45%] rounded-full bg-emerald-500/10 blur-[120px] animate-aurora" />
        <div
          className="absolute bottom-0 -left-10 h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(10,47,107,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,47,107,0.07) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 75% 60% at 70% 30%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 70% 30%, black, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Academy: intro (left) + grouped categories (right) ── */}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Intro */}
          <div data-reveal className="lg:col-span-5">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
                <BookOpen size={14} className="text-primary dark:text-accent" aria-hidden />
                <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">GlofiHub Academy</span>
              </div>
              <LaunchingSoonBadge />
            </div>

            <h2
              id="academy-heading"
              className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              Learn Skills That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                Move You Forward
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/65 md:text-base">
              Online courses, live classes, workshops and certifications.
            </p>

            {/* Learning formats */}
            <ul role="list" className="mt-7 grid grid-cols-2 gap-2.5">
              {FORMATS.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl border border-foreground/10 bg-card px-3.5 py-3 text-[13px] font-semibold text-foreground/80 shadow-sm shadow-black/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <Icon size={16} aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={ACADEMY_HREF}
                className={`btn-shine group/cta inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
              >
                {ACADEMY_CTA}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform motion-safe:group-hover/cta:translate-x-1"
                />
              </Link>
              <button
                type="button"
                onClick={() => goToContact('academy', "I'd like to be notified when GlofiHub Academy launches.")}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground/20 bg-card px-7 py-3.5 text-sm font-semibold tracking-wide text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
              >
                <Bell size={16} aria-hidden className="text-primary dark:text-accent" />
                Get notified
              </button>
            </div>
            <p className="mt-4 text-xs font-medium leading-relaxed text-foreground/55">
              Course details will be shared as the Academy launches.
            </p>
          </div>

          {/* Grouped categories */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7">
            {GROUPS.map((g, i) => {
              const GroupIcon = g.icon;
              return (
                <div key={g.id} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
                  <div className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-5 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6">
                    <span aria-hidden className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-500 group-hover:opacity-100 ${g.tile}`} />

                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${g.tile}`}
                      >
                        <GroupIcon size={22} className="text-white" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">{g.title}</h3>
                        <p className="mt-0.5 text-xs font-medium text-foreground/60">{g.blurb}</p>
                      </div>
                    </div>

                    <ul role="list" className="mt-5 space-y-2">
                      {g.items.map((item) => {
                        const ItemIcon = CATEGORY_ICONS[item] ?? BookOpen;
                        return (
                          <li
                            key={item}
                            className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 text-sm font-medium text-foreground/85"
                          >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${g.chip}`}>
                              <ItemIcon size={16} aria-hidden />
                            </span>
                            <span className="min-w-0">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Faculty ── */}
        <div id="faculty" className="mt-14 scroll-mt-24 md:mt-20">
          <div
            data-reveal
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 p-6 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 sm:p-10 lg:p-12"
          >
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl animate-aurora" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                  <GraduationCap size={14} className="text-emerald-300" aria-hidden />
                  <span className="text-xs font-semibold tracking-wide text-white/90">Faculty</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  Learn From People Who{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                    Know the Journey.
                  </span>
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                  We are building a faculty of verified educators and industry professionals for GlofiHub Academy.
                  If you teach or work in one of our course areas, we would like to hear from you.
                </p>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => goToContact('academy', "I'd like to become a GlofiHub instructor.")}
                    className={`btn-shine group/btn inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-[#0A2F6B] shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 motion-safe:hover:-translate-y-0.5 ${ON_NAVY_FOCUS}`}
                  >
                    Become a GlofiHub Instructor
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform motion-safe:group-hover/btn:translate-x-1"
                    />
                  </button>
                </div>
              </div>

              {/* Honest shell: who we're building the faculty with, profiles to follow */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
                  <p className="text-xs font-semibold tracking-wide text-white/65">Who we are building this with</p>
                  <ul role="list" className="mt-4 space-y-3.5">
                    <li className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                        <BadgeCheck size={18} aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Verified educators</p>
                        <p className="mt-0.5 text-[13px] leading-snug text-white/70">Subject teachers and trainers.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                        <Briefcase size={18} aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Industry professionals</p>
                        <p className="mt-0.5 text-[13px] leading-snug text-white/70">People working in the field today.</p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-5">
                    <div aria-hidden className="flex shrink-0 -space-x-2.5">
                      {[0, 1, 2].map((n) => (
                        <span
                          key={n}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/35 bg-[#0A2F6B] text-white/45"
                        >
                          <UserRound size={18} />
                        </span>
                      ))}
                    </div>
                    <p className="text-xs font-medium leading-snug text-white/70">
                      Faculty profiles will be introduced here as educators join.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
