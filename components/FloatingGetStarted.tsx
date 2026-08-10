'use client';

import { Rocket, Sparkles } from 'lucide-react';

/** Premium floating "Get Started" tab (right edge) that opens the Get Started modal. */
export function FloatingGetStarted() {
  const open = () => window.dispatchEvent(new CustomEvent('openGetStarted'));

  return (
    <>
      {/* ── Desktop: vertical glowing tab on the right edge ── */}
      <button
        onClick={open}
        aria-label="Get Started"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 group cursor-pointer"
      >
        {/* Pulsing glow halo */}
        <span aria-hidden className="absolute inset-0 rounded-l-2xl bg-gradient-to-b from-primary to-accent blur-lg opacity-60 group-hover:opacity-90 animate-pulse" />

        {/* The tab */}
        <span className="relative flex flex-col items-center gap-2 pl-3.5 pr-3 py-5 rounded-l-2xl overflow-hidden text-white shadow-xl shadow-primary/40 bg-[length:200%_200%] bg-gradient-to-b from-primary via-accent to-primary animate-gradient-text group-hover:pr-4 transition-all duration-300">
          {/* Shine sweep */}
          <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <Sparkles size={13} className="relative opacity-80 animate-pulse" />
          <Rocket size={18} className="relative group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="relative text-xs font-extrabold tracking-[0.2em]" style={{ writingMode: 'vertical-rl' }}>
            GET STARTED
          </span>
        </span>
      </button>

      {/* ── Mobile: glowing pill above the chat launcher ── */}
      <button
        onClick={open}
        aria-label="Get Started"
        className="md:hidden fixed bottom-24 right-4 z-50 group cursor-pointer"
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-md opacity-70 animate-pulse" />
        <span className="relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full overflow-hidden bg-[length:200%_200%] bg-gradient-to-r from-primary via-accent to-primary animate-gradient-text text-white text-xs font-extrabold tracking-wide shadow-lg shadow-primary/40 active:scale-95 transition-transform">
          <Rocket size={14} /> Get Started
        </span>
      </button>
    </>
  );
}
