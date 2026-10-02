'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { ArrowRight, Check, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { DIVISIONS, type Division } from '@/lib/divisions';
import { SITE } from '@/lib/site';

const spotlight = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

type Variant = 'featured' | 'wide' | 'default';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const partnerLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  "Hi GlofiHub! 👋 I'd like to talk about a partnership / collaboration."
)}`;

function CheckDot() {
  return (
    <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
      <Check size={10} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />
    </span>
  );
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

/** One business tile. `featured` = large bento tile, `wide` = full-width row tile. */
function DivisionTile({
  d,
  index,
  variant,
  className,
}: {
  d: Division;
  index: number;
  variant: Variant;
  className: string;
}) {
  const Icon = d.icon;
  const soon = d.status === 'soon';
  const isFeatured = variant === 'featured';
  const isWide = variant === 'wide';
  const ctaLabel = soon ? 'Learn more' : isFeatured ? `Explore ${d.name.replace(/^GlofiHub\s+/, '')}` : 'Explore';

  return (
    <div data-reveal data-reveal-d={`${(index % 5) + 1}`} className={`flex ${className}`}>
      <Link
        href={d.href}
        onMouseMove={spotlight}
        className={`group relative flex w-full rounded-3xl bg-foreground/10 p-px shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
      >
        {/* Coloured glow that appears on hover */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 shadow-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 ${d.glow}`}
        />
        {/* Gradient border that fades in on hover / keyboard focus */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 ${d.iconBg}`}
        />

        <div
          className={`relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[23px] bg-card p-6 ${
            isFeatured ? 'sm:p-8 xl:p-10' : 'sm:p-7'
          }`}
        >
          {/* Top accent bar */}
          <span
            aria-hidden
            className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-500 group-hover:opacity-100 ${d.iconBg}`}
          />
          {/* Mouse-follow spotlight */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(${isFeatured ? 320 : 220}px circle at var(--mx, 50%) var(--my, 50%), ${d.spot}, transparent 65%)`,
            }}
          />
          {/* Ghost number */}
          <span
            aria-hidden
            className={`pointer-events-none absolute -bottom-3 right-4 select-none font-display font-extrabold leading-none text-foreground/[0.04] transition-colors group-hover:text-foreground/[0.07] ${
              isFeatured ? 'text-[9rem]' : 'text-7xl'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Icon + status */}
          <div className={`relative flex items-start justify-between gap-3 ${isFeatured ? 'mb-6' : 'mb-5'}`}>
            <span
              className={`flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${d.iconBg} ${
                isFeatured ? 'h-16 w-16' : 'h-14 w-14'
              }`}
            >
              <Icon size={isFeatured ? 30 : 26} className="text-white" aria-hidden />
            </span>
            <StatusBadge soon={soon} />
          </div>

          {/* Title + copy */}
          <h3
            className={`relative font-display font-bold tracking-tight text-foreground ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {d.name}
          </h3>
          <p
            className={`relative mt-1.5 font-semibold tracking-wide text-primary dark:text-accent ${
              isFeatured ? 'text-sm' : 'text-xs'
            }`}
          >
            {d.tagline}
          </p>
          <p
            className={`relative mt-3 leading-relaxed text-foreground/65 ${
              isFeatured ? 'text-sm md:text-base' : 'text-[13px]'
            }`}
          >
            {d.description}
          </p>

          {/* Highlights */}
          {isWide ? (
            <ul className="relative mt-5 flex flex-wrap gap-2">
              {d.highlights.map((h) => (
                <li
                  key={h}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs font-medium text-foreground/75"
                >
                  <Check size={11} strokeWidth={3} className="shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <ul
              className={`relative ${
                isFeatured ? 'mt-6 grid gap-2.5 md:grid-cols-3 xl:grid-cols-1' : 'mt-5 space-y-2.5'
              }`}
            >
              {d.highlights.map((h) => (
                <li
                  key={h}
                  className={`flex items-start gap-2.5 font-medium text-foreground/75 ${
                    isFeatured ? 'text-sm' : 'text-[13px]'
                  }`}
                >
                  <CheckDot />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Stats (featured only) + call to action, pinned to the bottom for equal-height tiles */}
          <div className="relative mt-auto flex flex-col items-stretch gap-5 pt-6">
            {isFeatured && d.stats && d.stats.length > 0 && (
              <dl className="grid grid-cols-3 gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3 sm:p-4">
                {d.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse gap-1.5 text-center">
                    <dt className="text-[10px] font-medium leading-tight text-foreground/60 sm:text-xs">{s.label}</dt>
                    <dd className="font-display text-xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 sm:text-2xl">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {isFeatured ? (
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all group-hover:shadow-xl">
                {ctaLabel}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 self-start text-[13px] font-semibold text-primary dark:text-accent">
                {ctaLabel}
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                />
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

/** Home-page "2nd canvas": one block per GlofiHub business. Driven by lib/divisions.ts. */
export function Divisions() {
  // Bento layout: the `featured` division leads as a large tile (2x2 on xl);
  // if the remaining tiles are an odd number, the last one spans a full row.
  const featured = DIVISIONS.find((d) => d.featured);
  const others = DIVISIONS.filter((d) => d !== featured);
  const ordered = featured ? [featured, ...others] : others;
  const wideIndex = featured && others.length % 2 === 1 ? ordered.length - 1 : -1;

  return (
    <section id="businesses" className="relative bg-background overflow-hidden py-20 md:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Animated mesh + dotted-grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />
        <div
          className="absolute inset-0 opacity-[0.45] dark:opacity-[0.2]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,47,107,0.10) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14" data-reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Sparkles size={14} className="text-primary dark:text-accent" />
            <span className="text-xs font-semibold text-primary dark:text-accent tracking-wide">Our Businesses</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.08]">
            One Group,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Many Possibilities
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/60 leading-relaxed">
            From education and training to trade and technology — explore every GlofiHub business in one place.
          </p>
        </div>

        {/* Bento grid: one tile per business */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-5 lg:gap-6">
          {ordered.map((d, i) => {
            const isFeatured = d === featured;
            const isWide = i === wideIndex;
            const variant: Variant = isFeatured ? 'featured' : isWide ? 'wide' : 'default';
            const span = isFeatured
              ? `sm:col-span-2 xl:col-span-6${others.length >= 3 ? ' xl:row-span-2' : ''}`
              : isWide
                ? 'sm:col-span-2 xl:col-span-6'
                : 'xl:col-span-3';
            return <DivisionTile key={d.slug} d={d} index={i} variant={variant} className={span} />;
          })}
        </div>

        {/* Partner / collaborate CTA band */}
        <div
          data-reveal
          className="relative mt-10 md:mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10"
        >
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl animate-aurora" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">Want to partner or collaborate?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Whether you are a student, a business or a potential partner, our team would love to hear from you.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href={partnerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#0A2F6B] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]"
              >
                <MessageCircle size={16} aria-hidden />
                Talk to our team
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]"
              >
                <Mail size={16} aria-hidden />
                Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
