import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

/**
 * Small building blocks shared by the pages of the five GlofiHub business websites, so every
 * site looks consistent: SiteHero, PageSection, SectionHeading, Accent, CtaBand.
 * Server components — safe to use from any page or layout (no hooks).
 */

export interface KitCta {
  label: string;
  href: string;
  variant?: 'primary' | 'outline' | 'link';
  /** Opens in a new tab (WhatsApp, external sites). */
  external?: boolean;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const FOCUS_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

/** Gradient accent for a word or two inside a heading. */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
      {children}
    </span>
  );
}

/** A call-to-action rendered as a real link (internal -> next/link, external -> <a target=_blank>). */
export function CtaLink({ cta, onDark = false }: { cta: KitCta; onDark?: boolean }) {
  const variant = cta.variant ?? 'primary';
  const base = 'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all motion-reduce:transition-none';
  const focus = onDark ? FOCUS_ON_DARK : FOCUS;
  const styles = onDark
    ? {
        primary: 'btn-shine bg-white px-7 py-3.5 text-[#0A2F6B] shadow-lg hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0',
        outline: 'border border-white/30 px-7 py-3.5 text-white hover:bg-white/10',
        link: 'px-2 py-3.5 text-white/90 underline-offset-4 hover:underline',
      }[variant]
    : {
        primary:
          'btn-shine bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0',
        outline: 'border border-foreground/15 bg-card px-6 py-3.5 text-foreground hover:border-primary/40',
        link: 'px-2 py-3.5 text-primary underline-offset-4 hover:underline dark:text-accent',
      }[variant];
  const className = `${base} ${styles} ${focus}`;
  const content = (
    <>
      {cta.label}
      {variant !== 'outline' && <ArrowRight size={15} aria-hidden />}
      {cta.external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={cta.href} className={className}>
      {content}
    </Link>
  );
}

/**
 * Top-of-page hero. Owns the page's single <h1>. `id` should be `${slug}-home` on a site's home page
 * (the navbar's scroll-spy and "Home" link rely on it). Leaves room for the fixed two-row header.
 */
export function SiteHero({
  id,
  icon: Icon,
  eyebrow,
  badge,
  title,
  lead,
  ctas,
  children,
}: {
  id?: string;
  icon?: LucideIcon;
  eyebrow: string;
  /** Small amber pill under the eyebrow, e.g. "Launching soon". */
  badge?: string;
  title: ReactNode;
  lead: string;
  ctas?: KitCta[];
  children?: ReactNode;
}) {
  return (
    <section id={id} className="relative overflow-hidden px-4 pb-16 pt-36 sm:px-6 md:pb-24 md:pt-44 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-0 h-[45%] w-[40%] animate-aurora rounded-full bg-primary/10 blur-[120px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 h-[45%] w-[40%] animate-aurora rounded-full bg-emerald-500/10 blur-[120px]"
        style={{ animationDelay: '3s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(10,47,107,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center animate-hero-rise motion-reduce:animate-none">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary dark:text-accent">
          {Icon && <Icon size={14} aria-hidden />} {eyebrow}
        </span>
        {badge && (
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-amber-700 dark:text-amber-400">
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500/70 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              {badge}
            </span>
          </div>
        )}
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-5 text-base font-medium leading-relaxed text-foreground/65 md:text-lg">{lead}</p>
        {ctas && ctas.length > 0 && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {ctas.map((c) => (
              <CtaLink key={c.label} cta={c} />
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Consistent page section: vertical rhythm + plain / muted background. Use one <h2> per section. */
export function PageSection({
  id,
  tone = 'plain',
  className = '',
  children,
  labelledBy,
}: {
  id?: string;
  tone?: 'plain' | 'muted';
  className?: string;
  children: ReactNode;
  /** id of the section's heading, for aria-labelledby. */
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative px-4 py-16 sm:px-6 md:py-24 lg:px-8 ${tone === 'muted' ? 'bg-muted/30' : 'bg-background'} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Eyebrow pill + h2 + intro. Pass `title` with <Accent> for the gradient word(s). */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = 'center',
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  align?: 'center' | 'left';
}) {
  const center = align === 'center';
  return (
    <div className={`mb-10 md:mb-12 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`} data-reveal>
      {eyebrow && (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
          <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">{eyebrow}</span>
        </div>
      )}
      <h2 id={id} className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">{intro}</p>}
    </div>
  );
}

/** Closing call-to-action band (navy gradient). */
export function CtaBand({
  title,
  text,
  ctas,
  id,
}: {
  title: string;
  text?: string;
  ctas: KitCta[];
  id?: string;
}) {
  return (
    <section id={id} className="bg-background px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div
        data-reveal
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-8 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 sm:p-10 md:p-12"
      >
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 animate-aurora rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h2>
            {text && <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{text}</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            {ctas.map((c) => (
              <CtaLink key={c.label} cta={{ variant: 'primary', ...c }} onDark />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
