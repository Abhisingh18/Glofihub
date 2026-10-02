'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Quote, Eye, HeartHandshake, Globe, Lightbulb, MapPin } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

/** Generic working principles — wording only, no factual claims. */
const VALUES = [
  { label: 'Transparency', icon: Eye },
  { label: 'Mentorship', icon: HeartHandshake },
  { label: 'Global reach', icon: Globe },
  { label: 'Innovation', icon: Lightbulb },
];

/** "GlofiHub Education" -> "Education" (the group name is already in the section). */
const shortName = (name: string) => name.replace(/^GlofiHub\s+/i, '');

export function About() {
  return (
    <section id="about" className="relative lg:min-h-screen flex items-center py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      {/* Ambient aurora */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora pointer-events-none" style={{ animationDelay: '4s' }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left content ── */}
          <div data-reveal className="min-w-0 space-y-7">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                <Sparkles size={14} className="text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-wide text-primary">About the GlofiHub Group</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                One AI-Integrated Group for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                  Global Success
                </span>
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <p>
                GlofiHub is an AI-integrated group connecting{' '}
                <span className="font-semibold text-foreground">Education</span>,{' '}
                <span className="font-semibold text-foreground">Skills</span>,{' '}
                <span className="font-semibold text-foreground">Trade</span> and{' '}
                <span className="font-semibold text-foreground">Digital</span> under one roof — so students,
                professionals and businesses can find the right path with one trusted partner.
              </p>
              <p>
                With a presence in India and Russia, we provide end-to-end support from counseling to on-ground assistance.
              </p>
            </div>

            {/* Business chips — link to each division */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">Our businesses</p>
              <ul className="flex flex-wrap gap-2.5">
                {DIVISIONS.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={d.href}
                      className="group inline-flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-card border border-foreground/10 text-sm font-semibold text-foreground/80 shadow-sm hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white ${d.iconBg}`}>
                        <d.icon size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform motion-reduce:transform-none" />
                      </span>
                      {shortName(d.name)}
                      {d.status === 'soon' && (
                        <>
                          <span aria-hidden="true" className="rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground/60">
                            Soon
                          </span>
                          <span className="sr-only">(launching soon)</span>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* How we work */}
            <div className="border-t border-foreground/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">How we work</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                {VALUES.map((v) => (
                  <li key={v.label} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/75">
                    <v.icon size={16} aria-hidden="true" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {v.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile / tablet proof points (the photo + floating cards are desktop-only) */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              <div className="rounded-2xl bg-card border border-foreground/10 shadow-sm px-4 py-3.5">
                <div className="text-2xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">1000+</div>
                <div className="mt-1.5 text-xs font-medium text-foreground/60">Students Guided</div>
              </div>
              <div className="rounded-2xl bg-card border border-foreground/10 shadow-sm px-4 py-3.5">
                <div className="flex items-center gap-1.5 text-sm font-bold leading-none text-foreground">
                  <MapPin size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  India &amp; Russia
                </div>
                <div className="mt-2 text-xs font-medium text-foreground/60">On-ground assistance</div>
              </div>
            </div>

            {/* Mission quote */}
            <figure className="relative mx-0 mt-0 bg-card rounded-2xl p-6 pl-7 border border-foreground/10 shadow-lg shadow-black/5 overflow-hidden">
              <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 to-emerald-600" />
              <Quote size={28} aria-hidden="true" className="text-emerald-500/25 mb-2" />
              <blockquote className="m-0 text-base md:text-lg font-semibold text-foreground italic leading-snug mb-2">
                &quot;To simplify decision-making and create real opportunities for everyone worldwide.&quot;
              </blockquote>
              <figcaption className="text-[11px] text-foreground/60 font-semibold tracking-wide">— Our Mission</figcaption>
            </figure>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                className="btn-shine group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Talk to Our Team <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
              </button>
              <Link
                href="/#businesses"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-full bg-card border border-foreground/15 text-foreground font-semibold tracking-wide hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore Our Businesses
                <ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
              </Link>
            </div>
          </div>

          {/* ── Right visual ── */}
          <div data-reveal data-reveal-d="2" className="relative hidden lg:block group">
            {/* Decorative gradient frame glow */}
            <div aria-hidden="true" className="absolute -inset-3 bg-gradient-to-tr from-primary/20 via-emerald-400/10 to-transparent rounded-[2rem] blur-xl opacity-70" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop"
                alt="Young people collaborating together at a table"
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating glass card — Expert Support */}
            <div className="absolute -bottom-5 -left-5 bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-5 max-w-[230px] shadow-2xl border border-white/40 dark:border-white/10 animate-float-soft">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" aria-hidden="true" />
                </span>
                <p className="font-bold text-sm text-foreground">Expert Support</p>
              </div>
              <p className="text-foreground/65 text-xs font-medium leading-relaxed">
                India &amp; Russia on-ground assistance — every step covered.
              </p>
            </div>

            {/* Floating glass stat — top right */}
            <div className="absolute -top-5 -right-4 bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-white/40 dark:border-white/10 text-center animate-float-soft" style={{ animationDelay: '1.5s' }}>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 leading-none">1000+</div>
              <div className="text-[10px] font-medium text-foreground/60 mt-1">Students Guided</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
