import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StudyStep {
  title: string;
  text: string;
  icon: LucideIcon;
}

/** Icon-tile and connector gradients, cycled by step position. */
const TONES = [
  { tile: 'from-blue-500 to-blue-600', link: 'from-blue-500 to-indigo-500' },
  { tile: 'from-indigo-500 to-violet-600', link: 'from-indigo-500 to-emerald-500' },
  { tile: 'from-emerald-500 to-green-600', link: 'from-emerald-500 to-amber-500' },
  { tile: 'from-amber-500 to-orange-600', link: 'from-amber-500 to-rose-500' },
  { tile: 'from-rose-500 to-pink-600', link: 'from-rose-500 to-pink-600' },
];

/**
 * Numbered journey for the Education pages: a vertical timeline on mobile, one row on large screens.
 * The connector lines draw in when a step scrolls into view (driven by the global `data-reveal`
 * engine); with reduced motion they are simply shown. Server component — no hooks.
 */
export function StudySteps({ steps, label }: { steps: StudyStep[]; label: string }) {
  return (
    <>
      {/* Component-scoped styles: connector "draw-in" + desktop-only stagger */}
      <style>{`
        .study-step { --reveal-delay: 0ms; }
        .study-link {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--reveal-delay, 0ms) + 350ms);
        }
        .reveal-in .study-link { transform: none; }
        @media (min-width: 1024px) {
          .study-step { --reveal-delay: var(--study-d, 0ms); }
          .study-link { transform: scaleX(0); transform-origin: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .study-link { transform: none !important; transition: none !important; }
        }
      `}</style>

      <ol
        role="list"
        aria-label={label}
        className="mx-auto max-w-md lg:grid lg:max-w-none lg:auto-cols-fr lg:grid-flow-col"
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const tone = TONES[i % TONES.length];
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              data-reveal
              style={{ '--study-d': `${80 + i * 90}ms` } as CSSProperties}
              className="study-step group relative flex gap-5 pb-9 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:px-3 lg:pb-0 lg:text-center"
            >
              {/* Connector to the next step */}
              {!isLast && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 left-[31px] top-[4.5rem] w-0.5 overflow-hidden rounded-full bg-foreground/10 lg:bottom-auto lg:left-1/2 lg:top-[31px] lg:h-0.5 lg:w-full"
                >
                  <span className={`study-link block h-full w-full bg-gradient-to-b lg:bg-gradient-to-r ${tone.link}`} />
                </span>
              )}

              {/* Icon tile + step number */}
              <div className="relative z-10 shrink-0">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg shadow-black/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 ${tone.tile}`}
                >
                  <Icon size={28} className="text-white" aria-hidden />
                </span>
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-foreground/10 bg-card text-[10px] font-bold text-foreground shadow-sm"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Copy */}
              <div className="min-w-0 pt-1 lg:pt-5">
                <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
