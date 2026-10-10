'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, GraduationCap, LogIn, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-white';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * "Get Started" dialog, opened by the `openGetStarted` window event. What it shows depends on where
 * the visitor is:
 *  - on the GlofiHub Counselling website (/counselling): New Student / Existing Student (sign up / sign in)
 *  - everywhere else (the parent GlofiHub site): a chooser for the group's businesses
 */
export function GetStartedModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCounselling = pathname === '/counselling' || pathname.startsWith('/counselling/');
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Element that had focus when the dialog opened — focus returns to it on close.
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openGetStarted', handleOpen);
    return () => window.removeEventListener('openGetStarted', handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep Tab / Shift+Tab inside the dialog.
      const dialog = dialogRef.current;
      const nodes = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!dialog || !nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const outside = !dialog.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      const el = restoreRef.current;
      restoreRef.current = null;
      if (el && el.isConnected) el.focus();
    };
  }, [open]);

  if (!open) return null;

  // The options are real links (Next navigates); this just closes the dialog on the way out.
  const leave = () => {
    restoreRef.current = null; // we're leaving the page — don't pull focus back to the opener
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-lg bg-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl" />

        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer ${FOCUS_RING}`}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative p-7 md:p-9 max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4">
              <Sparkles size={14} className="text-primary dark:text-blue-300" />
              <span className="text-xs font-semibold tracking-wide text-primary dark:text-blue-300">Welcome to GlofiHub</span>
            </div>
            <h2 id={titleId} className="font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {isCounselling ? 'Start your journey with GlofiHub' : 'Where would you like to start?'}
            </h2>
            <p id={descId} className="mt-2 text-sm text-foreground/60 font-medium">
              {isCounselling
                ? 'Create your student account for GlofiHub Education counselling, secure chat & more.'
                : 'Pick a GlofiHub business to explore — or talk to our team and we will point you to the right place.'}
            </p>
          </div>

          {isCounselling ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* New student */}
                <Link
                  href="/register"
                  onClick={leave}
                  className={`group relative text-left p-5 rounded-2xl bg-muted/30 border border-foreground/10 hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 cursor-pointer ${FOCUS_RING}`}
                >
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
                    <GraduationCap size={24} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight">New Student</h3>
                  <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">Create your free account in a minute.</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-blue-300">
                    Sign Up <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                {/* Existing student */}
                <Link
                  href="/login"
                  onClick={leave}
                  className={`group relative text-left p-5 rounded-2xl bg-muted/30 border border-foreground/10 hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer ${FOCUS_RING}`}
                >
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
                    <LogIn size={24} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight">Existing Student</h3>
                  <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">Already registered? Sign in here.</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Sign In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Not a student? Point visitors to the rest of the group. */}
              <p className="mt-6 text-center text-xs font-medium text-foreground/60">
                Just exploring?{' '}
                <Link
                  href="/#businesses"
                  onClick={leave}
                  className={`font-semibold text-primary dark:text-blue-300 underline-offset-2 hover:underline rounded cursor-pointer ${FOCUS_RING}`}
                >
                  See all GlofiHub businesses
                </Link>
              </p>
            </>
          ) : (
            <>
              <ul className="grid sm:grid-cols-2 gap-3">
                {DIVISIONS.map((d) => {
                  const Icon = d.icon;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={d.href}
                        onClick={leave}
                        className={`group flex h-full w-full items-start gap-3 text-left p-3.5 rounded-2xl bg-muted/30 border border-foreground/10 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer ${FOCUS_RING}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${d.iconBg}`}>
                          <Icon size={19} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="font-display text-sm font-bold text-foreground">{d.short}</span>
                            {d.status === 'soon' && (
                              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Soon
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-[11px] font-medium leading-snug text-foreground/55">{d.tagline}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-center text-xs font-medium text-foreground/60">
                Not sure?{' '}
                <Link
                  href="/#contact"
                  onClick={leave}
                  className={`inline-flex items-center gap-1 font-semibold text-primary dark:text-blue-300 underline-offset-2 hover:underline rounded cursor-pointer ${FOCUS_RING}`}
                >
                  <MessageCircle size={12} aria-hidden /> Talk to our team
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
