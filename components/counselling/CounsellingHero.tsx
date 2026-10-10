import Link from 'next/link';
import { ArrowRight, HeartHandshake, LayoutDashboard, LogIn, MessageCircle, UserPlus } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Accent } from '@/components/site/kit';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  'Hi GlofiHub! 👋 I would like free counselling for study in India / abroad.'
)}`;

/**
 * Hero of the GlofiHub Counselling website (/counselling). Owns this page's h1.
 * When the visitor is signed in, the sign-up / login buttons become "Open my dashboard".
 */
export function CounsellingHero({ dashboardHref }: { dashboardHref?: string | null }) {
  return (
    <section id="counselling-home" className="relative overflow-hidden px-4 pb-16 pt-36 sm:px-6 md:pb-24 md:pt-44 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-0 h-[45%] w-[40%] animate-aurora rounded-full bg-primary/10 blur-[120px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 h-[45%] w-[40%] animate-aurora rounded-full bg-emerald-500/10 blur-[120px]"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary dark:text-accent">
          <HeartHandshake size={14} aria-hidden /> GlofiHub Counselling
        </span>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          Expert counselling for <Accent>study in India &amp; abroad</Accent>
        </h1>
        <p className="mt-5 text-base font-medium leading-relaxed text-foreground/65 md:text-lg">
          Talk to expert counsellors, follow your journey in your student portal and chat securely in-app — phone numbers are
          never shared in chat.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl ${FOCUS}`}
          >
            <MessageCircle size={16} aria-hidden /> Free Counselling
            <span className="sr-only"> (opens WhatsApp in a new tab)</span>
          </a>
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className={`inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 ${FOCUS}`}
            >
              <LayoutDashboard size={16} aria-hidden /> Open my dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className={`inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 ${FOCUS}`}
              >
                <UserPlus size={16} aria-hidden /> New Student
              </Link>
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-primary hover:underline dark:text-accent ${FOCUS}`}
              >
                <LogIn size={16} aria-hidden /> Existing Student <ArrowRight size={14} aria-hidden />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
