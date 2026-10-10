import Link from 'next/link';
import { ArrowRight, ChevronRight, Globe } from 'lucide-react';
import { DIVISIONS, type Division } from '@/lib/divisions';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { TRADE_FOCUS } from './TradeContent';

const findDivision = (slug: string): Division | undefined => DIVISIONS.find((d) => d.slug === slug);

/** "Live" / "Launching soon" pill, same look as the other GlofiHub business cards. */
function StatusPill({ status }: { status: Division['status'] }) {
  const soon = status === 'soon';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        soon
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      }`}
    >
      {soon ? 'Launching soon' : 'Live'}
    </span>
  );
}

const CARD =
  'group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-7 shadow-lg shadow-black/5 md:p-8';

/**
 * Home section 5: links to sibling GlofiHub businesses.
 * Technology (CRM / ERP / web / automation systems for a trade business) and Consulting / Global Opportunities.
 */
export function TradeCrossLinks() {
  const technology = findDivision('technology');
  const more = ['consulting', 'global-opportunities'].map(findDivision).filter((d): d is Division => Boolean(d));
  const TechIcon = technology?.icon;

  return (
    <PageSection id="more-from-glofihub" labelledBy="cross-links-heading">
      <SectionHeading
        id="cross-links-heading"
        eyebrow="Across GlofiHub"
        title={
          <>
            More from the <Accent>GlofiHub group</Accent>
          </>
        }
        intro="Import-Export is one of several businesses under GlofiHub. These may be useful alongside it."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {technology && TechIcon && (
          <div data-reveal data-reveal-d="1" className="flex">
            <article
              className={`${CARD} transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:has-[a:focus-visible]:ring-blue-300`}
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 opacity-80 ${technology.iconBg}`} />
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${technology.iconBg}`}>
                  <TechIcon size={22} aria-hidden />
                </span>
                <StatusPill status={technology.status} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/60">{technology.name}</p>
              <h3 className="mt-1.5 font-display text-xl font-extrabold tracking-tight md:text-2xl">Systems for your trade business</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65 md:text-base">
                Need software around your trade operations? GlofiHub Technology builds custom CRM and ERP systems to manage leads,
                staff and operations, along with web, apps and automation.
              </p>
              {/* Stretched link: the ::after covers the whole card (the article is the positioned ancestor). */}
              <Link
                href={technology.href}
                className="mt-auto inline-flex items-center gap-2 self-start pt-7 text-sm font-semibold text-primary after:absolute after:inset-0 focus-visible:outline-hidden dark:text-accent"
              >
                Explore GlofiHub Technology
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </article>
          </div>
        )}

        {more.length > 0 && (
          <div data-reveal data-reveal-d="2" className="flex">
            <article className={CARD}>
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-fuchsia-500 opacity-80" />
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                <Globe size={22} aria-hidden />
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/60">More GlofiHub businesses</p>
              <h3 className="mt-1.5 font-display text-xl font-extrabold tracking-tight md:text-2xl">Beyond trade</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65 md:text-base">
                Looking for business consulting or wider international opportunities? Two more GlofiHub businesses are on the way.
              </p>

              <ul className="mt-6 space-y-3">
                {more.map((d) => {
                  const Icon = d.icon;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={d.href}
                        className={`group/row flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background p-3.5 transition-colors hover:border-primary/30 ${TRADE_FOCUS}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${d.iconBg}`}>
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm font-bold text-foreground">{d.short}</span>
                            <StatusPill status={d.status} />
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-foreground/60">{d.tagline}</span>
                        </span>
                        <ChevronRight
                          size={16}
                          aria-hidden
                          className="shrink-0 text-foreground/40 transition-transform group-hover/row:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/row:translate-x-0"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>
        )}
      </div>
    </PageSection>
  );
}
