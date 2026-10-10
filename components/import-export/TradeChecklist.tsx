import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { TRADE_PREPARE } from './TradeContent';

/** "Before you enquire" — a generic checklist of what is useful to have at hand (services page). */
export function TradeChecklist() {
  return (
    <PageSection id="before-you-enquire" tone="muted" labelledBy="prepare-heading" className="scroll-mt-20">
      <SectionHeading
        id="prepare-heading"
        eyebrow="What to prepare"
        title={
          <>
            Before you <Accent>enquire</Accent>
          </>
        }
        intro="The more you can share, the easier it is for us to understand your requirement. Don't worry if you don't have everything yet. Share what you know."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRADE_PREPARE.map(({ title, text, icon: Icon }, i) => (
          <li key={title} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
            <div className="flex w-full items-start gap-4 rounded-2xl border border-foreground/10 bg-card p-5 shadow-md shadow-black/5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg motion-reduce:transition-none">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary dark:text-accent"
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold tracking-tight">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground/65">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
