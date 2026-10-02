'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { X, ArrowRight, Film, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoCard {
  title: string;
  channelName: string;
  avatar: string;
  thumbnail: string;
  bottomText: string;
  accent: string;
  category: string;
  /** Local mp4 plays inline in a modal; external cards open the YouTube channel. */
  type: 'local' | 'channel';
  src?: string;
  channelUrl?: string;
}

const EDU_CHANNEL = 'https://www.youtube.com/@glofihub.education';
const CAREER_CHANNEL = 'https://youtube.com/@glofihubcareers';

const VIDEO_CARDS: VideoCard[] = [
  {
    type: 'local',
    title: 'Real Student Experience',
    category: 'Real Footage',
    avatar: '/logo/logo.png',
    channelName: 'GlofiHub',
    thumbnail: '/videos/student-experience-poster.jpg',
    src: '/videos/student-experience.mp4',
    bottomText: 'Straight From Our Students',
    accent: 'from-emerald-600 to-green-700',
  },
];

const FOCUSABLE = 'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])';

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

/** Visual face shared by the button (local video) and anchor (channel) card variants. */
function CardFace({ card }: { card: VideoCard }) {
  const isLocal = card.type === 'local';
  return (
    <>
      {/* Thumbnail */}
      <img
        src={card.thumbnail}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 transition-transform duration-700"
      />
      {/* Vignette */}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/85" />

      {/* Featured badge for the real local video */}
      {isLocal && (
        <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wide shadow-lg">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" /> Featured
        </span>
      )}

      {/* Top: avatar + title */}
      <span className="absolute top-4 left-4 right-14 flex items-center gap-2.5 z-10 text-left">
        <span className="block w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden bg-white flex-shrink-0 shadow-md">
          <img
            src={card.avatar}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </span>
        <span className="flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-white leading-tight truncate tracking-tight">{card.title}</span>
          <span className="text-[10px] text-white/80 leading-none font-medium tracking-wide mt-0.5 truncate">{card.channelName}</span>
        </span>
      </span>

      {/* Category chip (hidden when Featured badge present) */}
      {!isLocal && (
        <span className="absolute top-[68px] left-4 z-10">
          <span className="text-[10px] font-semibold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            {card.category}
          </span>
        </span>
      )}

      {/* Play button */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {isLocal ? (
          <span className="flex w-16 h-16 bg-white/95 rounded-full items-center justify-center shadow-xl group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none transition-all duration-300">
            <Play size={26} aria-hidden className="text-primary fill-primary ml-1" />
          </span>
        ) : (
          <span className="flex w-14 h-14 bg-red-600 rounded-2xl items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-110 group-hover:bg-red-500 group-focus-visible:scale-110 motion-reduce:transition-none transition-all duration-300">
            <Play size={24} aria-hidden className="text-white fill-white ml-0.5" />
          </span>
        )}
      </span>

      {/* Bottom accent strip */}
      <span className={`absolute bottom-0 left-0 right-0 block py-3 px-3 text-center z-10 bg-gradient-to-r ${card.accent}`}>
        <span className="block text-[11px] font-semibold tracking-wide text-white truncate">{card.bottomText}</span>
      </span>
    </>
  );
}

export function Videos() {
  const [activeVideo, setActiveVideo] = useState<VideoCard | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const isSingle = VIDEO_CARDS.length <= 1;

  const closeVideo = useCallback(() => setActiveVideo(null), []);
  const openVideo = (card: VideoCard, opener: HTMLElement) => {
    openerRef.current = opener;
    setActiveVideo(card);
  };

  useModalA11y({
    open: activeVideo !== null,
    onClose: closeVideo,
    dialogRef,
    initialFocusRef: closeButtonRef,
    returnFocusRef: openerRef,
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) scrollByCards(scrollContainerRef.current, direction);
  };

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card text-foreground hidden md:flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-0 group-hover/frame:opacity-100 group-focus-within/frame:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none';

  const cardClass = (isLocal: boolean) =>
    `group relative block flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] aspect-[9/16] rounded-3xl snap-start overflow-hidden bg-black cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-accent ${
      isLocal ? 'ring-2 ring-emerald-400/70' : 'border border-foreground/10'
    } ${isSingle ? 'mx-auto' : ''}`;

  const ctaFocus =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100';

  return (
    <section id="videos" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[45%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Film size={14} aria-hidden className="text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">Student Guide &amp; Experience</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Our Latest{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Videos
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
            Discover student visa success journeys, university guidelines, direct career paths, and skill training videos straight from our counselors and global partners.
          </p>
        </div>

        {/* Carousel frame — theme card style (compact when there is a single video) */}
        <div
          data-reveal
          data-reveal-d="1"
          className={`relative rounded-3xl p-5 md:p-8 bg-card border border-foreground/10 shadow-lg shadow-black/5 group/frame ${isSingle ? 'max-w-xl mx-auto' : ''}`}
        >
          {/* Scroll arrows (only when there is more than one video) */}
          {!isSingle && (
            <>
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className={`${arrowClass} left-3`}
                aria-label="Scroll videos left"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className={`${arrowClass} right-3`}
                aria-label="Scroll videos right"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
            </>
          )}

          {/* Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pt-2 pb-2 scroll-smooth motion-reduce:scroll-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
          >
            {VIDEO_CARDS.map((card) =>
              card.type === 'local' ? (
                <button
                  key={card.title}
                  type="button"
                  onClick={(e) => openVideo(card, e.currentTarget)}
                  aria-label={`Play video: ${card.title}`}
                  aria-haspopup="dialog"
                  className={cardClass(true)}
                >
                  <CardFace card={card} />
                </button>
              ) : (
                <a
                  key={card.title}
                  href={card.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${card.title} — opens YouTube in a new tab`}
                  className={cardClass(false)}
                >
                  <CardFace card={card} />
                </a>
              ),
            )}
          </div>
        </div>

        {/* Subscribe CTAs — theme buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href={EDU_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-shine group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer ${ctaFocus}`}
          >
            <svg aria-hidden="true" className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
            GlofiHub Education
            <span className="sr-only"> on YouTube (opens in a new tab)</span>
            <ArrowRight size={15} aria-hidden className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
          </a>

          <a
            href={CAREER_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-shine group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-card border border-foreground/15 text-foreground font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer ${ctaFocus}`}
          >
            <svg aria-hidden="true" className="w-4 h-4 fill-red-600 flex-shrink-0" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
            GlofiHub Skills &amp; Careers
            <span className="sr-only"> on YouTube (opens in a new tab)</span>
            <ArrowRight size={15} aria-hidden className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
          </a>
        </div>
      </div>

      {/* Local video player modal — the <video> only mounts (and downloads) once opened */}
      {activeVideo && activeVideo.src && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300 motion-reduce:animate-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeVideo();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Video player: ${activeVideo.title}`}
            className="relative aspect-[9/16] bg-neutral-950 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 motion-reduce:animate-none"
            style={{ width: 'min(100%, 400px, calc((100dvh - 2rem) * 9 / 16))' }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeVideo}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all hover:scale-110 border border-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              aria-label="Close video player"
            >
              <X size={20} aria-hidden />
            </button>

            <video
              src={activeVideo.src}
              poster={activeVideo.thumbnail}
              aria-label={activeVideo.title}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}
    </section>
  );
}
