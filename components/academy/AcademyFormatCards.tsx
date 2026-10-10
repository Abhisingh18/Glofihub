import { Info } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { ACADEMY_FORMATS } from './AcademyData';

/** Academy home, section 1: the four planned learning formats as cards. Server component. */
export function AcademyFormatCards() {
  return (
    <PageSection tone="muted" labelledBy="academy-formats-heading">
      <SectionHeading
        id="academy-formats-heading"
        eyebrow="Ways to learn"
        title={
          <>
            Learn the way that <Accent>suits you</Accent>
          </>
        }
        intro="GlofiHub Academy is being built around flexible learning formats, so you can choose what fits your goals and your routine."
      />

      <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ACADEMY_FORMATS.map((f, i) => {
          const Icon = f.icon;
          return (
            <li key={f.title} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${f.tile}`}
                />
                <Icon
                  aria-hidden
                  size={120}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute -bottom-6 -right-6 text-foreground opacity-[0.05]"
                />

                <span
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:scale-105 ${f.tile}`}
                >
                  <Icon size={26} aria-hidden />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold tracking-tight text-foreground">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-foreground/70">{f.text}</p>
              </article>
            </li>
          );
        })}
      </ul>

      <p
        data-reveal
        className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 text-center text-xs font-medium leading-relaxed text-foreground/65 md:text-sm"
      >
        <Info size={15} aria-hidden className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>Every format is launching soon. We will share course details as the Academy opens.</span>
      </p>
    </PageSection>
  );
}
