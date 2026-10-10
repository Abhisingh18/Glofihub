import Link from 'next/link';
import { ArrowRight, GraduationCap, Headset, LayoutDashboard, MessagesSquare, ShieldCheck } from 'lucide-react';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const PORTALS = [
  {
    icon: GraduationCap,
    title: 'Student Portal',
    text: 'Track your counselling, chat securely with your counsellor and keep your profile up to date.',
    primary: { href: '/login', label: 'Existing student? Sign in' },
    secondary: { href: '/register', label: 'New student? Create an account' },
    tone: 'from-blue-500 to-blue-600',
  },
  {
    icon: Headset,
    title: 'Counsellor Portal',
    text: 'Counsellors sign in here to manage their assigned students and conversations.',
    primary: { href: '/login', label: 'Counsellor sign in' },
    secondary: null,
    tone: 'from-violet-500 to-fuchsia-600',
  },
];

/** Sign-in entry points of the counselling website (student + counsellor). The admin portal is deliberately not linked here. */
export function PortalAccess({ dashboardHref }: { dashboardHref?: string | null }) {
  return (
    <section id="portal" aria-labelledby="portal-heading" className="bg-muted/30 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-xl text-center" data-reveal>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary dark:text-accent">
            <ShieldCheck size={14} aria-hidden /> Counselling Portal
          </span>
          <h2 id="portal-heading" className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            {dashboardHref ? 'Welcome back' : 'Sign in to your counselling portal'}
          </h2>
          <p className="mt-4 text-sm text-foreground/60 md:text-base">
            <MessagesSquare size={14} aria-hidden className="-mt-0.5 mr-1 inline" />
            Talk to your counsellor in-app — phone numbers are never shared in chat.
          </p>
        </div>

        {dashboardHref ? (
          <div data-reveal className="mx-auto max-w-md rounded-3xl border border-foreground/10 bg-card p-7 text-center shadow-lg shadow-black/5">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
              <LayoutDashboard size={22} aria-hidden />
            </span>
            <p className="text-sm text-foreground/60">You are signed in.</p>
            <Link
              href={dashboardHref}
              className={`mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 ${FOCUS}`}
            >
              Open my dashboard <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {PORTALS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={p.title} data-reveal data-reveal-d={`${i + 1}`} className="rounded-3xl border border-foreground/10 bg-card p-7 shadow-lg shadow-black/5">
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${p.tone}`}>
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">{p.text}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={p.primary.href}
                      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 ${FOCUS}`}
                    >
                      {p.primary.label} <ArrowRight size={15} aria-hidden />
                    </Link>
                    {p.secondary && (
                      <Link href={p.secondary.href} className={`rounded-full text-sm font-semibold text-primary hover:underline dark:text-accent ${FOCUS}`}>
                        {p.secondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
