import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { PageSection } from '@/components/site/kit';

export interface AcademyFormPoint {
  icon: LucideIcon;
  text: string;
}

/**
 * Split layout for the two enquiry forms (courses, teach): a short intro with a few points on the left,
 * the <LeadForm> (passed as children, it renders its own <h2>) on the right. Server component.
 */
export function AcademyFormSection({
  id,
  tone = 'muted',
  eyebrow,
  icon: EyebrowIcon,
  intro,
  points,
  children,
}: {
  id: string;
  tone?: 'plain' | 'muted';
  eyebrow: string;
  icon: LucideIcon;
  intro: string;
  points: AcademyFormPoint[];
  children: ReactNode;
}) {
  return (
    <PageSection id={id} tone={tone} className="scroll-mt-20">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="lg:col-span-5">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
            <EyebrowIcon size={14} className="text-primary dark:text-accent" aria-hidden />
            <span className="text-xs font-semibold tracking-wide text-primary dark:text-accent">{eyebrow}</span>
          </div>
          <p className="text-base font-medium leading-relaxed text-foreground/75 md:text-lg">{intro}</p>

          <ul role="list" className="mt-7 space-y-4">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.text} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="pt-1.5 text-sm font-medium leading-snug text-foreground/80">{p.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div data-reveal data-reveal-d="1" className="min-w-0 lg:col-span-7">
          {children}
        </div>
      </div>
    </PageSection>
  );
}
