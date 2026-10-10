import { TECH_CATEGORIES } from './TechData';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Quick-jump chips shown under the hero's calls to action — one per focus area, each linking to
 * its card further down the home page (<TechCategories /> gives every card the category id).
 * Server component.
 */
export function TechHeroChips() {
  return (
    <nav aria-label="Jump to a focus area" className="mt-10">
      <ul role="list" className="flex flex-wrap items-center justify-center gap-2">
        {TECH_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <li key={cat.id}>
              <a
                href={`#${cat.id}`}
                className={`inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 px-3.5 py-2 text-[13px] font-semibold text-foreground/75 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS}`}
              >
                <Icon size={14} aria-hidden className="text-primary dark:text-accent" />
                {cat.short}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
