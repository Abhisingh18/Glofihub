'use client';

import { ArrowRight, Sparkles, Phone, Play, X, GraduationCap, Code, Briefcase, Handshake, ShieldCheck, Users, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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

export function Hero() {
  const whatsappLink = 'https://wa.me/919241168875?text=Hi%20from%20GlofiHub%20website';
  const [showVideo, setShowVideo] = useState(false);

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

  const pathway = [
    { step: '01', title: 'Education', description: 'Premier international universities with fully-guided admissions.', icon: GraduationCap, iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600', glow: 'group-hover:shadow-blue-500/25', spot: 'rgba(59,130,246,0.18)', link: '#service-education' },
    { step: '02', title: 'Skills', description: 'Industry-ready, high-demand skills taught by top professionals.', icon: Code, iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600', glow: 'group-hover:shadow-emerald-500/25', spot: 'rgba(16,185,129,0.18)', link: '#service-skills' },
    { step: '03', title: 'Jobs', description: 'Direct connections with leading global employers worldwide.', icon: Briefcase, iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600', glow: 'group-hover:shadow-amber-500/25', spot: 'rgba(245,158,11,0.18)', link: '#service-jobs' },
    { step: '04', title: 'Partnerships', description: 'Collaborate with institutions & build regional networks.', icon: Handshake, iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600', glow: 'group-hover:shadow-indigo-500/25', spot: 'rgba(99,102,241,0.18)', link: '#service-partnerships' },
  ];

  const spotlight = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const line1 = ['Building', 'Global', 'Careers'];

  return (
    <>
      {/* Floating Side Quick Action Widget */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col shadow-2xl rounded-r-xl overflow-hidden border-t border-b border-r border-black/5">
        <a
          href="tel:+919241168875"
          className="w-11 h-11 bg-[#00a2e8] text-white flex items-center justify-center hover:bg-opacity-90 hover:pl-2 transition-all duration-300"
          aria-label="Call consultant"
        >
          <Phone size={20} />
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 bg-[#25D366] text-white flex items-center justify-center hover:bg-opacity-90 hover:pl-2 transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

      {/* ════════════ PREMIUM LIGHT HERO ════════════ */}
      <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-32 pb-16 px-4 sm:px-6 lg:px-8 scroll-mt-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/70 dark:from-[#0a1124] dark:via-[#0b1530] dark:to-[#0a2150]">
        {/* Background photo (brand-tinted, whitish wash keeps it premium) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bg/hero-bg.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-100 dark:opacity-70 animate-kenburns select-none"
          />
          {/* Light gradient wash (top + bottom) — image stays clear & crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/45 dark:from-[#0a1124]/65 dark:via-[#0b1530]/25 dark:to-[#0a2150]/80" />
          {/* Central light column — keeps text in the gap between the two people */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_66%_at_50%_50%,rgba(255,255,255,0.82),rgba(255,255,255,0.35)_55%,transparent_75%)] dark:bg-[radial-gradient(ellipse_46%_66%_at_50%_50%,rgba(10,17,36,0.78),rgba(10,17,36,0.4)_55%,transparent_75%)]" />
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

        {/* Content (centered, narrow column so text sits between the two people) */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className="animate-hero-rise inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 dark:bg-white/10 border border-primary/15 dark:border-white/15 backdrop-blur-md mb-7" style={{ animationDelay: '0.05s' }}>
            <Sparkles size={14} className="text-primary dark:text-blue-300 animate-pulse" />
            <span className="text-[11px] font-bold text-primary dark:text-white/90 tracking-wide">An AI Integrated Platform</span>
          </div>

          {/* Animated headline (word-by-word rise + gradient + underline draw) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
            <span className="block">
              {line1.map((word, i) => (
                <span
                  key={word}
                  className="inline-block animate-hero-rise"
                  style={{ animationDelay: `${0.12 + i * 0.09}s` }}
                >
                  <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    {word}
                  </span>
                  {i < line1.length - 1 && ' '}
                </span>
              ))}
            </span>
            <span className="block animate-hero-rise mt-1.5" style={{ animationDelay: '0.42s' }}>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 animate-gradient-text">
                  Beyond Borders
                </span>
                {/* animated underline */}
                <span className="absolute left-0 -bottom-1.5 h-[3px] w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 animate-underline" />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-rise mt-6 text-sm sm:text-base text-foreground/65 leading-relaxed font-medium max-w-2xl" style={{ animationDelay: '0.54s' }}>
            GlofiHub helps students and young professionals access international education, industry-ready skills, career mentorship, and global job opportunities — all through one intelligent platform.
          </p>

          {/* CTAs + Play */}
          <div className="animate-hero-rise mt-9 flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: '0.64s' }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              className="btn-shine group w-full sm:w-auto px-8 py-4 rounded-full bg-primary/10 dark:bg-white/5 backdrop-blur-md border-2 border-primary/40 dark:border-white/30 text-primary dark:text-white font-bold text-sm tracking-wide hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start AI Guidance <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border-2 border-foreground/25 dark:border-white/20 text-foreground font-bold text-sm tracking-wide hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5 hover:scale-[1.04] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Talk to Counselor <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Play button */}
            <button
              onClick={() => setShowVideo(true)}
              className="group relative flex items-center gap-3 cursor-pointer"
              aria-label="Watch our story"
            >
              <span className="relative flex items-center justify-center w-14 h-14">
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ripple" />
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ripple" style={{ animationDelay: '1.2s' }} />
                <span className="relative w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                  <Play size={20} className="fill-current ml-0.5" />
                </span>
              </span>
              <span className="text-left text-[11px] font-bold text-foreground/70 tracking-wide group-hover:text-foreground transition-colors">
                Watch<br />Our Story
              </span>
            </button>
          </div>

          {/* Unified premium trust panel — stats + global presence in one glass card */}
          <div
            className="animate-hero-rise mt-12 w-full max-w-2xl rounded-3xl bg-white/15 dark:bg-white/5 border border-white/40 dark:border-white/15 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden"
            style={{ animationDelay: '0.78s' }}
          >
            {/* Stats row with elegant dividers */}
            <div className="grid grid-cols-3 divide-x divide-foreground/10">
              {stats.map((s) => (
                <div key={s.label} className="group p-4 sm:p-5 text-center hover:bg-white/15 dark:hover:bg-white/5 transition-colors duration-300">
                  <s.icon size={18} className="text-primary mx-auto mb-2 group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <div className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
                    <CountUp value={s.value} className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-emerald-500" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-medium text-foreground/55 mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Divider + global presence with overlapping flag avatars */}
            <div className="border-t border-foreground/10 px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-white/10 dark:bg-white/5">
              <span className="text-[12px] font-semibold text-foreground/55">On-ground in</span>
              <div className="flex items-center -space-x-2">
                {countries.map((c) => (
                  <a key={c.name} href={c.link} title={c.name} className="group relative" aria-label={c.name}>
                    <img
                      src={c.image}
                      alt=""
                      aria-hidden="true"
                      className="relative w-7 h-7 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/25 shadow-sm hover:ring-primary hover:scale-125 hover:z-10 transition-all duration-300"
                    />
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-white bg-foreground/90 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      {c.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <a href="#about" className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 text-foreground/40 hover:text-foreground transition-colors group">
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Scroll</span>
          <span className="w-5 h-8 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1 group-hover:border-foreground/60 transition-colors">
            <span className="w-1 h-1.5 rounded-full bg-foreground animate-bounce" />
          </span>
        </a>
      </section>

      {/* ════════════ ADVANCED PATHWAY (BENTO) ════════════ */}
      <section className="relative bg-background overflow-hidden py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        {/* Animated mesh + dotted-grid background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
          <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />
          <div
            className="absolute inset-0 opacity-[0.45] dark:opacity-[0.2]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(10,47,107,0.10) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black, transparent)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14" data-reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Our Integrated Pathway</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.08]">
              From Ambition to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                Achievement
              </span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-foreground/60 leading-relaxed">
              One intelligent platform that carries you across every milestone — education, skills, jobs, and global partnerships.
            </p>
          </div>

          {/* Bento cards with mouse-follow spotlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pathway.map((p, i) => (
              <a
                key={p.title}
                href={p.link}
                data-reveal
                data-reveal-d={`${i + 1}`}
                onMouseMove={spotlight}
                className={`group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card/60 backdrop-blur-xl p-6 shadow-lg shadow-black/5 hover:-translate-y-2 hover:shadow-2xl ${p.glow} transition-all duration-500`}
              >
                {/* Mouse-follow spotlight */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(220px circle at var(--mx) var(--my), ${p.spot}, transparent 65%)` }}
                />
                {/* Ghost number */}
                <span className="absolute top-4 right-5 text-6xl font-extrabold text-foreground/[0.04] group-hover:text-foreground/[0.07] transition-colors select-none leading-none">
                  {p.step}
                </span>
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${p.iconBg} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                  <p.icon size={26} className="text-white" />
                </div>
                <h3 className="relative text-lg font-bold text-foreground mb-2">{p.title}</h3>
                <p className="relative text-[13px] text-foreground/60 leading-relaxed">{p.description}</p>
                <span className="relative mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Learn more <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ VIDEO MODAL ════════════ */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all hover:scale-110 border border-white/10"
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/fK0b6tYkH94?autoplay=1&rel=0"
              title="GlofiHub Story"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
