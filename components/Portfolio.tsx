'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, ArrowRight, Star, GraduationCap, Briefcase, Globe, Users, Quote, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Count-up number that animates each time it scrolls into view. */
function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  const target = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setN(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) run();
          else setN(0);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function Portfolio() {
  const testimonials: {
    name: string;
    location: string;
    text: string;
    category: string;
    icon: LucideIcon;
  }[] = [
    {
      name: 'Aarav Patel',
      location: 'MBBS - Russia',
      text: 'Achieved my dream of studying medicine at a top-ranked Russian university with full support for visa and documentation.',
      category: 'Education Abroad',
      icon: GraduationCap
    },
    {
      name: 'Priya Sharma',
      location: 'Dentistry - Kazan, Russia',
      text: 'The pre-departure guidance and on-ground student care hostel support in Russia made my medical journey completely stress-free.',
      category: 'Medical Internship',
      icon: Briefcase
    },
    {
      name: 'Rohan Kumar',
      location: 'B.Tech CSE - Moscow, Russia',
      text: 'Studying engineering at a Russian Federal University opened world-class technical exposure with bilingual medium support.',
      category: 'Technical Studies',
      icon: Globe
    },
  ];

  const stats: { number: string; label: string; icon: LucideIcon }[] = [
    { number: '1000+', label: 'Students Guided', icon: Users },
    { number: '15+', label: 'Russian Partner Universities', icon: Globe },
    { number: '95%', label: 'Visa Success Rate', icon: Award },
    { number: '20+', label: 'Local Support Hostels', icon: Star },
  ];

  return (
    <section id="portfolio" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <style>{`
        @keyframes starPop {
          from { opacity: 0; transform: scale(0) rotate(-45deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        .star-pop { opacity: 0; animation: starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      {/* Ambient brand aurora — matches Hero/About */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div data-reveal className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">Success Stories</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Student{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Transformations
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium max-w-2xl">
            Meet the students and professionals who achieved their dreams through our platform. Real stories, real results.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {testimonials.map((t, index) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                data-reveal
                data-reveal-d={`${index + 1}`}
                className="group relative p-6 md:p-8 rounded-3xl bg-card border border-foreground/10 shadow-lg shadow-black/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
              >
                {/* Top accent bar grows on hover */}
                <div aria-hidden className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500 group-hover:w-full" />

                {/* Quote watermark */}
                <Quote
                  aria-hidden
                  size={84}
                  className="absolute -top-2 right-3 text-primary/5 fill-primary/5 transition-all duration-500 group-hover:text-primary/10 group-hover:fill-primary/10 group-hover:scale-110"
                />

                <div className="relative">
                  {/* Icon box */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-primary/25 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={24} />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        size={15}
                        className="star-pop text-amber-400 fill-amber-400"
                        style={{ animationDelay: `${index * 120 + s * 80 + 200}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-primary tracking-wide mb-2">{t.category}</p>
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground tracking-tight leading-tight mb-3">
                    {t.name}
                    <br />
                    <span className="text-sm font-medium text-foreground/55">{t.location}</span>
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                    &quot;{t.text}&quot;
                  </p>

                  <button
                    onClick={() => window.open(`https://wa.me/919241168875?text=${encodeURIComponent('Hi GlofiHub, I want to know more about ' + t.name + ' success story')}`, '_blank')}
                    className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm tracking-wide transition-all hover:gap-4 cursor-pointer group/link"
                  >
                    Learn More
                    <ArrowRight className="transition-transform group-hover/link:translate-x-1" size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                data-reveal
                data-reveal-d={`${i + 1}`}
                className="group relative p-6 rounded-3xl bg-card border border-foreground/10 text-center overflow-hidden shadow-lg shadow-black/5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative">
                  <div className="flex justify-center mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-blue-600 group-hover:scale-110">
                      <Icon size={20} className="text-primary transition-colors duration-500 group-hover:text-white" />
                    </span>
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-emerald-500 leading-none mb-1.5">
                    <CountUp value={s.number} />
                  </div>
                  <div className="text-foreground/55 text-[11px] font-medium tracking-wide">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
