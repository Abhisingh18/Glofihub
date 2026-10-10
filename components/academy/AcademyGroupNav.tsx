import Link from 'next/link';
import { ACADEMY_GROUPS } from './AcademyData';

/** Jump links to the group sections of /academy/courses. Rendered inside the page hero. Server component. */
export function AcademyGroupNav() {
  return (
    <nav aria-label="Course groups" className="mt-8">
      <ul role="list" className="flex flex-wrap items-center justify-center gap-2">
        {ACADEMY_GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <li key={g.id}>
              <Link
                href={`#${g.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-foreground/80 shadow-sm shadow-black/5 transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none dark:focus-visible:ring-blue-300"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${g.tile}`}>
                  <Icon size={14} aria-hidden />
                </span>
                {g.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
