import Link from 'next/link';
import { ArrowRight, GraduationCap, LogIn, MessageCircle, Stethoscope, UserPlus } from 'lucide-react';
import { SITE } from '@/lib/site';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  'Hi GlofiHub! 👋 I would like free counselling for study in India / abroad.'
)}`;

/** Hero of the GlofiHub Education & Counselling section (/counselling). Owns this page's h1. */
export function CounsellingHero() {
  return (
    <section id="counselling-home" className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[45%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-[40%] h-[45%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold tracking-wide text-primary dark:text-accent mb-5">
          <GraduationCap size={14} aria-hidden /> GlofiHub Education
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Education &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
            Career Counselling
          </span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-foreground/65 font-medium leading-relaxed">
          Study in India &amp; abroad — MBBS, BDS, Engineering, Management and more — with expert counsellors, in-app chat and
          on-ground support.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-foreground/60">
          <Stethoscope size={15} aria-hidden /> Medical · Technology · Management · Other programs
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl transition-all ${FOCUS}`}
          >
            <MessageCircle size={16} aria-hidden /> Free Counselling
          </a>
          <Link
            href="/register"
            className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card border border-foreground/15 text-foreground font-semibold text-sm hover:border-primary/40 transition-all ${FOCUS}`}
          >
            <UserPlus size={16} aria-hidden /> Student Sign Up
          </Link>
          <Link
            href="/login"
            className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-primary dark:text-accent hover:underline ${FOCUS}`}
          >
            <LogIn size={16} aria-hidden /> Login <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
