import Link from 'next/link';
import { ArrowRight, Sparkles, Quote, GraduationCap, MapPin, Globe, Eye, HeartHandshake, Lightbulb, Users } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';
import { EcosystemOrbit } from '@/components/about/EcosystemOrbit';

const EYEBROW = 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15';
const H2 = 'font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground';
const GRADIENT = 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text';
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const BTN_PRIMARY = `btn-shine group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none ${FOCUS}`;
const BTN_SECONDARY = `group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-full bg-card border border-foreground/15 text-foreground font-semibold tracking-wide hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none ${FOCUS}`;

/** Generic working principles — wording only, no factual claims. */
const VALUES = [
  { label: 'Transparency', icon: Eye },
  { label: 'Mentorship', icon: HeartHandshake },
  { label: 'Global reach', icon: Globe },
  { label: 'Innovation', icon: Lightbulb },
];

/** Global presence — only places/claims already on the site. */
const PRESENCE = [
  { place: 'India', icon: MapPin, text: 'Student guidance, parent counselling and document support, including our Patna hub.' },
  { place: 'Russia', icon: MapPin, text: 'University relations and on-ground student welfare across key Russian state & medical universities.' },
  { place: 'Central Asia', icon: MapPin, text: 'On-ground coordination, accommodation and university compliance for our Central Asian pathways.' },
];

export function About() {
  return (
    <>
      {/* ── About GlofiHub (hero + group story) ── */}
      <section id="about" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-[45%] h-[55%] bg-primary/8 rounded-full blur-[130px] animate-aurora pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-[40%] h-[45%] bg-emerald-500/8 rounded-full blur-[130px] animate-aurora pointer-events-none" style={{ animationDelay: '4s' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div data-reveal className="min-w-0 space-y-7">
            <div className={EYEBROW}>
              <Sparkles size={14} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-primary">A Gateway to Infinite Possibilities</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground">
              About <span className={GRADIENT}>GlofiHub</span>
            </h1>

            <div className="space-y-4 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
              <p>
                GlofiHub is an AI-integrated group connecting <span className="font-semibold text-foreground">education</span>,{' '}
                <span className="font-semibold text-foreground">skills</span>, <span className="font-semibold text-foreground">careers</span> and{' '}
                <span className="font-semibold text-foreground">technology</span> under one roof — so students, professionals and businesses can find the right path with one trusted partner.
              </p>
              <p>With a presence in India and Russia, we provide end-to-end support from counseling to on-ground assistance.</p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2.5" aria-label="How we work">
              {VALUES.map((v) => (
                <li key={v.label} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/75">
                  <v.icon size={16} aria-hidden="true" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {v.label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Link href="#ecosystem" className={BTN_PRIMARY}>
                Explore the Ecosystem <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
              </Link>
              <Link href="/#contact" className={BTN_SECONDARY}>
                Talk to Our Team
              </Link>
            </div>
          </div>

          <div data-reveal data-reveal-d="2" className="min-w-0">
            <EcosystemOrbit />
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section id="mission" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <figure data-reveal className="relative mx-0 bg-card rounded-3xl p-8 pl-9 md:p-12 md:pl-14 border border-foreground/10 shadow-lg shadow-black/5 overflow-hidden">
            <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 to-emerald-600" />
            <Quote size={40} aria-hidden="true" className="text-emerald-500/25 mb-3" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 mb-3">Our Mission</h2>
            <blockquote className="m-0 font-display text-xl md:text-3xl font-bold text-foreground italic leading-snug">
              &quot;To simplify decision-making and create real opportunities for everyone worldwide.&quot;
            </blockquote>
          </figure>
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section id="ecosystem" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div data-reveal className="text-center max-w-3xl mx-auto mb-12">
            <div className={`${EYEBROW} mb-5`}>
              <Sparkles size={14} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-primary">The GlofiHub Ecosystem</span>
            </div>
            <h2 className={H2}>
              Seven verticals, <span className={GRADIENT}>one gateway</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
              GlofiHub connects learners, professionals, institutions and businesses with the education, skills, services and opportunities they need to move forward.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 list-none">
            {DIVISIONS.map((d, i) => (
              <li key={d.slug} data-reveal data-reveal-d={`${(i % 4) + 1}`} className="flex">
                <Link
                  href={d.href}
                  className={`group flex w-full flex-col rounded-3xl bg-card border border-foreground/10 p-6 shadow-lg shadow-black/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl ${d.glow} transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none ${FOCUS}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md ${d.iconBg}`}>
                      <d.icon size={22} aria-hidden="true" />
                    </span>
                    {d.status === 'soon' && (
                      <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/60">Launching soon</span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{d.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-primary">{d.tagline}</p>
                  <p className="mt-3 text-sm text-foreground/65 leading-relaxed font-medium flex-grow">{d.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {d.cta} <ArrowRight size={15} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Leadership: Founder's message ── */}
      <section id="leadership" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div data-reveal className="text-center max-w-3xl mx-auto mb-12">
            <div className={`${EYEBROW} mb-5`}>
              <Users size={14} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-primary">Leadership</span>
            </div>
            <h2 className={H2}>
              Led by a <span className={GRADIENT}>founder&apos;s vision</span>
            </h2>
          </div>

          <div data-reveal className="max-w-5xl mx-auto relative">
            <div aria-hidden="true" className="absolute -inset-1 bg-gradient-to-r from-primary/25 via-emerald-400/20 to-primary/25 rounded-[2.25rem] blur-lg opacity-60" />
            <div className="relative bg-card border border-foreground/10 rounded-[2rem] shadow-lg shadow-black/5 overflow-hidden">
              <div className="grid lg:grid-cols-[300px_1fr]">
                <div className="relative bg-gradient-to-br from-primary via-primary to-blue-950 p-8 lg:p-10 flex flex-col items-center text-center justify-center overflow-hidden">
                  <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative">
                    <div aria-hidden="true" className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-[3px] shadow-2xl mx-auto">
                      <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center font-display font-extrabold text-3xl text-white tracking-tight">UK</div>
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-white tracking-tight mt-5">Ujjawal Kumar</h3>
                    <p className="text-xs font-semibold text-emerald-300 tracking-wide mt-1">Founder &amp; Strategic Head</p>
                    <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-medium">
                      <GraduationCap size={12} aria-hidden="true" /> Pursuing MBBS Abroad
                    </span>
                  </div>
                </div>

                <div className="relative p-8 md:p-10 lg:p-12">
                  <Quote aria-hidden="true" size={120} className="absolute top-4 right-5 text-primary/[0.06] fill-primary/[0.06]" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
                      <Quote size={13} className="text-primary" aria-hidden="true" />
                      <span className="text-xs font-semibold tracking-wide text-primary">Founder&apos;s Message</span>
                    </div>

                    <p className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight mb-4">Namaste 🙏</p>

                    <div className="space-y-3.5 text-sm md:text-[15px] text-foreground/75 font-medium leading-relaxed">
                      <p>I&apos;m Ujjawal Kumar, Founder &amp; Strategic Head of GlofiHub, currently pursuing MBBS abroad.</p>
                      <p>GlofiHub was created with a vision to connect education, skills, and real-world opportunities. During my journey in Patna, Kota, and abroad, I met many talented individuals who lacked proper guidance and exposure despite their potential.</p>
                      <p>Our mission is to empower students and professionals through mentorship, skill development, global exposure, and career opportunities in India and abroad.</p>
                      <p>At GlofiHub, we believe education should lead to confidence, growth, financial independence and meaningful success.</p>
                    </div>

                    <div className="mt-7 pt-6 border-t border-foreground/10 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-bold text-foreground italic leading-tight">Ujjawal Kumar</p>
                        <p className="text-xs font-semibold text-primary tracking-wide mt-0.5">Founder &amp; Strategic Head, GlofiHub</p>
                      </div>
                      <span className="hidden sm:inline-block text-sm font-semibold text-foreground/40">— Thank you</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Global Presence ── */}
      <section id="global-presence" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div data-reveal className="text-center max-w-3xl mx-auto mb-12">
            <div className={`${EYEBROW} mb-5`}>
              <Globe size={14} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wide text-primary">Global Presence</span>
            </div>
            <h2 className={H2}>
              India · Russia · <span className={GRADIENT}>Central Asia</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium">
              On-ground assistance from counseling to arrival — with students guided across 10+ countries.
            </p>
          </div>

          <ul className="grid md:grid-cols-3 gap-5 list-none">
            {PRESENCE.map((p, i) => (
              <li key={p.place} data-reveal data-reveal-d={`${i + 1}`} className="rounded-3xl bg-card border border-foreground/10 p-7 shadow-lg shadow-black/5">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                  <p.icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">{p.place}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed font-medium">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/** Closing call-to-action — rendered after the Team section. */
export function JoinGlofiHub() {
  return (
    <section id="join" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div data-reveal className="relative rounded-[2rem] bg-gradient-to-br from-primary via-primary to-blue-950 p-8 md:p-14 text-center overflow-hidden shadow-xl shadow-primary/20">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">Join GlofiHub</h2>
            <p className="mt-4 mx-auto max-w-xl text-sm sm:text-base text-white/80 leading-relaxed font-medium">
              Your network. Our platform. Shared growth. Build with GlofiHub as a partner — for students, consultants, professionals and institutions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/?requirement=partners#contact"
                className="btn-shine group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Become a Partner <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
              </Link>
              <Link
                href="/#partner-network"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-semibold tracking-wide hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Learn About the Partner Network
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
