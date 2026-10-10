import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Accent, CtaLink, PageSection, SectionHeading } from '@/components/site/kit';
import { EDU_GROUPS } from '@/components/education/EduProgramData';
import { EduPlaceTag } from '@/components/education/EduPlaceTag';

/**
 * Home page, section 1 — the four education pathways (Medical, Technology, Management, Other Programs)
 * with the programs inside each, tagged "India" / "Abroad". Each card links to its block on
 * /education/programs. Server component.
 */
export function EduPathways() {
  return (
    <PageSection id="pathways" tone="muted" labelledBy="edu-pathways-heading" className="scroll-mt-28">
      <SectionHeading
        id="edu-pathways-heading"
        eyebrow="Pathways"
        title={
          <>
            Find your <Accent>pathway</Accent>
          </>
        }
        intro="Four pathways, with programs in India, abroad or both. Pick one to see what is available."
      />

      <ul role="list" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {EDU_GROUPS.map((g, i) => {
          const Icon = g.icon;
          return (
            <li
              key={g.id}
              data-reveal
              data-reveal-d={i + 1}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:hover:translate-y-0 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background dark:has-[:focus-visible]:ring-blue-300"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none ${g.glow}`}
              />

              <span className={`relative grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${g.tile}`}>
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-extrabold tracking-tight">{g.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-foreground/60">{g.summary}</p>

              <ul role="list" className="relative mt-5 space-y-3 border-t border-foreground/10 pt-5">
                {g.programs.map((p) => (
                  <li key={p.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="flex gap-1.5">
                      <span className="sr-only">Available in:</span>
                      {p.where.map((w) => (
                        <EduPlaceTag key={w} where={w} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Stretched link: the whole card is clickable (the link is deliberately not positioned). */}
              <Link
                href={`/education/programs#${g.id}`}
                className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-primary after:absolute after:inset-0 after:content-[''] focus-visible:outline-none dark:text-accent"
              >
                <span className="underline-offset-4 group-hover:underline">Explore {g.title}</span>
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex justify-center" data-reveal>
        <CtaLink cta={{ label: 'View all programs', href: '/education/programs', variant: 'outline' }} />
      </div>
    </PageSection>
  );
}
