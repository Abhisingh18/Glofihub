import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary via-primary to-blue-950 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to site
        </Link>

        <div className="bg-card border border-foreground/10 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex items-center justify-center mb-6">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <GraduationCap size={24} />
            </span>
          </div>
          {children}
        </div>

        <p className="text-center text-[11px] text-white/50 font-medium mt-5">
          GlofiHub · Education & Counselling Platform
        </p>
      </div>
    </main>
  );
}
