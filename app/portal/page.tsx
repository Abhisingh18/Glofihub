import Link from 'next/link';
import type { Metadata } from 'next';
import {
  GraduationCap, LogIn, Users, MessagesSquare, BarChart3, ShieldCheck, ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Staff & Admin Portal — GlofiHub',
  description: 'Secure portal for GlofiHub counsellors and administrators.',
  robots: { index: false, follow: false },
};

const FEATURES = [
  { icon: Users, title: 'Manage Students', text: 'Track leads, assignments & status in one place.' },
  { icon: MessagesSquare, title: 'Secure Chat', text: 'Talk to students in-app — no numbers shared.' },
  { icon: BarChart3, title: 'Live Analytics', text: 'Revenue, performance & full audit trail.' },
];

export default function PortalLanding() {
  return (
    <main className="min-h-screen relative overflow-hidden text-white flex flex-col bg-[#070b1f]">
      {/* Rich base gradient */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#0a1e5e] via-[#0b1533] to-[#0a0f2b]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(37,99,235,0.35),transparent_60%)]" />

      {/* Colourful animated aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-24 w-[34rem] h-[34rem] rounded-full bg-accent/30 blur-[130px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-violet-600/25 blur-[130px] animate-aurora" style={{ animationDelay: '2.5s' }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/4 w-[34rem] h-[34rem] rounded-full bg-emerald-500/20 blur-[130px] animate-aurora" style={{ animationDelay: '5s' }} />
      <div aria-hidden className="pointer-events-none absolute top-10 right-1/4 w-[22rem] h-[22rem] rounded-full bg-cyan-400/15 blur-[120px] animate-aurora" style={{ animationDelay: '1.2s' }} />

      {/* Dotted grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 30%, black 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 30%, black 35%, transparent 100%)',
        }}
      />
      {/* Top sheen line */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-white/15 ring-2 ring-white/25 flex items-center justify-center">
            <GraduationCap size={20} />
          </span>
          <span className="font-display font-bold text-lg">GlofiHub</span>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          <LogIn size={16} /> Login
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wide mb-6">
          <ShieldCheck size={14} className="text-emerald-300" /> Authorized Personnel Only
        </span>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
          GlofiHub{' '}
          <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Staff &amp; Admin Portal
          </span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-white/70 font-medium max-w-xl">
          Manage students, counsellors, payments and secure conversations — all from one
          powerful dashboard.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="btn-shine group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-2xl transition-all"
          >
            Login to Portal
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://www.glofihub.com"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
          >
            Visit Public Site
          </a>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 rounded-2xl bg-white/[0.06] border border-white/10 text-left backdrop-blur-sm">
                <span className="w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center mb-3">
                  <Icon size={20} />
                </span>
                <p className="font-display font-bold">{f.title}</p>
                <p className="text-sm text-white/60 mt-1 leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 text-center py-6 text-[11px] text-white/45 font-medium">
        © {new Date().getFullYear()} GlofiHub · Staff &amp; Admin Portal
      </footer>
    </main>
  );
}
