'use client';

import { useRef } from 'react';
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

export function ParentReviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 360;
      const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      {/* Ambient brand aurora — matches Hero/About */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">Words From Parents</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
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
          className="relative rounded-3xl p-5 md:p-8 bg-card border border-foreground/10 shadow-lg shadow-black/5 group/frame"
        >
          {/* Left scroll trigger */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card text-foreground flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/frame:opacity-100 hidden md:flex cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right scroll trigger */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card text-foreground flex items-center justify-center border border-foreground/10 shadow-xl hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/frame:opacity-100 hidden md:flex cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 w-[300px] sm:w-[340px] p-7 md:p-8 bg-muted/30 rounded-3xl snap-start border border-foreground/10 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 overflow-hidden"
              >
                {/* Top accent bar grows on hover */}
                <div aria-hidden className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500 group-hover:w-full" />
                {/* Quote watermark */}
                <Quote aria-hidden size={72} className="absolute -top-1 right-3 text-primary/5 fill-primary/5 transition-all duration-500 group-hover:text-primary/10 group-hover:fill-primary/10 group-hover:scale-110" />

                <div className="relative">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-foreground/75 leading-relaxed font-medium">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                {/* Parent info */}
                <div className="relative border-t border-foreground/10 pt-5 mt-6 flex items-center gap-3">
                  <span
                    className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-display font-bold text-sm shadow-md`}
                  >
                    {initials(review.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-foreground leading-tight truncate">
                      {review.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary tracking-wide mt-0.5 truncate">
                      {review.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-foreground/40 font-medium mt-6">
          Swipe or use the arrows to read more stories
        </p>
      </div>
    </section>
  );
}
