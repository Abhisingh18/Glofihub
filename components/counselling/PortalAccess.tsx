import Link from 'next/link';
import { ArrowRight, GraduationCap, Headset, MessagesSquare, ShieldCheck } from 'lucide-react';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const PORTALS = [
  {
    icon: GraduationCap,
    title: 'Student Portal',
    text: 'Track your counselling, chat securely with your counsellor and view your profile.',
    primary: { href: '/login', label: 'Student Login' },
    secondary: { href: '/register', label: 'Create an account' },
    tone: 'from-blue-500 to-blue-600',
  },
  {
    icon: Headset,
    title: 'Counsellor & Admin Portal',
    text: 'For GlofiHub staff: manage students, assignments, leads and conversations.',
    primary: { href: '/login', label: 'Staff / Admin Login' },
    secondary: null,
    tone: 'from-violet-500 to-fuchsia-600',
  },
];

/** Login entry points for the counselling CRM (student + staff/admin). */
export function PortalAccess() {
  return (
    <section id="portal" aria-labelledby="portal-heading" className="bg-muted/30 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10" data-reveal>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold tracking-wide text-primary dark:text-accent mb-5">
            <ShieldCheck size={14} aria-hidden /> Counselling Portal
          </span>
          <h2 id="portal-heading" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
            Sign in to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">counselling portal</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/60">
            <MessagesSquare size={14} aria-hidden className="inline mr-1 -mt-0.5" />
            Talk to your counsellor in-app — phone numbers are never shared in chat.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PORTALS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.title} data-reveal data-reveal-d={`${i + 1}`} className="rounded-3xl border border-foreground/10 bg-card p-7 shadow-lg shadow-black/5">
                <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${p.tone}`}>
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{p.text}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={p.primary.href}
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 transition-all ${FOCUS}`}
                  >
                    {p.primary.label} <ArrowRight size={15} aria-hidden />
                  </Link>
                  {p.secondary && (
                    <Link href={p.secondary.href} className={`rounded-full text-sm font-semibold text-primary dark:text-accent hover:underline ${FOCUS}`}>
                      {p.secondary.label}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
