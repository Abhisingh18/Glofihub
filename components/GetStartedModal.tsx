'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, GraduationCap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export function GetStartedModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openGetStarted', handleOpen);
    return () => window.removeEventListener('openGetStarted', handleOpen);
  }, []);

  // Lock scroll while open + close on Escape
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

  const chooseStudent = () => {
    setOpen(false);
    router.push('/register');
  };

  const quickEnquiry = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('openStudentForm'));
  };

  const chooseAdmin = () => {
    setOpen(false);
    router.push('/login');
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accents */}
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl" />

        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative p-7 md:p-9">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary">Get Started</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              How would you like to continue?
            </h3>
            <p className="mt-2 text-sm text-foreground/60 font-medium">
              Choose an option to proceed.
            </p>
          </div>

          {/* Choices */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Student */}
            <button
              onClick={chooseStudent}
              className="group relative text-left p-6 rounded-2xl bg-muted/30 border border-foreground/10 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <GraduationCap size={24} />
              </span>
              <h4 className="font-display text-lg font-bold text-foreground tracking-tight">Student</h4>
              <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">
                Create your account for counselling, secure chat &amp; payments.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Sign Up <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Admin */}
            <button
              onClick={chooseAdmin}
              className="group relative text-left p-6 rounded-2xl bg-muted/30 border border-foreground/10 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <ShieldCheck size={24} />
              </span>
              <h4 className="font-display text-lg font-bold text-foreground tracking-tight">Admin / Staff</h4>
              <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">
                Counsellors &amp; admins sign in to manage students &amp; chat.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                Sign In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Footer links */}
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-foreground/55 font-medium">
              Already have an account?{' '}
              <button onClick={chooseAdmin} className="font-semibold text-primary hover:underline cursor-pointer">
                Sign in
              </button>
            </p>
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
