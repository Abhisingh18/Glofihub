'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, GraduationCap, Headset, ShieldCheck, ArrowRight, Sparkles, type LucideIcon } from 'lucide-react';

export function GetStartedModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openGetStarted', handleOpen);
    return () => window.removeEventListener('openGetStarted', handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };
  const quickEnquiry = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('openStudentForm'));
  };

  const OPTIONS: {
    title: string; desc: string; cta: string; icon: LucideIcon; accent: string; hover: string; onClick: () => void;
  }[] = [
    {
      title: 'User', desc: 'Students — sign up for counselling, secure chat & more.',
      cta: 'Sign Up', icon: GraduationCap, accent: 'from-primary to-blue-600',
      hover: 'hover:border-primary/40 hover:shadow-primary/10', onClick: () => go('/register'),
    },
    {
      title: 'Staff', desc: 'Counsellors — sign in to manage your assigned students.',
      cta: 'Staff Login', icon: Headset, accent: 'from-violet-500 to-fuchsia-600',
      hover: 'hover:border-violet-500/40 hover:shadow-violet-500/10', onClick: () => go('/login'),
    },
    {
      title: 'Admin', desc: 'Full control of students, counsellors & operations.',
      cta: 'Admin Login', icon: ShieldCheck, accent: 'from-emerald-500 to-green-600',
      hover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10', onClick: () => go('/login'),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl" />

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative p-7 md:p-9">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary">Get Started</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              How would you like to continue?
            </h3>
            <p className="mt-2 text-sm text-foreground/60 font-medium">Choose your portal to proceed.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {OPTIONS.map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.title}
                  onClick={o.onClick}
                  className={`group relative text-left p-5 rounded-2xl bg-muted/30 border border-foreground/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${o.hover}`}
                >
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${o.accent} flex items-center justify-center text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                    <Icon size={24} />
                  </span>
                  <h4 className="font-display text-lg font-bold text-foreground tracking-tight">{o.title}</h4>
                  <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">{o.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    {o.cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={quickEnquiry}
              className="text-xs font-medium text-foreground/45 hover:text-foreground transition-colors cursor-pointer"
            >
              Or send a quick enquiry without an account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
