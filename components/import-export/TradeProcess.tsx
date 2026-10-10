import { Info } from 'lucide-react';
import { Accent, CtaLink, PageSection } from '@/components/site/kit';
import { TRADE_ENQUIRY, TRADE_STEPS } from './TradeContent';

/**
 * Home section 3: "How it works" — a connected vertical stepper next to a sticky intro.
 * `id="process"` is the target of the navbar's "How it works" link (lib/sites.ts).
 * Clearly labelled as the PLANNED process: wording stays generic and makes no promises.
 */
export function TradeProcess() {
  const last = TRADE_STEPS.length - 1;
  return (
    <PageSection id="process" labelledBy="process-heading" className="scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Intro (sticky on large screens) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <div data-reveal>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
                <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">The planned process</span>
              </div>
              <h2
                id="process-heading"
                className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl"
              >
                How it <Accent>works</Accent>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60 md:text-base">
                From your first enquiry to follow-up after delivery, this is the process we are planning for GlofiHub
                Import-Export.
              </p>
              <p className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4 text-[13px] leading-relaxed text-foreground/70">
                <Info size={16} aria-hidden className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                It may be refined as the service launches, and not every step will apply to every requirement.
              </p>
              <div className="mt-7">
                <CtaLink cta={{ label: 'Share your requirement', href: TRADE_ENQUIRY }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stepper: numbered nodes joined by a gradient line */}
        <ol className="space-y-4 md:space-y-5 lg:col-span-7">
          {TRADE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="relative pl-14 md:pl-[4.5rem]">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-white shadow-lg shadow-primary/25 ring-4 ring-background md:h-12 md:w-12 md:text-base"
                >
                  {i + 1}
                </span>
                {i < last && (
                  <span
                    aria-hidden
                    className="absolute -bottom-4 left-[19px] top-10 w-0.5 rounded-full bg-gradient-to-b from-primary/50 to-accent/25 md:-bottom-5 md:left-[23px] md:top-12"
                  />
                )}

                <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-md shadow-black/5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg motion-reduce:transition-none md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-bold leading-snug tracking-tight md:text-lg">{step.title}</h3>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary dark:text-accent"
                    >
                      <Icon size={18} />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </PageSection>
  );
}
