import type { LucideIcon } from 'lucide-react';

export interface AcademyStep {
  title: string;
  text: string;
  icon: LucideIcon;
}

// Literal class names so Tailwind picks them up.
const LG_COLS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

/**
 * Numbered stepper: a vertical timeline on phones and tablets, a horizontal one on large screens.
 * Used for "How learning works" (home) and "How it works" (teach). Server component.
 */
export function AcademySteps({ steps }: { steps: AcademyStep[] }) {
  return (
    <ol role="list" className={`grid gap-y-8 lg:gap-x-6 lg:gap-y-0 ${LG_COLS[steps.length] ?? 'lg:grid-cols-5'}`}>
      {steps.map((s, i) => {
        const Icon = s.icon;
        const last = i === steps.length - 1;
        return (
          <li key={s.title} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="relative flex gap-4 lg:flex-col lg:gap-5">
            {/* Connector: vertical on small screens, horizontal on large ones. */}
            {!last && (
              <>
                <span
                  aria-hidden
                  className="absolute -bottom-6 left-7 top-16 w-px -translate-x-1/2 bg-gradient-to-b from-emerald-500/50 to-emerald-500/10 lg:hidden"
                />
                <span
                  aria-hidden
                  className="absolute left-16 top-7 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-emerald-500/50 to-emerald-500/10 lg:block"
                />
              </>
            )}

            <div className="relative z-10 shrink-0 self-start">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                <Icon size={24} aria-hidden />
              </span>
              <span
                aria-hidden
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-foreground/10 bg-card text-[11px] font-bold text-foreground shadow-sm"
              >
                {i + 1}
              </span>
            </div>

            <div className="min-w-0 pt-1 lg:pt-0">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
