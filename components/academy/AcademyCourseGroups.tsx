import { PageSection } from '@/components/site/kit';
import { ACADEMY_GROUPS } from './AcademyData';
import { AcademyLaunchChip } from './AcademyLaunchChip';

/**
 * /academy/courses: the four groups as anchored sections (#technology-ai, #creative-marketing,
 * #languages, #career-medical), each listing its categories as cards with a "Launching soon" chip.
 * Alternates muted / plain backgrounds, starting with muted. Server component.
 */
export function AcademyCourseGroups() {
  return (
    <>
      {ACADEMY_GROUPS.map((g, gi) => {
        const GroupIcon = g.icon;
        // Two categories sit side by side; three (or more) get a third column on large screens.
        const cols = g.items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
        return (
          <PageSection
            key={g.id}
            id={g.id}
            tone={gi % 2 === 0 ? 'muted' : 'plain'}
            labelledBy={`${g.id}-heading`}
            className="scroll-mt-20"
          >
            <div data-reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 md:mb-10">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${g.tile}`}>
                <GroupIcon size={26} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2
                  id={`${g.id}-heading`}
                  className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl"
                >
                  {g.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-foreground/65 md:text-base">{g.blurb}</p>
              </div>
            </div>

            <ul role="list" className={`grid gap-5 ${cols}`}>
              {g.items.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.name} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
                    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${g.tile}`}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${g.chip}`}>
                          <Icon size={22} aria-hidden />
                        </span>
                        <AcademyLaunchChip />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">{c.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/70">{c.description}</p>
                    </article>
                  </li>
                );
              })}
            </ul>
          </PageSection>
        );
      })}
    </>
  );
}
