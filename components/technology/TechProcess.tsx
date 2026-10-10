import { Code2, LifeBuoy, PenTool, Rocket, Search, type LucideIcon } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';

/**
 * "How we work" — a generic five-step process (no timelines, no promises) for the Technology
 * website's home page. Vertical timeline on mobile / tablet, horizontal stepper from lg. Server component.
 */
interface Step {
  title: string;
  text: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    title: 'Discover',
    icon: Search,
    text: 'We start by listening — your goals, your users and how your business works today.',
  },
  {
    title: 'Design',
    icon: PenTool,
    text: 'We shape the structure and the experience, and agree the approach with you before building.',
  },
  {
    title: 'Build',
    icon: Code2,
    text: 'We develop step by step and share progress along the way.',
  },
  {
    title: 'Launch',
    icon: Rocket,
    text: 'We test, go live and help your team get started with what we have built.',
  },
  {
    title: 'Support',
    icon: LifeBuoy,
    text: 'After launch we help keep things running smoothly and improve them over time.',
  },
];

export function TechProcess() {
  return (
    <PageSection id="process" tone="plain" labelledBy="tech-process-heading" className="scroll-mt-20">
      <SectionHeading
        id="tech-process-heading"
        eyebrow="How we work"
        title={
          <>
            From first idea to <Accent>go-live</Accent> and beyond
          </>
        }
        intro="A simple five-step approach, adapted to every project."
      />

      <div className="relative mx-auto max-w-2xl lg:max-w-none">
        {/* Connector: vertical behind the badges on small screens, horizontal from lg */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-7 top-7 w-px bg-gradient-to-b from-primary/30 to-primary/5 lg:hidden"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 lg:block"
        />

        <ol role="list" className="relative grid gap-8 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                data-reveal
                data-reveal-d={String(i + 1)}
                className="flex gap-5 lg:flex-col lg:items-center lg:text-center"
              >
                <span
                  aria-hidden
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 ring-4 ring-background"
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0 pt-0.5 lg:pt-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary dark:text-accent">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-tight text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/65">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p data-reveal className="mx-auto mt-12 max-w-xl text-center text-sm font-medium leading-relaxed text-foreground/65">
        Every project is different, so we adapt these steps to fit your goals.
      </p>
    </PageSection>
  );
}
