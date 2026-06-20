import Link from 'next/link';
import { ArrowLeft, GraduationCap, MessagesSquare, ShieldCheck, BadgeCheck, Globe } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: GraduationCap, title: 'Expert counselling', text: 'Guidance for study abroad, MBBS & careers.' },
  { icon: MessagesSquare, title: 'Secure in-app chat', text: 'Talk to your counsellor — no numbers shared.' },
  { icon: ShieldCheck, title: 'Private & safe', text: 'Your data is protected end to end.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex bg-background">
      {/* ── Left brand panel (desktop) ── */}
      <aside className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-950 text-white p-12 xl:p-16 flex-col justify-between">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/25 blur-3xl animate-aurora" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/25 blur-3xl animate-aurora" style={{ animationDelay: '3s' }} />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 30% 40%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 30% 40%, black 30%, transparent 100%)',
          }}
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-white/15 ring-2 ring-white/25 flex items-center justify-center">
              <GraduationCap size={20} />
            </span>
            <span className="font-display font-bold text-lg">GlofiHub</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-6">
            <Globe size={13} /> Trusted across India, Russia & Central Asia
          </span>
          <h2 className="font-display text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight">
            Your gateway to global education & careers.
          </h2>
          <p className="mt-4 text-white/70 font-medium">
            Sign in to connect with expert counsellors, track your journey and unlock infinite possibilities.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center shrink-0">
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

        <div className="relative flex items-center gap-2 text-white/60 text-xs font-medium">
          <BadgeCheck size={15} className="text-emerald-300" /> 1000+ students guided · 95% success rate
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <section className="flex-1 flex flex-col px-5 py-8 sm:px-8 relative">
        {/* mobile ambient */}
        <div aria-hidden className="lg:hidden pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />

        <Link href="/" className="inline-flex items-center gap-2 text-foreground/55 hover:text-foreground text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to site
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md py-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25">
                <GraduationCap size={24} />
              </span>
            </div>
            <div className="bg-card border border-foreground/10 rounded-3xl shadow-xl shadow-black/[0.04] p-7 sm:p-9">
              {children}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-foreground/40 font-medium">
          © {new Date().getFullYear()} GlofiHub · Education & Counselling Platform
        </p>
      </section>
    </main>
  );
}
