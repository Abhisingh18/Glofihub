import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { DIVISIONS } from '@/lib/divisions';

interface CrossLink {
  /** Slug of the business in lib/divisions.ts (icon, colours and highlights come from there). */
  slug: 'technology' | 'counselling';
  href: string;
  title: string;
  text: string;
  cta: string;
}

const LINKS: CrossLink[] = [
  {
    slug: 'technology',
    href: '/technology',
    title: 'Tech training enquiries',
    text: 'Looking for technology training for your team or organisation? Tell GlofiHub Technology what you need.',
    cta: 'Visit GlofiHub Technology',
  },
  {
    slug: 'counselling',
    href: '/counselling',
    title: 'Medical / FMGE & study guidance',
    text: 'Preparing for Medical / FMGE, or deciding where and what to study? Talk to GlofiHub Counselling for personal guidance.',
    cta: 'Visit GlofiHub Counselling',
  },
];

/** Academy home, section 5: links across to the sibling Technology and Counselling websites. Server component. */
export function AcademyCrossLinks() {
  return (
    <PageSection tone="muted" labelledBy="academy-more-heading">
      <SectionHeading
        id="academy-more-heading"
        eyebrow="Across GlofiHub"
        title={
          <>
            More ways GlofiHub can <Accent>help</Accent>
          </>
        }
        intro="Academy is one of several GlofiHub businesses. These two may be useful alongside your learning."
      />

      <ul role="list" className="grid gap-5 md:grid-cols-2">
        {LINKS.map((l, i) => {
          const division = DIVISIONS.find((d) => d.slug === l.slug);
          const Icon = division?.icon ?? BookOpen;
          return (
            <li key={l.slug} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background dark:has-[a:focus-visible]:ring-blue-300 sm:p-8">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 ${division?.iconBg ?? 'bg-primary'}`}
                  >
                    <Icon size={26} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-foreground/60">{division?.name ?? 'GlofiHub'}</p>
                    <h3 className="mt-0.5 font-display text-xl font-bold leading-tight tracking-tight text-foreground">{l.title}</h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-foreground/70">{l.text}</p>

                {division && division.highlights.length > 0 && (
                  <ul role="list" className="mt-5 flex flex-wrap gap-2">
                    {division.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 text-xs font-semibold text-foreground/75"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {/* No `relative` on this wrapper: the <article> is the containing block of the stretched link. */}
                <div className="mt-auto pt-7">
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-primary focus-visible:outline-none dark:text-accent"
                  >
                    {l.cta}
                    <ArrowRight size={16} aria-hidden className="transition-transform motion-safe:group-hover:translate-x-1" />
                    {/* Stretched link: the whole card is clickable. */}
                    <span aria-hidden className="absolute inset-0" />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
