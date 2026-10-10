import { Globe, Package, Ship } from 'lucide-react';

/**
 * Small decorative "trade route" for the home hero: a package, a dashed route with a ship sailing along it,
 * and a globe. Purely visual (aria-hidden); the ship stands still when the visitor prefers reduced motion.
 */
export function TradeHeroRoute() {
  return (
    <div aria-hidden className="mx-auto mt-12 flex w-full max-w-xs items-center gap-3 sm:max-w-sm">
      {/* Component-scoped keyframes (see components/Services.tsx for the pattern) */}
      <style>{`
        @keyframes tradeShipSail {
          0% { left: 0%; opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .trade-ship { left: 0; transform: translateX(-50%); animation: tradeShipSail 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .trade-ship { animation: none; left: 50%; opacity: 1; }
        }
      `}</style>

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-foreground/10 bg-card text-orange-600 shadow-md shadow-black/5 dark:text-orange-400">
        <Package size={20} />
      </span>

      <span className="relative h-0 flex-1 border-t-2 border-dashed border-primary/30 dark:border-accent/40">
        <span className="trade-ship absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/30">
          <Ship size={14} />
        </span>
      </span>

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-foreground/10 bg-card text-emerald-600 shadow-md shadow-black/5 dark:text-emerald-400">
        <Globe size={20} />
      </span>
    </div>
  );
}
