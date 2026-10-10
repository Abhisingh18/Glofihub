import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { DIVISIONS } from '@/lib/divisions';

/**
 * "Technology for every GlofiHub business" — cross-links from the Technology website to the sibling
 * GlofiHub websites. What each card lists is described purely as a possibility ("Could include"),
 * never as something that already exists. Name, icon, colours, link and launch status come from
 * lib/divisions.ts, so the "Launching soon" badge stays honest. Server component.
 */

const CARD_FOCUS =
  'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary dark:has-[a:focus-visible]:ring-blue-300 has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background';

interface Possibility {
  /** Division slug (lib/divisions.ts). */
  slug: string;
  /** One-line summary of what technology could do for that business. */
  headline: string;
  ideas: string[];
}

const POSSIBILITIES: Possibility[] = [
  {
    slug: 'education',
    headline: 'CRM, chat & follow-up automation',
    ideas: [
      'A CRM that keeps every enquiry and follow-up in one place',
      'Chat assistants that answer common questions and capture leads',
      'Automated reminders and status updates for students',
    ],
  },
  {
    slug: 'counselling',
    headline: 'Tools for counselling teams',
    ideas: [
      'Dashboards that show where each student stands',
      'Secure messaging and document sharing',
      'Deadline reminders that run on their own',
    ],
  },
  {
    slug: 'academy',
    headline: 'Platforms for learning',
    ideas: [
      'Course and live-class platforms for learners',
      'Sign-up, scheduling and reminder automation',
      'Progress and certificate tracking',
    ],
  },
  {
    slug: 'import-export',
    headline: 'Systems for trade',
    ideas: [
      'Dashboards to follow orders and shipments',
      'Document management for trade paperwork',
      'Portals for buyers and partners',
    ],
  },
];

export function TechEcosystem() {
  const cards = POSSIBILITIES.flatMap((p) => {
    const division = DIVISIONS.find((d) => d.slug === p.slug);
    return division ? [{ ...p, division }] : [];
  });

  return (
    <PageSection id="group" tone="muted" labelledBy="tech-group-heading" className="scroll-mt-20">
      <SectionHeading
        id="tech-group-heading"
        eyebrow="Part of the GlofiHub group"
        title={
          <>
            Technology for every <Accent>GlofiHub business</Accent>
          </>
        }
        intro="Every GlofiHub business can work smarter with the right tools. Here is what technology could make possible for each one — ideas to explore together, not announcements."
      />

      <ul role="list" className="grid gap-5 md:grid-cols-2">
        {cards.map(({ division: d, headline, ideas }, i) => {
          const Icon = d.icon;
          const headingId = `tech-group-${d.slug}`;
          return (
            <li key={d.slug} data-reveal data-reveal-d={String((i % 2) + 1)}>
              <article
                aria-labelledby={headingId}
                className={`group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7 ${CARD_FOCUS}`}
              >
                {/* Business colour glow (from lib/divisions.ts) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                  style={{ background: `radial-gradient(420px circle at 100% 0%, ${d.spot}, transparent 65%)` }}
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${d.iconBg}`}
                  >
                    <Icon size={22} />
                  </span>
                  {d.status === 'soon' && (
                    <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700 dark:text-amber-400">
                      Launching soon
                    </span>
                  )}
                </div>

                <h3 id={headingId} className="mt-5 font-display text-xl font-bold leading-tight text-foreground">
                  {d.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary dark:text-accent">{headline}</p>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-foreground/60">Could include</p>
                <ul role="list" className="mt-2.5 space-y-2.5">
                  {ideas.map((idea) => (
                    <li key={idea} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-foreground/70">
                      <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {idea}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  {/* Stretched link: the whole card is clickable; the keyboard focus ring is drawn on the card. */}
                  <Link
                    href={d.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary after:absolute after:inset-0 focus-visible:outline-none dark:text-accent"
                  >
                    Visit {d.name}
                    <ArrowRight
                      size={15}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    />
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
