'use client';

import { useState, useRef } from 'react';
import { X, ArrowRight, Film, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoCard {
  title: string;
  channelName: string;
  avatar: string;
  thumbnail: string;
  bottomText: string;
  accent: string;
  category: string;
  /** Local mp4 plays inline; external cards open the YouTube channel. */
  type: 'local' | 'channel';
  src?: string;
  channelUrl?: string;
}

const EDU_CHANNEL = 'https://www.youtube.com/@glofihub.education';
const CAREER_CHANNEL = 'https://youtube.com/@glofihubcareers';

export function Videos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const videoCards: VideoCard[] = [
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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 300;
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openCard = (card: VideoCard) => {
    if (card.type === 'local' && card.src) {
      setActiveVideo(card.src);
    } else if (card.channelUrl) {
      window.open(card.channelUrl, '_blank');
    }
  };

  return (
    <section id="videos" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Ambient brand aurora */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[45%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Film size={14} className="text-primary" />
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

        {/* Carousel frame — theme card style */}
        <div data-reveal data-reveal-d="1" className="relative rounded-3xl p-5 md:p-8 bg-card border border-foreground/10 shadow-lg shadow-black/5 group/frame">
          {/* Scroll arrows (only when there is more than one video) */}
          {videoCards.length > 1 && (
            <>
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card text-foreground flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/frame:opacity-100 hidden md:flex cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card text-foreground flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/frame:opacity-100 hidden md:flex cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Track */}
          <div
            ref={scrollContainerRef}
            className={`flex gap-4 md:gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full ${videoCards.length <= 1 ? 'justify-center' : ''}`}
          >
            {videoCards.map((card, index) => {
              const isLocal = card.type === 'local';
              return (
                <div
                  key={index}
                  onClick={() => openCard(card)}
                  className={`relative flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] aspect-[9/16] rounded-3xl snap-start group overflow-hidden bg-black cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 ${isLocal ? 'ring-2 ring-emerald-400/70' : 'border border-foreground/10'}`}
                >
                  {/* Thumbnail */}
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/85" />

                  {/* Featured badge for the real local video */}
                  {isLocal && (
                    <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wide shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Featured
                    </span>
                  )}

                  {/* Top: avatar + title */}
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-2.5 z-10">
                    <div className="w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden bg-white flex-shrink-0 shadow-md">
                      <img src={card.avatar} alt="GlofiHub" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-white leading-tight truncate tracking-tight">
                        {card.title}
                      </span>
                      <span className="text-[10px] text-white/75 leading-none font-medium tracking-wide mt-0.5 truncate">
                        {card.channelName}
                      </span>
                    </div>
                  </div>

                  {/* Category chip (hidden when Featured badge present) */}
                  {!isLocal && (
                    <div className="absolute top-[68px] left-4 z-10">
                      <span className="text-[10px] font-semibold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {card.category}
                      </span>
                    </div>
                  )}

                  {/* Play button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    {isLocal ? (
                      <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Play size={26} className="text-primary fill-primary ml-1" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                        <Play size={24} className="text-white fill-white ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom accent strip */}
                  <div className={`absolute bottom-0 left-0 right-0 py-3 px-3 text-center z-10 bg-gradient-to-r ${card.accent}`}>
                    <p className="text-[11px] font-semibold tracking-wide text-white truncate">
                      {card.bottomText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscribe CTAs — theme buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.open(EDU_CHANNEL, '_blank')}
            className="btn-shine group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
            GlofiHub Education <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => window.open(CAREER_CHANNEL, '_blank')}
            className="btn-shine group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-card border border-foreground/15 text-foreground font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-red-600 flex-shrink-0" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
            GlofiHub Skills &amp; Careers <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Local video player modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[9/16] bg-neutral-950 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all hover:scale-110 border border-white/10"
              aria-label="Close video player"
            >
              <X size={20} />
            </button>

            <video
              src={activeVideo}
              poster="/videos/student-experience-poster.jpg"
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
}
