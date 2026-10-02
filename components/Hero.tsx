'use client';

import Link from 'next/link';
import { ArrowDown, Sparkles, Play, X, ShieldCheck, Users, Globe, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { DIVISIONS } from '@/lib/divisions';
import { SITE } from '@/lib/site';

interface CountryPointer {
  name: string;
  image: string;
  link: string;
}

/** Dynamic count-up that replays every time it scrolls into view. */
function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

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
      const duration = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
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
  }, [target]);

  return <span ref={ref} className={className}>{n}{suffix}</span>;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Hero() {
  const whatsappLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi from GlofiHub website')}`;
  const [showVideo, setShowVideo] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  // Video modal: Esc closes, focus moves to the close button, Tab is trapped,
  // page scroll is locked, and focus returns to the play button on close.
  useEffect(() => {
    if (!showVideo) return;

    const trigger = playBtnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowVideo(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [showVideo]);

  const countries: CountryPointer[] = [
    { name: 'Russia', image: '/flags/russia.png', link: '#contact' },
    { name: 'Georgia', image: '/flags/georgia.png', link: '#contact' },
    { name: 'Uzbekistan', image: '/flags/uzbekistan.png', link: '#contact' },
    { name: 'Kazakhstan', image: '/flags/kazakhstan.png', link: '#contact' },
    { name: 'Kyrgyzstan', image: '/flags/kyrgyzstan.png', link: '#contact' },
  ];

  const stats = [
    { value: '1000+', label: 'Students Guided', icon: Users },
    { value: '10+', label: 'Countries Reached', icon: Globe },
    { value: '95%', label: 'Visa Success Rate', icon: ShieldCheck },
  ];

  const line1 = ['One', 'Group.'];

  return (
    <>
      {/* ════════════ GROUP HERO ════════════ */}
      <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 scroll-mt-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/70 dark:from-[#0a1124] dark:via-[#0b1530] dark:to-[#0a2150]">
        {/* Background photo (brand-tinted, whitish wash keeps text readable) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bg/hero-bg.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center opacity-100 dark:opacity-70 animate-kenburns motion-reduce:animate-none select-none"
          />
          {/* Light gradient wash (top + bottom) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/10 to-white/55 dark:from-[#0a1124]/70 dark:via-[#0b1530]/30 dark:to-[#0a2150]/85" />
          {/* Small screens: text spans the full width, so use an even wash */}
          <div className="absolute inset-0 bg-white/50 dark:bg-[#0a1124]/55 md:hidden" />
          {/* Central light column — keeps text in the gap between the two people */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_56%_72%_at_50%_50%,rgba(255,255,255,0.88),rgba(255,255,255,0.45)_55%,transparent_78%)] dark:bg-[radial-gradient(ellipse_56%_72%_at_50%_50%,rgba(10,17,36,0.82),rgba(10,17,36,0.45)_55%,transparent_78%)]" />
        </div>

        {/* Dotted grid texture (fades toward edges) */}
        <div
          className="absolute inset-0 z-0 opacity-[0.5] dark:opacity-[0.25]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,47,107,0.10) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
          }}
        />
        {/* Ambient brand aurora glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#2563EB]/12 dark:bg-[#2563EB]/25 rounded-full blur-[130px] animate-aurora z-0" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-[#22d3ee]/12 dark:bg-[#60A5FA]/20 rounded-full blur-[130px] animate-aurora z-0" style={{ animationDelay: '4s' }} />

        {/* Content (centered column, text sits between the two people) */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow badge — group tagline */}
          <div className="animate-hero-rise inline-flex max-w-full items-center gap-2 px-4 py-2 rounded-full bg-primary/8 dark:bg-white/10 border border-primary/15 dark:border-white/15 backdrop-blur-md mb-7" style={{ animationDelay: '0.05s' }}>
            <Sparkles size={14} className="shrink-0 text-primary dark:text-blue-300 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            <span className="text-xs font-bold text-primary dark:text-white/90 tracking-wide">{SITE.tagline}</span>
          </div>

          {/* Headline (word-by-word rise + gradient + underline draw) */}
          <h1 className="font-display text-[2rem] min-[420px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            <span className="sr-only">{SITE.name}: </span>
            <span className="block">
              {line1.map((word, i) => (
                <span
                  key={word}
                  className={`inline-block animate-hero-rise${i < line1.length - 1 ? ' mr-[0.28em]' : ''}`}
                  style={{ animationDelay: `${0.12 + i * 0.09}s` }}
                >
                  <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    {word}
                  </span>
                </span>
              ))}
            </span>
            <span className="block animate-hero-rise mt-1.5" style={{ animationDelay: '0.3s' }}>
              <span className="relative inline-block pb-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 animate-gradient-text">
                  Many Businesses.
                </span>
                {/* animated underline */}
                <span className="absolute left-0 -bottom-0.5 h-[3px] w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 animate-underline" />
              </span>
            </span>
          </h1>

          {/* Subcopy */}
          <p className="animate-hero-rise mt-6 text-sm sm:text-base text-foreground/75 leading-relaxed font-medium max-w-xl" style={{ animationDelay: '0.45s' }}>
            GlofiHub is one group with four businesses — Education, Academy, Export–Import and Digital — built to open doors for students, professionals and companies worldwide.
          </p>

          {/* CTAs + Play */}
          <div className="animate-hero-rise mt-8 w-full flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.55s' }}>
            <a
              href="#businesses"
              className={`btn-shine group w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-primary to-accent dark:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0 transition-all duration-300 inline-flex items-center justify-center gap-2 ${FOCUS_RING}`}
            >
              Explore Our Businesses
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Talk to us on WhatsApp (opens in a new tab)"
              className={`group w-full sm:w-auto px-7 py-4 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border-2 border-foreground/25 dark:border-white/25 text-foreground font-bold text-sm tracking-wide hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 inline-flex items-center justify-center gap-2 ${FOCUS_RING}`}
            >
              <MessageCircle size={16} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              Talk to Us
            </a>

            {/* Play button */}
            <button
              ref={playBtnRef}
              type="button"
              onClick={() => setShowVideo(true)}
              className={`group relative flex items-center gap-3 rounded-full cursor-pointer ${FOCUS_RING}`}
              aria-label="Watch our story"
              aria-haspopup="dialog"
            >
              <span className="relative flex items-center justify-center w-14 h-14">
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ripple" />
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ripple" style={{ animationDelay: '1.2s' }} />
                <span className="relative w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                  <Play size={20} className="fill-current ml-0.5" aria-hidden="true" />
                </span>
              </span>
              <span className="text-left text-[11px] font-bold text-foreground/75 tracking-wide group-hover:text-foreground transition-colors pr-2">
                Watch<br />Our Story
              </span>
            </button>
          </div>

          {/* Tertiary: AI assistant */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
            className={`animate-hero-rise group mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/75 hover:text-primary dark:hover:text-blue-300 transition-colors cursor-pointer ${FOCUS_RING}`}
            style={{ animationDelay: '0.65s' }}
          >
            <Sparkles size={13} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
            <span className="underline-offset-4 group-hover:underline">Not sure where to start? Ask our AI assistant</span>
          </button>

          {/* Business chips — quick links to every GlofiHub business */}
          <nav aria-label="Our businesses" className="animate-hero-rise mt-7 w-full" style={{ animationDelay: '0.75s' }}>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {DIVISIONS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={d.href}
                    className={`group inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-foreground/10 dark:border-white/15 text-xs font-semibold text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/40 dark:hover:border-blue-300/50 hover:shadow-md transition-all duration-300 ${FOCUS_RING}`}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-white ${d.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <d.icon size={13} aria-hidden="true" />
                    </span>
                    <span>{d.name.replace(/^GlofiHub\s+/, '')}</span>
                    {d.status === 'soon' && (
                      <>
                        <span aria-hidden="true" className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-foreground/10 dark:bg-white/15 text-foreground/70">
                          Soon
                        </span>
                        <span className="sr-only">(launching soon)</span>
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trust panel — stats + education on-ground presence in one glass card */}
          <div
            className="animate-hero-rise mt-10 w-full max-w-2xl rounded-3xl bg-white/55 dark:bg-slate-900/50 border border-white/50 dark:border-white/15 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden"
            style={{ animationDelay: '0.85s' }}
          >
            {/* Stats row with elegant dividers */}
            <div className="grid grid-cols-3 divide-x divide-foreground/10">
              {stats.map((s) => (
                <div key={s.label} className="group p-4 sm:p-5 text-center hover:bg-white/15 dark:hover:bg-white/5 transition-colors duration-300">
                  <s.icon size={18} className="text-primary dark:text-blue-300 mx-auto mb-2 group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
                  <div className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
                    <CountUp value={s.value} className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-emerald-500 dark:from-blue-300 dark:via-sky-300 dark:to-emerald-300" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-medium text-foreground/70 mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Divider + global presence with overlapping flag avatars */}
            <div className="border-t border-foreground/10 px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-white/10 dark:bg-white/5">
              <span className="text-[12px] font-semibold text-foreground/70">Education on-ground in</span>
              <div className="flex items-center -space-x-2">
                {countries.map((c) => (
                  <a key={c.name} href={c.link} title={c.name} className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300" aria-label={c.name}>
                    <img
                      src={c.image}
                      alt=""
                      aria-hidden="true"
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className="relative w-7 h-7 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/25 shadow-sm hover:ring-primary group-hover:scale-125 group-hover:z-10 transition-all duration-300"
                    />
                    <span aria-hidden="true" className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-white bg-foreground/90 dark:bg-slate-950/90 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      {c.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint → businesses */}
        <a
          href="#businesses"
          aria-label="Scroll to our businesses"
          className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 rounded-md text-foreground/55 hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Our Businesses</span>
          <span className="w-5 h-8 rounded-full border-2 border-foreground/35 flex items-start justify-center p-1 group-hover:border-foreground/60 transition-colors">
            <span className="w-1 h-1.5 rounded-full bg-foreground animate-bounce motion-reduce:animate-none" />
          </span>
        </a>
      </section>

      {/* ════════════ VIDEO MODAL ════════════ */}
      {showVideo && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Our story video"
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative h-[85dvh] aspect-[9/16] max-w-[calc(100vw-2rem)] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all hover:scale-110 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close video"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <video
              src="/videos/our-story.mp4"
              poster="/videos/our-story-poster.jpg"
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
