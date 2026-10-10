import { Accent, PageSection } from '@/components/site/kit';
import { TRADE_AUDIENCE } from './TradeContent';

/** Home section 4: "Who it's for" — a split card with the audience as chips. Generic, no client names. */
export function TradeAudience() {
  return (
    <PageSection id="who-its-for" tone="muted" labelledBy="audience-heading">
      <div
        data-reveal
        className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-7 shadow-lg shadow-black/5 md:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 animate-aurora rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 animate-aurora rounded-full bg-emerald-500/10 blur-3xl"
          style={{ animationDelay: '3s' }}
        />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">Built for trade</span>
            </div>
            <h2
              id="audience-heading"
              className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl"
            >
              Who it&apos;s <Accent>for</Accent>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">
              GlofiHub Import-Export is being set up for businesses and organisations that buy or sell internationally, whatever
              their size.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3 lg:col-span-7">
            {TRADE_AUDIENCE.map(({ label, icon: Icon }, i) => (
              <li
                key={label}
                data-reveal
                data-reveal-d={`${(i % 5) + 1}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-background py-2 pl-2 pr-4 text-sm font-semibold text-foreground/85 shadow-sm"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"
                >
                  <Icon size={15} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageSection>
  );
}
