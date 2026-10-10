import { DIVISIONS } from '@/lib/divisions';

/** Radius of the ring the vertical icons sit on, in % of the square canvas. */
const RING = 38;

const NODES = DIVISIONS.map((d, i) => {
  const angle = ((-90 + (360 / DIVISIONS.length) * i) * Math.PI) / 180;
  return {
    d,
    x: Number((50 + RING * Math.cos(angle)).toFixed(2)),
    y: Number((50 + RING * Math.sin(angle)).toFixed(2)),
    delay: `${(i % 4) * 0.9}s`,
  };
});

/**
 * Decorative "gateway" illustration for the About hero: the GlofiHub mark in the
 * middle, one icon tile per ecosystem vertical around it. Purely visual — the
 * linked version of the same list is the Ecosystem section further down.
 */
export function EcosystemOrbit() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[26rem] select-none">
      {/* Soft glow behind the mark */}
      <div className="absolute inset-[22%] rounded-full bg-primary/20 blur-3xl animate-aurora" />

      {/* Ring + spokes */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary" fill="none">
        <circle cx="50" cy="50" r={RING} stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="1.5 2.5" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {NODES.map(({ d, x, y }) => (
          <line key={d.slug} x1="50" y1="50" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      {/* Centre mark (white badge so the navy logo reads in dark mode too) */}
      <div className="absolute left-1/2 top-1/2 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-[3%] shadow-2xl shadow-primary/20 ring-1 ring-black/5">
        <img src="/logo/logo.png" alt="" width={500} height={500} decoding="async" className="h-full w-full object-contain" />
      </div>

      {/* Vertical tiles */}
      {NODES.map(({ d, x, y, delay }) => (
        <div key={d.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
          <div
            className={`animate-float-soft flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ring-4 ring-background sm:h-14 sm:w-14 ${d.iconBg}`}
            style={{ animationDelay: delay }}
          >
            <d.icon size={22} aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
