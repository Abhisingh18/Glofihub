import type { Metadata } from 'next';
import { CounsellingLink } from '@/components/counselling/CounsellingLink';
import { ArrowLeft, GraduationCap, MessagesSquare, ShieldCheck, BadgeCheck, Globe, Sparkles } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: GraduationCap, title: 'Expert counselling', text: 'Guidance for study abroad, MBBS & careers.' },
  { icon: MessagesSquare, title: 'Secure in-app chat', text: 'Talk to your counsellor — no numbers shared.' },
  { icon: ShieldCheck, title: 'Private & safe', text: 'Your data is protected end to end.' },
];

// Account pages: keep them out of search results (robots.txt already disallows them).
export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex bg-background">
      {/* ── Left brand panel (desktop) ── */}
      <aside className="hidden lg:flex w-1/2 relative overflow-hidden text-white p-12 xl:p-16 flex-col justify-between bg-[#070b1f]">
        {/* Rich gradient base */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#0a1e5e] via-[#0b1533] to-[#0a0f2b]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_0%,rgba(37,99,235,0.4),transparent_60%)]" />

        {/* Animated colour blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-accent/30 blur-[120px] animate-aurora" />
        <div aria-hidden className="pointer-events-none absolute top-1/3 -right-24 w-[26rem] h-[26rem] rounded-full bg-violet-600/25 blur-[120px] animate-aurora" style={{ animationDelay: '2.5s' }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-emerald-500/20 blur-[120px] animate-aurora" style={{ animationDelay: '5s' }} />

        {/* Dotted grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 30% 40%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 30% 40%, black 30%, transparent 100%)',
          }}
        />
        <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Logo */}
        <div className="relative" data-reveal>
          <CounsellingLink className="inline-flex items-center gap-2.5 group">
            <span className="w-10 h-10 rounded-xl bg-white/15 ring-2 ring-white/25 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </span>
            <span className="font-display font-bold text-lg">GlofiHub</span>
          </CounsellingLink>
        </div>

        {/* Copy */}
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Globe size={13} className="text-cyan-300" /> Trusted across India, Russia &amp; Central Asia
          </span>
          <h2 className="font-display text-3xl xl:text-[2.6rem] font-extrabold leading-[1.1] tracking-tight">
            Your gateway to{' '}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent animate-gradient-text">
              global education
            </span>{' '}
            &amp; careers.
          </h2>
          <p className="mt-4 text-white/70 font-medium leading-relaxed">
            Sign in to connect with expert counsellors, track your journey and unlock
            infinite possibilities.
          </p>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((h, i) => (
              <li
                key={h.title}
                data-reveal
                data-reveal-d={i + 1}
                className="group flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.09] hover:border-white/20 hover:translate-x-1 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <h.icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-sm">{h.title}</p>
                  <p className="text-white/60 text-sm">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer stat */}
        <div className="relative flex items-center gap-2 text-white/60 text-xs font-medium">
          <BadgeCheck size={15} className="text-emerald-300" /> 1000+ students guided · 95% success rate
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <section className="flex-1 flex flex-col px-5 py-8 sm:px-8 relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* mobile ambient */}
        <div aria-hidden className="lg:hidden pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-aurora" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <CounsellingLink className="relative inline-flex items-center gap-2 text-foreground/55 hover:text-foreground text-sm font-medium transition-colors w-fit">
          <ArrowLeft size={16} className="transition-transform hover:-translate-x-0.5" /> Back to GlofiHub Counselling
        </CounsellingLink>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md py-8 animate-hero-rise">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25">
                <GraduationCap size={24} />
              </span>
            </div>

            {/* Card with gradient glow border */}
            <div className="relative">
              <div aria-hidden className="absolute -inset-0.5 rounded-[1.7rem] bg-gradient-to-br from-primary/40 via-accent/20 to-emerald-500/30 blur opacity-60" />
              <div className="relative bg-card border border-foreground/10 rounded-3xl shadow-2xl shadow-black/[0.08] p-7 sm:p-9">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-[11px] font-semibold text-primary mb-5">
                  <Sparkles size={12} /> Welcome to GlofiHub
                </span>
                {children}
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-center text-[11px] text-foreground/40 font-medium">
          © {new Date().getFullYear()} GlofiHub · Education &amp; Counselling Platform
        </p>
      </section>
    </main>
  );
}
