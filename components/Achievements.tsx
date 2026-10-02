'use client';

import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { Award, ChevronLeft, ChevronRight, X, Sparkles, ArrowUpRight, ShieldCheck, Globe, Handshake, Star, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  image: string;
  year: string;
  tag: string;
  icon: LucideIcon;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Counseling Excellence Recognition',
    description: 'Honored for outstanding student counseling and end-to-end admission guidance across India and abroad.',
    image: '/achievement/achievement-1.jpeg',
    year: '2025',
    tag: 'Counseling',
    icon: Award,
  },
  {
    title: 'Premium Student Service Award',
    description: 'Recognized for exceptional pre-departure care, on-ground support, and complete student wellbeing.',
    image: '/achievement/achievement-2.jpeg',
    year: '2025',
    tag: 'Service',
    icon: HeartHandshake,
  },
  {
    title: 'Global Education Impact',
    description: 'Acknowledged for expanding international education access for students from every corner of India.',
    image: '/achievement/achievement-3.jpeg',
    year: '2025',
    tag: 'Impact',
    icon: Globe,
  },
  {
    title: 'Trusted Partner Certification',
    description: 'Certified collaboration with leading global universities and premier medical institutions.',
    image: '/achievement/achievement-4.jpeg',
    year: '2024',
    tag: 'Partnership',
    icon: Handshake,
  },
  {
    title: 'Visa Success Milestone',
    description: 'Celebrating a 95%+ visa success rate backed by seamless documentation and interview support.',
    image: '/achievement/achievement-5.jpeg',
    year: '2024',
    tag: 'Milestone',
    icon: ShieldCheck,
  },
  {
    title: 'Community Trust Honour',
    description: 'Earned for transparent, pressure-free guidance trusted by thousands of families nationwide.',
    image: '/achievement/achievement-6.jpeg',
    year: '2024',
    tag: 'Trust',
    icon: Star,
  },
];

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Modal accessibility: Esc closes, focus moves into the dialog and is trapped,
 * focus returns to the opener on close, and the page behind cannot scroll.
 */
function useModalA11y({
  open,
  onClose,
  dialogRef,
  initialFocusRef,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const opener = returnFocusRef.current;
    initialFocusRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && dialog.contains(active);
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      if (opener && opener.isConnected) opener.focus();
    };
  }, [open, onClose, dialogRef, initialFocusRef, returnFocusRef]);
}

/** Scroll a carousel by the number of fully visible cards, measured from the real card width. */
function scrollByCards(container: HTMLElement, direction: 'left' | 'right') {
  const first = container.firstElementChild as HTMLElement | null;
  const gap = parseFloat(getComputedStyle(container).columnGap) || 0;
  const step = first ? first.getBoundingClientRect().width + gap : container.clientWidth * 0.8;
  const visibleCards = Math.max(1, Math.floor(container.clientWidth / step));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  container.scrollBy({
    left: (direction === 'left' ? -1 : 1) * step * visibleCards,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}

export function Achievements() {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [lightboxImage, setLightboxImage] = useState<Achievement | null>(null);
  const titleId = useId();

  const closeLightbox = useCallback(() => setLightboxImage(null), []);
  const openLightbox = (item: Achievement, opener: HTMLElement) => {
    openerRef.current = opener;
    setLightboxImage(item);
  };

  useModalA11y({
    open: lightboxImage !== null,
    onClose: closeLightbox,
    dialogRef,
    initialFocusRef: closeButtonRef,
    returnFocusRef: openerRef,
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) scrollByCards(scrollContainerRef.current, direction);
  };

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-card text-foreground hidden md:flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none';

  const LightboxIcon = lightboxImage?.icon;

  return (
    <section id="achievements" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[45%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Sparkles size={14} aria-hidden className="text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">Recognitions &amp; Milestones</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Achievements &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Awards
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
            Recognitions we&apos;ve earned along the way — for counseling performance, premium student service, and global impact.
          </p>
        </div>

        {/* Carousel */}
        <div data-reveal data-reveal-d="1" className="relative group/carousel">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className={`${arrowClass} left-2 lg:-left-5`}
            aria-label="Previous achievements"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className={`${arrowClass} right-2 lg:-right-5`}
            aria-label="Next achievements"
          >
            <ChevronRight size={22} aria-hidden />
          </button>

          {/* Track */}
          <ul
            ref={scrollContainerRef}
            role="list"
            aria-label="Achievements and awards"
            className="flex gap-5 md:gap-6 overflow-x-auto pt-2 pb-4 scroll-smooth motion-reduce:scroll-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
          >
            {ACHIEVEMENTS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex-shrink-0 w-[290px] sm:w-[360px] md:w-[440px] snap-start">
                  <button
                    type="button"
                    onClick={(e) => openLightbox(item, e.currentTarget)}
                    aria-label={`View certificate: ${item.title} (${item.year})`}
                    aria-haspopup="dialog"
                    className="group/card relative block w-full aspect-[4/3] rounded-3xl overflow-hidden bg-card text-left cursor-pointer shadow-lg shadow-black/5 border border-foreground/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 transition-all duration-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
                  >
                    {/* Blurred background fill */}
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-50"
                    />
                    {/* Sharp foreground image */}
                    <img
                      src={item.image}
                      alt={`${item.title}, ${item.year} recognition`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-700 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
                    />

                    {/* Top chips: icon + tag (left), year (right) — fade on hover / keyboard focus */}
                    <span className="absolute top-4 left-4 flex items-center gap-2 transition-opacity duration-300 group-hover/card:opacity-0 group-focus-visible/card:opacity-0">
                      <span className="w-9 h-9 rounded-xl bg-primary/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                        <Icon size={16} aria-hidden />
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/85 dark:bg-black/50 backdrop-blur-md text-foreground text-[11px] font-semibold tracking-wide shadow-sm">
                        {item.tag}
                      </span>
                    </span>
                    <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/85 dark:bg-black/50 backdrop-blur-md text-primary text-[11px] font-bold tracking-wide shadow-sm transition-opacity duration-300 group-hover/card:opacity-0 group-focus-visible/card:opacity-0">
                      {item.year}
                    </span>

                    {/* Rich overlay — hover or keyboard focus */}
                    <span className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/55 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 transition-all duration-400 motion-reduce:transition-none">
                      <span className="text-[11px] font-bold text-emerald-300 tracking-wide mb-2">
                        Awarded in {item.year}
                      </span>
                      <span className="block font-display text-white font-bold text-lg md:text-xl tracking-tight leading-tight">
                        {item.title}
                      </span>
                      <span className="block text-white/85 text-sm mt-2 leading-relaxed font-medium">
                        {item.description}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-white text-xs font-semibold tracking-wide">
                        View Certificate <ArrowUpRight size={15} aria-hidden />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-foreground/60 font-medium mt-6">
          Hover or focus a card for details • tap or press Enter to view the full certificate
        </p>
      </div>

      {/* Lightbox */}
      {lightboxImage && LightboxIcon && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300 motion-reduce:animate-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-2xl bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 motion-reduce:animate-none"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all hover:scale-110 border border-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              aria-label="Close details"
            >
              <X size={20} aria-hidden />
            </button>

            <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain">
              <div className="aspect-[4/3] w-full relative bg-neutral-900">
                <img
                  src={lightboxImage.image}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-50"
                />
                <img
                  src={lightboxImage.image}
                  alt={`${lightboxImage.title}, ${lightboxImage.year} recognition`}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-contain object-top"
                />
              </div>

              <div className="p-7 md:p-8 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <LightboxIcon size={15} aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-primary tracking-wide">
                    Milestone Recognized — {lightboxImage.year}
                  </span>
                </div>
                <h3 id={titleId} className="font-display text-xl md:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  {lightboxImage.title}
                </h3>
                <p className="text-foreground/70 text-sm mt-3 leading-relaxed font-medium">
                  {lightboxImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
