'use client';

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Cog,
  Compass,
  GraduationCap,
  Globe,
  Handshake,
  Share2,
  ShieldCheck,
  Store,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

/** Who the Partner Network is for (Ecosystem Blueprint §5). */
const GROUPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Students', icon: GraduationCap },
  { label: 'Professionals', icon: Briefcase },
  { label: 'Consultants', icon: Compass },
  { label: 'Educators', icon: BookOpen },
  { label: 'Business Owners', icon: Store },
  { label: 'Community Leaders', icon: Users },
  { label: 'International Representatives', icon: Globe },
];

/** The five-step partner journey (Ecosystem Blueprint §5). */
const STEPS: { title: string; text: string; icon: LucideIcon }[] = [
  { title: 'Register', text: 'Join the GlofiHub Partner Network.', icon: UserPlus },
  { title: 'Get Trained', text: 'Learn how GlofiHub and its services work.', icon: BookOpenCheck },
  { title: 'Refer / Submit Leads', text: 'Share genuine enquiries from your network.', icon: Share2 },
  { title: 'GlofiHub Handles the Process', text: 'Our team takes it from here.', icon: Cog },
  { title: 'Earn According to Eligible Transactions', text: 'Earnings follow genuine, eligible customer transactions.', icon: BadgeCheck },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

/** Send the visitor to the contact form with "Partner Network" preselected. */
function becomePartner() {
  window.dispatchEvent(
    new CustomEvent('prefillContact', {
      detail: { requirement: 'partners', message: "I'd like to become a GlofiHub partner." },
    })
  );
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/** Home-page Partner Network: who can join, the five-step journey, the earnings policy and a CTA. */
export function PartnerNetworkSection() {
  return (
    <section
      id="partner-network"
      className="relative overflow-hidden border-y border-white/10 bg-gradient-to-br from-[#061633] via-[#0A2F6B] to-[#0d3f95] px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8 scroll-mt-20"
    >
      {/* Component-scoped keyframes: the dashed connector lines flow gently along the journey. */}
      <style>{`
        .pn-link-h {
          background-image: linear-gradient(to right, rgba(255,255,255,0.5) 0 6px, transparent 6px 12px);
          background-size: 12px 2px;
          background-repeat: repeat-x;
          animation: pnFlowH 1.4s linear infinite;
        }
        .pn-link-v {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.5) 0 6px, transparent 6px 12px);
          background-size: 2px 12px;
          background-repeat: repeat-y;
          animation: pnFlowV 1.4s linear infinite;
        }
        @keyframes pnFlowH { to { background-position: 12px 0; } }
        @keyframes pnFlowV { to { background-position: 0 12px; } }
        @media (prefers-reduced-motion: reduce) {
          .pn-link-h, .pn-link-v { animation: none; }
        }
      `}</style>

      {/* Ambient background: glows, dotted grid and a ghost handshake mark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/4 h-[45%] w-[40%] rounded-full bg-sky-400/20 blur-[120px] animate-aurora" />
        <div
          className="absolute -bottom-24 right-1/4 h-[40%] w-[40%] rounded-full bg-emerald-400/15 blur-[120px] animate-aurora"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)',
          }}
        />
        <Handshake
          size={380}
          strokeWidth={0.6}
          className="absolute -bottom-16 -right-16 hidden text-white/[0.05] lg:block"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12" data-reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
            <Handshake size={14} className="text-sky-200" aria-hidden />
            <span className="text-xs font-semibold tracking-wide text-sky-100">GlofiHub Partner Network</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-4xl lg:text-5xl">
            Build With{' '}
            <span className="animate-gradient-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
              GlofiHub
            </span>
          </h2>
          <p className="mt-4 text-base font-semibold text-white/90 md:text-lg">
            Your Network. Our Platform. Shared Growth.
          </p>
        </div>

        {/* Who can join */}
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/60" data-reveal>
            Who can join
          </h3>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {GROUPS.map(({ label, icon: Icon }, i) => (
              <li
                key={label}
                data-reveal
                data-reveal-d={`${(i % 5) + 1}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] py-1.5 pl-1.5 pr-4 text-sm font-medium text-white/90 backdrop-blur-sm hover:border-white/30 hover:bg-white/[0.14]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sky-100">
                  <Icon size={14} aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Journey stepper */}
        <div
          data-reveal
          className="rounded-3xl border border-white/15 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <h3 className="mb-8 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/60 lg:mb-10">
            Your partner journey
          </h3>
          <ol className="grid gap-6 lg:grid-cols-5 lg:gap-0">
            {STEPS.map(({ title, text, icon: Icon }, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li
                  key={title}
                  data-reveal
                  data-reveal-d={`${(i % 5) + 1}`}
                  className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:px-3 lg:text-center"
                >
                  {/* Connector to the next step: vertical on mobile, horizontal on desktop */}
                  {!last && (
                    <>
                      <span aria-hidden className="pn-link-v absolute left-[27px] top-14 -bottom-6 w-[2px] lg:hidden" />
                      <span aria-hidden className="pn-link-h absolute left-1/2 top-[27px] hidden h-[2px] w-full lg:block" />
                    </>
                  )}

                  <span
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 shadow-lg ${
                      last
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30'
                    }`}
                  >
                    <Icon size={24} className="text-white" aria-hidden />
                    <span
                      aria-hidden
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#0A2F6B]"
                    >
                      {i + 1}
                    </span>
                  </span>

                  <div className="min-w-0 flex-1 pt-1 lg:mt-4 lg:flex-none lg:pt-0">
                    <h4 className="font-display text-base font-bold leading-snug text-white">
                      <span className="sr-only">{`Step ${i + 1}: `}</span>
                      {title}
                    </h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Policy note + CTA */}
        <div className="mt-8 grid items-center gap-6 md:mt-10 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div
            data-reveal
            role="note"
            className="relative overflow-hidden rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-5 sm:p-6"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-300 to-teal-400" />
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">
                <ShieldCheck size={22} aria-hidden />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Partner policy</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-white sm:text-base">
                  Partner earnings are tied to genuine, eligible customer transactions — not to recruiting other partners.
                </p>
              </div>
            </div>
          </div>

          <div data-reveal data-reveal-d="2" className="flex lg:justify-end">
            <button
              type="button"
              onClick={becomePartner}
              className={`btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#0A2F6B] shadow-lg shadow-black/25 transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto ${FOCUS_RING}`}
            >
              Become a Partner
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
