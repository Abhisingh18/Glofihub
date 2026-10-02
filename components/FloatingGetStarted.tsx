'use client';

import { useEffect, useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';

/**
 * Premium floating "Get Started" tab (right edge, md+) / pill (mobile) that opens the Get Started modal.
 *
 * Layering: z-40 on purpose, so the chat window (z-50) and its backdrop (z-45) always sit above it.
 * Mobile pill sits above the Chatbot launcher (bottom-6, 64px tall) with a clear gap, and shares its
 * right offset (right-4 / sm:right-6) so the two stay aligned. It stays hidden until the visitor has
 * scrolled past the first screen — the Hero already has its own calls to action there, and the pill
 * would otherwise cover the business chips on small phones.
 */
export function FloatingGetStarted() {
  const open = () => window.dispatchEvent(new CustomEvent('openGetStarted'));
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop: vertical glowing tab on the right edge ── */}
      <button
        type="button"
        onClick={open}
        aria-label="Get started with GlofiHub"
        aria-haspopup="dialog"
        className={`hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 group cursor-pointer rounded-l-2xl ${FOCUS_RING}`}
      >
        {/* Soft glow halo (brightens on hover/focus) */}
        <span aria-hidden className="absolute inset-0 rounded-l-2xl bg-gradient-to-b from-primary to-accent blur-lg opacity-50 group-hover:opacity-90 group-focus-visible:opacity-90 transition-opacity" />

        {/* The tab */}
        <span className="relative flex flex-col items-center gap-2 pl-3.5 pr-3 py-5 rounded-l-2xl overflow-hidden text-white shadow-xl shadow-primary/40 bg-[length:200%_200%] bg-gradient-to-b from-primary via-accent to-primary animate-gradient-text motion-reduce:animate-none group-hover:pr-4 transition-all duration-300">
          {/* Shine sweep */}
          <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full motion-reduce:hidden transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <Sparkles size={13} className="relative opacity-80" />
          <Rocket size={18} className="relative group-hover:-translate-y-1 motion-reduce:group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative text-xs font-extrabold tracking-[0.2em]" style={{ writingMode: 'vertical-rl' }}>
            GET STARTED
          </span>
        </span>
      </button>

      {/* ── Mobile: glowing pill above the chat launcher (appears after the first screen) ── */}
      <button
        type="button"
        onClick={open}
        aria-label="Get started with GlofiHub"
        aria-haspopup="dialog"
        tabIndex={pastHero ? 0 : -1}
        aria-hidden={!pastHero}
        className={`md:hidden fixed bottom-[6.5rem] right-4 sm:right-6 z-40 group cursor-pointer rounded-full transition-all duration-300 motion-reduce:transition-none ${
          pastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        } ${FOCUS_RING}`}
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-md opacity-60" />
        <span className="relative flex items-center gap-1.5 min-h-11 px-4 rounded-full overflow-hidden bg-[length:200%_200%] bg-gradient-to-r from-primary via-accent to-primary animate-gradient-text motion-reduce:animate-none text-white text-xs font-extrabold tracking-wide shadow-lg shadow-primary/40 active:scale-95 transition-transform">
          <Rocket size={14} /> Get Started
        </span>
      </button>
    </>
  );
}
