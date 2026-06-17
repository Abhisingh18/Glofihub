'use client';

import { useEffect } from 'react';

/**
 * Global, dependency-free scroll-reveal engine.
 *
 * Any element marked with `data-reveal` starts hidden (handled in globals.css)
 * and gets `.reveal-in` the first time it scrolls into view, triggering a
 * smooth fade + rise. Honors `prefers-reduced-motion` via CSS.
 *
 * Uses a single shared IntersectionObserver for the whole page and a
 * MutationObserver so elements rendered later (modals, tab switches) are
 * picked up automatically.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.classList.add('reveal-in');
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-in)')
        .forEach((el) => io.observe(el));
    };

    observeAll();

    // Catch elements that mount after the initial pass.
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
