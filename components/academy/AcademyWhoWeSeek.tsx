import { Briefcase, GraduationCap } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { ACADEMY_GROUPS } from './AcademyData';

const PROFILES = [
  {
    title: 'Subject teachers and trainers',
    text: 'Educators who teach a subject or skill and want to reach learners online.',
    icon: GraduationCap,
    tile: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    title: 'People working in the field today',
    text: 'Industry professionals who can share practical, real-world experience from their own work.',
    icon: Briefcase,
    tile: 'bg-gradient-to-br from-sky-500 to-blue-600',
  },
];

/** Teach page, "Who we are looking for": two generic profiles plus the course areas we are building. Server component. */
export function AcademyWhoWeSeek() {
  return (
    <PageSection tone="muted" labelledBy="teach-who-heading">
      <SectionHeading
        id="teach-who-heading"
        eyebrow="Our faculty"
        title={
          <>
            Who we are <Accent>looking for</Accent>
          </>
        }
        intro="GlofiHub Academy is building a faculty that brings together classroom experience and real-world practice."
      />

      <ul role="list" className="grid gap-5 md:grid-cols-2">
        {PROFILES.map((p, i) => {
          const Icon = p.icon;
          return (
            <li key={p.title} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
              <article className="group relative flex w-full items-start gap-4 overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:p-8">
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${p.tile}`}
                />
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 ${p.tile}`}
                >
                  <Icon size={26} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.text}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div
        data-reveal
        className="mt-6 rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground">Course areas we are building</h3>
        <p className="mt-1 text-sm text-foreground/70">Your subject is not listed? Tell us about it in the application below.</p>

        <ul role="list" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMY_GROUPS.map((g) => (
            <li key={g.id}>
              <p className="text-xs font-semibold tracking-wide text-foreground/60">{g.title}</p>
              <ul role="list" className="mt-3 flex flex-wrap gap-2">
                {g.items.map((c) => {
                  const ItemIcon = c.icon;
                  return (
                    <li key={c.name} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${g.chip}`}>
                      <ItemIcon size={14} aria-hidden />
                      {c.name}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </PageSection>
  );
}
