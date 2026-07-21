'use client';

import { Rocket } from 'lucide-react';

/** Floating "Get Started" tab pinned to the right edge (opens the Get Started modal). */
export function FloatingGetStarted() {
  const open = () => window.dispatchEvent(new CustomEvent('openGetStarted'));

  return (
    <>
      {/* Desktop: vertical tab on the right edge */}
      <button
        onClick={open}
        aria-label="Get Started"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 items-center gap-2 pl-3 pr-2.5 py-4 rounded-l-2xl bg-gradient-to-b from-primary to-accent text-white shadow-xl shadow-primary/30 hover:pr-4 hover:shadow-2xl transition-all cursor-pointer group"
      >
        <span aria-hidden className="absolute inset-0 rounded-l-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex flex-col items-center gap-2">
          <Rocket size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          <span
            className="text-xs font-bold tracking-wider"
            style={{ writingMode: 'vertical-rl' }}
          >
            GET STARTED
          </span>
        </span>
      </button>

      {/* Mobile: compact pill above the chat launcher */}
      <button
        onClick={open}
        aria-label="Get Started"
        className="md:hidden fixed bottom-24 right-4 z-50 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform cursor-pointer"
      >
        <Rocket size={14} /> Get Started
      </button>
    </>
  );
}
