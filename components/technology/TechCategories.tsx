import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { TECH_CATEGORIES } from './TechData';

/**
 * The five GlofiHub Technology focus areas with everything inside each one — the main section of
 * the Technology website's home page. Unlike the tabbed <TechnologySection /> (parent-site home) every
 * category is visible at once and server-rendered. Each card carries the category id, so the hero
 * chips and /technology#<id> links jump straight to it. Server component.
 */

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

interface Tone {
  /** Sub-item icon box. */
  chip: string;
  /** Hairline along the card's top edge. */
  line: string;
  /** Card hover border. */
  hover: string;
}

/** Colour accents per category id (presentation only — the gradient tile comes from TechData). */
const TONES: Record<string, Tone> = {
  'web-app-development': {
    chip: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    line: 'via-sky-500/60',
    hover: 'hover:border-sky-500/40',
  },
  'ai-automation': {
    chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    line: 'via-violet-500/60',
    hover: 'hover:border-violet-500/40',
  },
  'business-systems': {
    chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    line: 'via-emerald-500/60',
    hover: 'hover:border-emerald-500/40',
  },
  'digital-growth': {
    chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    line: 'via-amber-500/60',
    hover: 'hover:border-amber-500/40',
  },
  'saas-product': {
    chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    line: 'via-blue-500/60',
    hover: 'hover:border-blue-500/40',
  },
};
const DEFAULT_TONE: Tone = TONES['web-app-development'];

interface CardLayout {
  /** Grid span: a 6-column grid on lg (2 wide cards, then 3 narrower ones), 2 columns on md. */
  span: string;
  /** Sub-item columns — they depend on how wide the card ends up at each breakpoint. */
  items: string;
  /** Reveal stagger (1–5), restarting on each row. */
  delay: '1' | '2' | '3';
}

const LAYOUT: CardLayout[] = [
  { span: 'lg:col-span-3', items: 'sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2', delay: '1' },
  { span: 'lg:col-span-3', items: 'sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2', delay: '2' },
  { span: 'lg:col-span-2', items: 'sm:grid-cols-2 md:grid-cols-1', delay: '1' },
  { span: 'lg:col-span-2', items: 'sm:grid-cols-2 md:grid-cols-1', delay: '2' },
  { span: 'md:col-span-2 lg:col-span-2', items: 'sm:grid-cols-2 lg:grid-cols-1', delay: '3' },
];

export function TechCategories() {
  return (
    <PageSection id="focus-areas" tone="muted" labelledBy="tech-focus-heading" className="scroll-mt-20">
      <SectionHeading
        id="tech-focus-heading"
        eyebrow="What we build"
        title={
          <>
            Five focus areas, <Accent>everything inside</Accent>
          </>
        }
        intro="From websites and apps to AI, business systems, digital growth and SaaS — see what each focus area covers."
      />

      <ul role="list" className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {TECH_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const tone = TONES[cat.id] ?? DEFAULT_TONE;
          const layout = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1];
          const headingId = `${cat.id}-heading`;
          return (
            // data-reveal on the <li>, hover effects on the inner card, so the reveal
            // transition never fights the hover transition.
            <li key={cat.id} data-reveal data-reveal-d={layout.delay} className={layout.span}>
              <article
                id={cat.id}
                aria-labelledby={headingId}
                className={`group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8 ${tone.hover}`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent ${tone.line} to-transparent`}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-3 select-none font-display text-7xl font-extrabold leading-none text-foreground/[0.04]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative flex items-start gap-4">
                  <span
                    aria-hidden
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.tile} text-white shadow-lg md:h-14 md:w-14`}
                  >
                    <Icon size={24} />
                  </span>
                  <div className="min-w-0">
                    <h3
                      id={headingId}
                      className="font-display text-xl font-bold leading-tight text-foreground md:text-2xl"
                    >
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground/65">{cat.tagline}</p>
                  </div>
                </div>

                <ul role="list" className={`relative mt-6 grid gap-2.5 ${layout.items}`}>
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <li
                        key={item.name}
                        className="flex items-start gap-3 rounded-2xl border border-foreground/[0.07] bg-muted/40 p-3.5 dark:bg-muted/25"
                      >
                        <span
                          aria-hidden
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.chip}`}
                        >
                          <ItemIcon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-sm font-bold leading-tight text-foreground">{item.name}</p>
                          <p className="mt-1 text-[13px] font-medium leading-relaxed text-foreground/65">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="relative mt-auto pt-6">
                  <Link
                    href={`/technology/services#${cat.id}`}
                    className={`inline-flex items-center gap-1.5 rounded-md py-1 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-accent ${FOCUS}`}
                  >
                    See all {cat.title} services
                    <ArrowUpRight
                      size={15}
                      aria-hidden
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                    />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <p data-reveal className="mx-auto mt-10 max-w-xl text-center text-sm font-medium leading-relaxed text-foreground/65">
        Looking for branding, PR &amp; media or ready-made website packages?{' '}
        <Link
          href="/technology/services"
          className={`rounded-sm font-semibold text-primary underline underline-offset-4 hover:no-underline dark:text-accent ${FOCUS}`}
        >
          See the full services list
        </Link>
        .
      </p>
    </PageSection>
  );
}
