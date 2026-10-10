import { FileCheck, HandCoins, LifeBuoy, Luggage, University, type LucideIcon } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';

interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
}

/**
 * The five parts of GlofiHub's education approach (existing copy), laid out in the order they happen:
 * pre-departure orientation comes before the on-ground support that starts once the student arrives.
 */
const STEPS: Step[] = [
  {
    icon: University,
    title: 'University selection & application guidance',
    text: 'Shortlist universities and colleges that fit your profile, with help through each application.',
  },
  {
    icon: HandCoins,
    title: 'Scholarship & financial aid assistance',
    text: 'Understand scholarship and financial-aid options, with education-loan guidance.',
  },
  {
    icon: FileCheck,
    title: 'Visa documentation & interview prep',
    text: 'Get help with your visa documents and prepare for the visa interview.',
  },
  {
    icon: Luggage,
    title: 'Pre-departure orientation & planning',
    text: 'Get oriented and plan your move before you travel.',
  },
  {
    icon: LifeBuoy,
    title: 'On-ground support in host countries',
    text: 'Support after you arrive, in Russia, Georgia, Uzbekistan, Kazakhstan and Kyrgyzstan.',
  },
];

/**
 * Home page, section 3 — "How the journey works": a five-step stepper. A vertical timeline on small
 * screens, one row from lg up. The connector lines sit in the gaps between steps. Server component.
 */
export function EduJourney() {
  return (
    <PageSection id="journey" tone="muted" labelledBy="edu-journey-heading" className="scroll-mt-28">
      <SectionHeading
        id="edu-journey-heading"
        eyebrow="Your journey"
        title={
          <>
            How the journey <Accent>works</Accent>
          </>
        }
        intro="Five steps of support, from choosing a university to on-ground help after you arrive."
      />

      <ol role="list" className="grid gap-8 lg:grid-cols-5 lg:gap-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={s.title} data-reveal data-reveal-d={i + 1} className="group relative flex gap-4 lg:flex-col lg:gap-5">
              {/* Connector to the next step: vertical on small screens, horizontal from lg. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute -bottom-6 left-6 top-14 w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 to-primary/10 lg:bottom-auto lg:left-[3.75rem] lg:top-6 lg:h-px lg:w-[calc(100%_-_3rem)] lg:translate-x-0 lg:bg-gradient-to-r"
                />
              )}

              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <Icon size={22} aria-hidden />
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-card text-[11px] font-extrabold text-primary ring-2 ring-primary/30 dark:text-accent"
                >
                  {i + 1}
                </span>
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-base font-extrabold leading-snug tracking-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </PageSection>
  );
}
