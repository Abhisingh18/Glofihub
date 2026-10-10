import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { TRADE_FOCUS, TRADE_SERVICES, TRADE_SERVICES_PAGE, type TradeService } from './TradeContent';

/**
 * The service areas are read from `categories` of the import-export business in lib/divisions.ts
 * (Import, Export, Trade Documentation, Logistics Support). A category without matching copy in
 * TradeContent is skipped; if nothing matches, all services are shown.
 */
function serviceAreas(): TradeService[] {
  const labels = DIVISIONS.find((d) => d.slug === 'import-export')?.categories ?? [];
  const matched = labels
    .map((label) => TRADE_SERVICES.find((s) => s.label === label))
    .filter((s): s is TradeService => Boolean(s));
  return matched.length > 0 ? matched : TRADE_SERVICES;
}

/** Home section 2: four compact cards, each linking to its anchored section on /import-export/services. */
export function TradeServiceAreas() {
  const areas = serviceAreas();
  return (
    <PageSection id="service-areas" tone="muted" labelledBy="service-areas-heading">
      <SectionHeading
        id="service-areas-heading"
        eyebrow="Service areas"
        title={
          <>
            Support across the <Accent>trade journey</Accent>
          </>
        }
        intro="The areas GlofiHub Import-Export is being set up to cover. Scope may change as we get closer to launch."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((service, i) => {
          const Icon = service.icon;
          return (
            <li key={service.id} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
              <Link
                href={`${TRADE_SERVICES_PAGE}#${service.id}`}
                className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${TRADE_FOCUS}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80 transition-opacity group-hover:opacity-100 ${service.tile}`}
                />
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 ${service.tile}`}
                  >
                    <Icon size={22} aria-hidden />
                  </span>
                  <span aria-hidden className="font-display text-xs font-bold tracking-widest text-foreground/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{service.label}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">{service.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[13px] font-semibold text-primary dark:text-accent">
                  View details
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
