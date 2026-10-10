import { BadgeCheck, Briefcase, GraduationCap, UserRound } from 'lucide-react';
import { CtaLink, PageSection } from '@/components/site/kit';

/**
 * Academy home, section 4: "Learn from people who know the journey". An honest shell: the faculty is
 * still being built, so there are no names, photos or credentials, only who we are looking for.
 * Server component.
 */
export function AcademyFacultyBlock() {
  return (
    <PageSection id="faculty" tone="plain" labelledBy="academy-faculty-heading" className="scroll-mt-20">
      <div
        data-reveal
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 p-6 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 sm:p-10 lg:p-12"
      >
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 animate-aurora rounded-full bg-emerald-500/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
              <GraduationCap size={14} className="text-emerald-300" aria-hidden />
              <span className="text-xs font-semibold tracking-wide text-white/90">Faculty</span>
            </div>
            <h2
              id="academy-faculty-heading"
              className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            >
              Learn from people who{' '}
              <span className="animate-gradient-text bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                know the journey
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              We are building a faculty of verified educators and industry professionals for GlofiHub Academy. If you
              teach or work in one of our course areas, we would like to hear from you.
            </p>
            <div className="mt-7">
              <CtaLink cta={{ label: 'Become a GlofiHub instructor', href: '/academy/teach' }} onDark />
            </div>
          </div>

          {/* Honest shell: who we are building the faculty with; profiles will follow. */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
              <p className="text-xs font-semibold tracking-wide text-white/75">Who we are building this with</p>
              <ul role="list" className="mt-4 space-y-3.5">
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <BadgeCheck size={18} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Verified educators</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-white/75">Subject teachers and trainers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Briefcase size={18} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Industry professionals</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-white/75">People working in the field today.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-5">
                <div aria-hidden className="flex shrink-0 -space-x-2.5">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/35 bg-[#0A2F6B] text-white/45"
                    >
                      <UserRound size={18} />
                    </span>
                  ))}
                </div>
                <p className="text-xs font-medium leading-snug text-white/75">
                  Faculty profiles will be introduced here as educators join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
