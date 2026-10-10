import type { ReactNode } from 'react';
import { Check, Globe, Landmark, MapPin, type LucideIcon } from 'lucide-react';
import { Accent, CtaLink, PageSection, SectionHeading, type KitCta } from '@/components/site/kit';
import { EDU_ABROAD_PROGRAMS, EDU_INDIA_PROGRAMS } from '@/components/education/EduProgramData';

/** Study destinations where GlofiHub has on-ground support (existing GlofiHub copy). */
const ABROAD_COUNTRIES = ['Russia', 'Georgia', 'Uzbekistan', 'Kazakhstan', 'Kyrgyzstan'];

interface PanelProps {
  /** Tailwind gradient stops (full class strings). */
  gradient: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text: string;
  programs: string[];
  extra: ReactNode;
  cta: KitCta;
  /** Scroll-reveal stagger step (1–5). */
  delay: number;
}

function Panel({ gradient, icon: Icon, eyebrow, title, text, programs, extra, cta, delay }: PanelProps) {
  return (
    <article
      data-reveal
      data-reveal-d={delay}
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-7 text-white shadow-xl shadow-primary/15 ring-1 ring-white/10 sm:p-9`}
    >
      <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 animate-aurora rounded-full bg-white/10 blur-3xl motion-reduce:animate-none"
      />

      <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
        <Icon size={22} aria-hidden />
      </span>
      <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/75">{eyebrow}</p>
      <h3 className="relative mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-white/80 md:text-base">{text}</p>

      <p className="relative mt-7 text-xs font-bold uppercase tracking-[0.14em] text-white/75">Programs</p>
      <ul role="list" className="relative mt-3 grid gap-2.5 sm:grid-cols-2">
        {programs.map((name) => (
          <li key={name} className="flex items-start gap-2 text-sm font-semibold">
            <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20">
              <Check size={12} strokeWidth={3} />
            </span>
            {name}
          </li>
        ))}
      </ul>

      <div className="relative mt-6">{extra}</div>

      <div className="relative mt-auto pt-8">
        <CtaLink cta={cta} onDark />
      </div>
    </article>
  );
}

/**
 * Home page, section 2 — "Study in India or study abroad": two panels, each with its programs and a
 * link to its own page (/education/study-in-india, /education/study-abroad). Server component.
 */
export function EduIndiaAbroad() {
  return (
    <PageSection id="india-or-abroad" labelledBy="edu-split-heading" className="scroll-mt-28">
      <SectionHeading
        id="edu-split-heading"
        eyebrow="India or abroad"
        title={
          <>
            Study in India or <Accent>study abroad</Accent>
          </>
        }
        intro="Choose the route that fits your goals — each has its own page with the details."
      />

      <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Panel
          delay={1}
          gradient="from-[#0A2F6B] to-blue-700"
          icon={Landmark}
          eyebrow="Study in India"
          title="Programs at Indian institutions"
          text="Guidance for admissions to private and state institutions in India, across medical, technology and management programs."
          programs={EDU_INDIA_PROGRAMS.map((p) => p.name)}
          extra={
            <p className="flex items-start gap-2 text-sm font-medium text-white/80">
              <MapPin size={16} aria-hidden className="mt-0.5 shrink-0" />
              GlofiHub office: Kankarbagh, Patna, Bihar
            </p>
          }
          cta={{ label: 'Explore Study in India', href: '/education/study-in-india' }}
        />

        <Panel
          delay={2}
          gradient="from-emerald-800 to-teal-800"
          icon={Globe}
          eyebrow="Study Abroad"
          title="Universities in Russia, Georgia & Central Asia"
          text="Admission guidance for medical and state universities abroad, with on-ground support in host countries."
          programs={EDU_ABROAD_PROGRAMS.map((p) => p.name)}
          extra={
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">On-ground support in</p>
              <ul role="list" className="mt-3 flex flex-wrap gap-2">
                {ABROAD_COUNTRIES.map((c) => (
                  <li key={c} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          }
          cta={{ label: 'Explore Study Abroad', href: '/education/study-abroad' }}
        />

        {/* "or" badge between the two panels (wide screens only). */}
        <span
          aria-hidden
          data-reveal
          data-reveal-d="2"
          className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-foreground/10 bg-card text-xs font-extrabold uppercase tracking-wide text-foreground/70 shadow-lg lg:grid"
        >
          or
        </span>
      </div>
    </PageSection>
  );
}
