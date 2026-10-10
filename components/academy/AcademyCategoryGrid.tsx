import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Accent, CtaLink, PageSection, SectionHeading } from '@/components/site/kit';
import { ACADEMY_GROUPS } from './AcademyData';

/**
 * Academy home, section 2: the course categories in four themed groups. Each group card links to its
 * anchored section on /academy/courses (#technology-ai, #creative-marketing, #languages, #career-medical).
 * Server component.
 */
export function AcademyCategoryGrid() {
  return (
    <PageSection id="course-categories" tone="plain" labelledBy="academy-categories-heading" className="scroll-mt-20">
      <SectionHeading
        id="academy-categories-heading"
        eyebrow="Course categories"
        title={
          <>
            Pick a path. Build the <Accent>skill</Accent>.
          </>
        }
        intro="Our course areas are grouped into themes. Open a group to see what we are planning."
      />

      <ul role="list" className="grid gap-5 md:grid-cols-2">
        {ACADEMY_GROUPS.map((g, i) => {
          const GroupIcon = g.icon;
          return (
            <li key={g.id} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
              <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background dark:has-[a:focus-visible]:ring-blue-300 sm:p-8">
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${g.tile}`}
                />
                <GroupIcon
                  aria-hidden
                  size={168}
                  strokeWidth={1.25}
                  className="pointer-events-none absolute -bottom-8 -right-8 text-foreground opacity-[0.05]"
                />

                <div className="relative flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 ${g.tile}`}
                  >
                    <GroupIcon size={26} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground">{g.title}</h3>
                    <p className="mt-1 text-sm font-medium text-foreground/65">{g.blurb}</p>
                  </div>
                </div>

                <ul role="list" className="relative mt-6 flex flex-wrap gap-2">
                  {g.items.map((c) => {
                    const ItemIcon = c.icon;
                    return (
                      <li
                        key={c.name}
                        className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-foreground/85 sm:text-sm"
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${g.chip}`}>
                          <ItemIcon size={14} aria-hidden />
                        </span>
                        {c.name}
                      </li>
                    );
                  })}
                </ul>

                {/* No `relative` here: the <article> is the containing block of the stretched link below. */}
                <div className="mt-auto pt-7">
                  <Link
                    href={`/academy/courses#${g.id}`}
                    className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-primary focus-visible:outline-none dark:text-accent"
                  >
                    View courses
                    <span className="sr-only"> in {g.title}</span>
                    <ArrowRight size={16} aria-hidden className="transition-transform motion-safe:group-hover:translate-x-1" />
                    {/* Stretched link: the whole card is clickable. */}
                    <span aria-hidden className="absolute inset-0" />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div data-reveal className="mt-10 flex justify-center">
        <CtaLink cta={{ label: 'View all courses', href: '/academy/courses', variant: 'outline' }} />
      </div>
    </PageSection>
  );
}
