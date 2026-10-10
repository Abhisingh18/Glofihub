import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EduGroup } from '@/components/education/EduProgramData';
import { EduPlaceTag } from '@/components/education/EduPlaceTag';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const LINK = `inline-flex items-center gap-1.5 rounded py-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-accent ${FOCUS}`;

/**
 * One program group on /education/programs (Medical, Technology, Management, Other): an intro column
 * and a card per program, tagged "India" / "Abroad". The section id is the group id, so
 * /education/programs#medical etc. deep-link to it. Server component.
 */
export function EduProgramGroup({
  group,
  tone,
  askRow = false,
}: {
  group: EduGroup;
  tone: 'plain' | 'muted';
  /** Adds a "Looking for something else?" card after the programs. */
  askRow?: boolean;
}) {
  const Icon = group.icon;
  const headingId = `edu-${group.id}-heading`;

  return (
    <section
      id={group.id}
      aria-labelledby={headingId}
      className={`relative scroll-mt-28 px-4 py-14 sm:px-6 md:py-20 lg:px-8 ${tone === 'muted' ? 'bg-muted/30' : 'bg-background'}`}
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5" data-reveal>
          <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg ${group.tile}`}>
            <Icon size={26} aria-hidden />
          </span>
          <h2 id={headingId} className="mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl">
            {group.heading}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60 md:text-base">{group.intro}</p>
          <p className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground/60">
            Available in
            {group.where.map((w) => (
              <EduPlaceTag key={w} where={w} />
            ))}
          </p>
        </div>

        <ul role="list" className="grid content-start gap-4 lg:col-span-7">
          {group.programs.map((p, i) => (
            <li
              key={p.name}
              data-reveal
              data-reveal-d={i + 1}
              className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-md shadow-black/5 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg motion-reduce:hover:translate-y-0 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-lg font-extrabold tracking-tight sm:text-xl">{p.name}</h3>
                <div className="flex shrink-0 gap-1.5">
                  <span className="sr-only">Available in:</span>
                  {p.where.map((w) => (
                    <EduPlaceTag key={w} where={w} />
                  ))}
                </div>
              </div>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-foreground/60">{p.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-0.5 border-t border-foreground/10 pt-3">
                {p.where.includes('india') && (
                  <Link href="/education/study-in-india" className={LINK}>
                    Study in India
                    <ArrowRight size={15} aria-hidden />
                    <span className="sr-only"> for {p.name}</span>
                  </Link>
                )}
                {p.where.includes('abroad') && (
                  <Link href="/education/study-abroad" className={LINK}>
                    Study abroad
                    <ArrowRight size={15} aria-hidden />
                    <span className="sr-only"> for {p.name}</span>
                  </Link>
                )}
              </div>
            </li>
          ))}

          {askRow && (
            <li
              data-reveal
              data-reveal-d={group.programs.length + 1}
              className="rounded-2xl border border-dashed border-foreground/20 bg-card/60 p-5 sm:p-6"
            >
              <h3 className="font-display text-lg font-extrabold tracking-tight sm:text-xl">Looking for something else?</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-foreground/60">
                Tell a counsellor what you have in mind and we will help you find the right pathway.
              </p>
              <div className="mt-3">
                <Link href="/counselling" className={LINK}>
                  Talk to a counsellor
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
