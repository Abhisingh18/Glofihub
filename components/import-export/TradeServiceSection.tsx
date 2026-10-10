import { Check } from 'lucide-react';
import { Accent, CtaLink, PageSection } from '@/components/site/kit';
import { TRADE_ENQUIRY, type TradeService } from './TradeContent';

/**
 * One anchored section of /import-export/services (`id` = import | export | documentation | logistics).
 * Split layout: the story + call to action on one side, the planned scope as a checklist card on the other;
 * `index` flips the sides so the page does not feel repetitive.
 */
export function TradeServiceSection({
  service,
  index,
  total,
  tone,
}: {
  service: TradeService;
  index: number;
  total: number;
  tone: 'plain' | 'muted';
}) {
  const Icon = service.icon;
  const flip = index % 2 === 1;
  const headingId = `${service.id}-heading`;
  const count = (n: number) => String(n).padStart(2, '0');

  return (
    <PageSection id={service.id} tone={tone} labelledBy={headingId} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
          <div data-reveal>
            <span
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${service.tile}`}
            >
              <Icon size={26} aria-hidden />
            </span>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground/60">
              Service {count(index + 1)} of {count(total)}
            </p>
            <h2 id={headingId} className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl">
              {service.heading[0]} <Accent>{service.heading[1]}</Accent>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/65 md:text-base">{service.detail}</p>
            <div className="mt-7">
              <CtaLink cta={{ label: service.cta, href: TRADE_ENQUIRY }} />
            </div>
          </div>
        </div>

        <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
          <div
            data-reveal
            data-reveal-d="2"
            className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 md:p-8"
          >
            <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.tile}`} />
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/60">
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${service.tile}`} />
              What it&apos;s planned to cover
            </p>
            <ul className="space-y-4">
              {service.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] font-medium leading-relaxed text-foreground/80">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${service.soft}`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
