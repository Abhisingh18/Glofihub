'use client';

import { ArrowRight, Sparkles, GraduationCap, Briefcase, Code, Users, ShieldCheck, Quote } from 'lucide-react';

export function About() {
  const pillars = [
    { label: 'Education', icon: GraduationCap },
    { label: 'Jobs', icon: Briefcase },
    { label: 'Skills', icon: Code },
    { label: 'Collaborations', icon: Users },
  ];

  return (
    <section id="about" className="relative lg:min-h-screen flex items-center py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      {/* Ambient aurora */}
      <div className="absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora pointer-events-none" style={{ animationDelay: '4s' }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left content ── */}
          <div data-reveal className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary">About GlofiHub</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
              An AI Integrated Ecosystem for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                Global Success
              </span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <p>
                GlofiHub is a modern AI-driven global platform designed to guide students and professionals towards the right education and career opportunities.
              </p>
              <p>
                We connect Education, Jobs, Skill Enhancement, and Global Collaborations. With a presence in India and Russia, we provide end-to-end support from counseling to on-ground assistance.
              </p>
            </div>

            {/* Pillar chips */}
            <div className="flex flex-wrap gap-2.5">
              {pillars.map((p) => (
                <span
                  key={p.label}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-foreground/10 text-sm font-medium text-foreground/80 shadow-sm hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
                >
                  <p.icon size={15} className="text-primary group-hover:scale-110 transition-transform" />
                  {p.label}
                </span>
              ))}
            </div>

            {/* Mission quote */}
            <div className="relative bg-card rounded-2xl p-6 pl-7 border border-foreground/10 shadow-lg shadow-black/5 overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 to-emerald-600" />
              <Quote size={28} className="text-emerald-500/20 mb-2" />
              <p className="text-base md:text-lg font-semibold text-foreground italic leading-snug mb-2">
                &quot;To simplify decision-making and create real opportunities for everyone worldwide.&quot;
              </p>
              <p className="text-[11px] text-foreground/45 font-semibold tracking-wide">— Our Mission</p>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              className="btn-shine group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Join the Ecosystem <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ── Right visual ── */}
          <div data-reveal data-reveal-d="2" className="relative hidden lg:block group">
            {/* Decorative gradient frame glow */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 via-emerald-400/10 to-transparent rounded-[2rem] blur-xl opacity-70" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop"
                alt="Global Collaboration"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating glass card — Expert Support */}
            <div className="absolute -bottom-5 -left-5 bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-5 max-w-[230px] shadow-2xl border border-white/40 dark:border-white/10 animate-float-soft">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" />
                </span>
                <p className="font-bold text-sm text-foreground">Expert Support</p>
              </div>
              <p className="text-foreground/60 text-xs font-medium leading-relaxed">
                India &amp; Russia on-ground assistance — every step covered.
              </p>
            </div>

            {/* Floating glass stat — top right */}
            <div className="absolute -top-5 -right-4 bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-white/40 dark:border-white/10 text-center animate-float-soft" style={{ animationDelay: '1.5s' }}>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 leading-none">1000+</div>
              <div className="text-[10px] font-medium text-foreground/55 mt-1">Students Guided</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
