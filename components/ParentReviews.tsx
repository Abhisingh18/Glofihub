'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Quote, ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';

interface Review {
  name: string;
  city: string;
  text: string;
}

/** First letters of the first two words → avatar initials. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.replace(/[^A-Za-z]/g, '')[0] ?? '';
  const second = parts[1]?.replace(/[^A-Za-z]/g, '')[0] ?? '';
  return (first + second).toUpperCase() || first.toUpperCase();
}

const avatarGradients = [
  'from-primary to-blue-600',
  'from-emerald-500 to-green-600',
  'from-violet-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
];

const reviews: Review[] = [
  {
    name: 'S.P. Karthikeyan',
    city: 'Erode, Tamil Nadu',
    text: 'We were very worried about sending our daughter abroad, but GlofiHub guided us at every step. From admission to visa, the entire process was smooth and well-managed. Today, our daughter is studying safely, and we are truly grateful.',
  },
  {
    name: 'Kamta Yadav',
    city: 'Aurangabad, Bihar',
    text: 'The best thing we experienced was complete transparency. There were no hidden charges, and everything was clearly explained beforehand. The mentor support was also very helpful. It’s rare to find such genuine guidance nowadays.',
  },
  {
    name: 'Ramdeo Bhakt',
    city: 'Gopalganj, Bihar',
    text: 'We come from a small town and had no idea about the international admission process. The team patiently explained everything and supported us throughout. Today, our son is pursuing MBBS in Russia — it feels like a dream come true.',
  },
  {
    name: 'Anjana Tiwari',
    city: 'Indore',
    text: 'We were very confused about choosing the right country and course. GlofiHub didn’t just help with admission, but guided us to make the right decision. That’s what makes them different from others.',
  },
  {
    name: 'Amarjeet Shukla',
    city: 'Bhopal',
    text: 'In today’s time, it’s hard to trust consultants, but here we received honest and pressure-free guidance. We would highly recommend GlofiHub to every parent who wants a secure future for their child.',
  },
];

/** How far (px) one "page" of the carousel scrolls, based on the real rendered card width. */
function getScrollStep(track: HTMLElement) {
  const card = track.querySelector<HTMLElement>('[data-review-card]');
  if (!card) return track.clientWidth * 0.8;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = card.offsetWidth + gap; // offsetWidth ignores hover/reveal transforms
  // Page by however many whole cards fit in view (at least one) so snap points stay aligned.
  return step * Math.max(1, Math.floor((track.clientWidth + gap) / step));
}

const arrowBase =
  'absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 items-center justify-center rounded-full bg-card text-foreground border border-foreground/15 shadow-lg shadow-black/10 transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card';
const arrowEnabled =
  'cursor-pointer hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 motion-reduce:hover:scale-100';
const arrowDisabled = 'cursor-not-allowed opacity-40';

export function ParentReviews() {
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false, scrollable: true });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = {
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= max - 4,
      scrollable: max > 4,
    };
    setEdges((prev) =>
      prev.start === next.start && prev.end === next.end && prev.scrollable === next.scrollable ? prev : next
    );
  }, []);

  // Keep arrow state in sync with layout changes (resize, font load, orientation change).
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges]);

  const scrollTrack = (left: number, relative = true) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    if (relative) el.scrollBy({ left, behavior });
    else el.scrollTo({ left, behavior });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const step = getScrollStep(el);
    scrollTrack(direction === 'left' ? -step : step);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const el = trackRef.current;
    if (!el) return;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        handleScroll('right');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleScroll('left');
        break;
      case 'Home':
        e.preventDefault();
        scrollTrack(0, false);
        break;
      case 'End':
        e.preventDefault();
        scrollTrack(el.scrollWidth - el.clientWidth, false);
        break;
    }
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden"
    >
      {/* Ambient brand aurora — matches Hero/About */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex max-w-full items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <MessageSquare size={14} aria-hidden className="shrink-0 text-primary dark:text-blue-400" />
            <span className="text-xs font-semibold tracking-wide text-primary dark:text-blue-400">
              GlofiHub Education · Words From Parents
            </span>
          </div>
          <h2
            id="reviews-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground"
          >
            Words From Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Clients
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
            Discover firsthand experiences from parents who have secured a successful global future for their children with GlofiHub.
          </p>
        </div>

        {/* Carousel frame — theme card style */}
        <div
          data-reveal
          data-reveal-d="1"
          className="relative rounded-3xl p-4 md:p-8 bg-card border border-foreground/10 shadow-lg shadow-black/5"
        >
          {/* Previous (md+; always visible, keyboard focusable). Touch devices swipe the track. */}
          {edges.scrollable && (
            <button
              type="button"
              onClick={() => !edges.start && handleScroll('left')}
              aria-label="Previous reviews"
              aria-controls={trackId}
              aria-disabled={edges.start}
              className={`${arrowBase} md:-left-5 ${edges.start ? arrowDisabled : arrowEnabled}`}
            >
              <ChevronLeft size={22} aria-hidden />
            </button>
          )}

          {/* Next */}
          {edges.scrollable && (
            <button
              type="button"
              onClick={() => !edges.end && handleScroll('right')}
              aria-label="Next reviews"
              aria-controls={trackId}
              aria-disabled={edges.end}
              className={`${arrowBase} md:-right-5 ${edges.end ? arrowDisabled : arrowEnabled}`}
            >
              <ChevronRight size={22} aria-hidden />
            </button>
          )}

          {/* Scrollable track — focusable so keyboard users can scroll with ← → (also Home/End) */}
          <div
            id={trackId}
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Parent reviews"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onScroll={updateEdges}
            className="flex w-full gap-5 overflow-x-auto overscroll-x-contain rounded-2xl pt-3 pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            {reviews.map((review, index) => (
              <div
                key={review.name}
                role="group"
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${reviews.length}`}
                data-review-card
                className="group relative flex-shrink-0 w-[88%] sm:w-[340px] p-6 sm:p-7 md:p-8 bg-muted/30 rounded-3xl snap-start border border-foreground/10 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 overflow-hidden motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Top accent bar grows on hover */}
                <div aria-hidden className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500 group-hover:w-full motion-reduce:transition-none" />
                {/* Quote watermark */}
                <Quote aria-hidden size={72} className="pointer-events-none absolute -top-1 right-3 text-primary/5 fill-primary/5 transition-all duration-500 group-hover:text-primary/10 group-hover:fill-primary/10 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />

                <div className="relative">
                  {/* Stars */}
                  <div role="img" aria-label="Rated 5 out of 5" className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} aria-hidden className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review text */}
                  <blockquote className="text-sm text-foreground/75 leading-relaxed font-medium">
                    <p>&ldquo;{review.text}&rdquo;</p>
                  </blockquote>
                </div>

                {/* Parent info */}
                <div className="relative border-t border-foreground/10 pt-5 mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-display font-bold text-sm shadow-md`}
                  >
                    {initials(review.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-foreground leading-tight truncate">
                      {review.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary dark:text-blue-400 tracking-wide mt-0.5 truncate">
                      {review.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-foreground/60 font-medium mt-6">
          <span className="md:hidden">Swipe to read more stories</span>
          <span className="hidden md:inline">Use the arrows (or the ← → keys) to read more stories</span>
        </p>
      </div>
    </section>
  );
}
