import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { TRADE_SERVICES_PAGE, getTradeService, type TradeServiceId } from './TradeContent';

// Planned scope only (generic). The fuller bullet lists live on /import-export/services.
const DIRECTIONS: { id: TradeServiceId; kicker: string; text: string; points: string[]; cta: string }[] = [
  {
    id: 'import',
    kicker: 'Bringing goods in',
    text: 'Sourcing from international suppliers? We plan to support you from clarifying your requirement through to coordinating the shipment.',
    points: ['Requirement understanding', 'Supplier connection support', 'Documents & shipment coordination'],
    cta: 'Explore import support',
  },
  {
    id: 'export',
    kicker: 'Reaching markets abroad',
    text: 'Selling to international buyers? We plan to support you from presenting your offer through to coordinating the shipment.',
    points: ['Product & market understanding', 'Buyer connection support', 'Documents & shipment coordination'],
    cta: 'Explore export support',
  },
];

/** Home section 1: two big cards, Import and Export. The whole card is one link (stretched link on the CTA). */
export function TradeDirectionCards() {
  return (
    <PageSection id="what-we-do" labelledBy="what-we-do-heading">
      <SectionHeading
        id="what-we-do-heading"
        eyebrow="What we do"
        title={
          <>
            Support for both <Accent>directions of trade</Accent>
          </>
        }
        intro="Whether you want to buy from international suppliers or sell to buyers abroad, GlofiHub Import-Export is being set up to support you. This is our planned scope."
      />

      <ul className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {DIRECTIONS.map((d, i) => {
          const service = getTradeService(d.id);
          const Icon = service.icon;
          return (
            <li key={d.id} data-reveal data-reveal-d={`${i + 1}`} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-7 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-9 dark:has-[a:focus-visible]:ring-blue-300">
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${service.tile}`} />
                {/* Oversized, very faint watermark of the service icon */}
                <Icon
                  size={170}
                  strokeWidth={1.25}
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-8 text-foreground/[0.04] transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />

                <span
                  className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${service.tile}`}
                >
                  <Icon size={26} aria-hidden />
                </span>
                <p className="relative text-xs font-bold uppercase tracking-widest text-foreground/60">{d.kicker}</p>
                <h3 className="relative mt-1.5 font-display text-2xl font-extrabold tracking-tight md:text-3xl">{service.label}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-foreground/65 md:text-base">{d.text}</p>

                <ul className="relative mt-6 space-y-3">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                      <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${service.soft}`}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                {/* Stretched link: the ::after covers the whole card (the article is the positioned ancestor). */}
                <Link
                  href={`${TRADE_SERVICES_PAGE}#${service.id}`}
                  className="mt-auto inline-flex items-center gap-2 self-start pt-8 text-sm font-semibold text-primary after:absolute after:inset-0 focus-visible:outline-hidden dark:text-accent"
                >
                  {d.cta}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
