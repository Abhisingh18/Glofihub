import type { Metadata } from 'next';
import {
  BriefcaseBusiness,
  CircleCheck,
  ClipboardCheck,
  Cpu,
  GraduationCap,
  HandCoins,
  Landmark,
  Library,
  ListChecks,
  MessagesSquare,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { Accent, CtaBand, CtaLink, PageSection, SectionHeading, SiteHero } from '@/components/site/kit';
import { LeadForm, type ExtraField } from '@/components/site/LeadForm';
import { StudySteps, type StudyStep } from '@/components/education/StudySteps';
import { SITE } from '@/lib/site';

const PATH = '/education/study-in-india';
const TITLE = 'Study in India';
const OG_TITLE = `${TITLE} | GlofiHub Education`;
const DESCRIPTION =
  'Admission in leading Indian private and state institutions with certified counselling — MBBS / BDS, B.Tech / CSE / IT, MBA / PGDM and BBA / BCA / MCA.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: PATH,
    title: OG_TITLE,
    description: DESCRIPTION,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: { card: 'summary_large_image', title: OG_TITLE, description: DESCRIPTION, images: [SITE.ogImage] },
};

const LEAD =
  'Secure admission in leading Indian private and state institutions for top programs, with dedicated, certified counselling.';

interface Program {
  category: string;
  name: string;
  text: string;
  icon: LucideIcon;
  /** Gradient classes for the icon tile. */
  tile: string;
}

// Program groups available in India (existing GlofiHub copy), labelled to match /education/programs.
const PROGRAMS: Program[] = [
  {
    category: 'Medical',
    name: 'MBBS / BDS',
    text: 'Medical and dental degree programs, with guidance from shortlisting to application.',
    icon: Stethoscope,
    tile: 'from-rose-500 to-pink-600',
  },
  {
    category: 'Technology',
    name: 'B.Tech / CSE / IT',
    text: 'Engineering, computer science and information technology programs.',
    icon: Cpu,
    tile: 'from-indigo-500 to-violet-600',
  },
  {
    category: 'Management',
    name: 'MBA / PGDM',
    text: 'Postgraduate management programs, with profile evaluation and college shortlisting.',
    icon: BriefcaseBusiness,
    tile: 'from-amber-500 to-orange-600',
  },
  {
    category: 'Business & computer applications',
    name: 'BBA / BCA / MCA',
    text: 'Undergraduate and postgraduate programs in business and computer applications.',
    icon: Library,
    tile: 'from-emerald-500 to-teal-600',
  },
];

const HELP: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: 'University selection & application guidance',
    text: 'Shortlist suitable institutions and get step-by-step help with your applications.',
    icon: Landmark,
  },
  {
    title: 'Scholarship & financial-aid assistance',
    text: 'Find out about the scholarship and financial-aid options that may be open to you.',
    icon: HandCoins,
  },
];

// From the existing MBA counselling flyer.
const MBA_POINTS = [
  'Profile evaluation & college shortlisting',
  'Scholarship & education loan guidance',
  'Application + interview preparation',
];

const STEPS: StudyStep[] = [
  { icon: MessagesSquare, title: 'Talk to a counsellor', text: 'Share your goals and background with a GlofiHub counsellor.' },
  { icon: ListChecks, title: 'Shortlist', text: 'Compare suitable programs and institutions together.' },
  { icon: ClipboardCheck, title: 'Apply', text: 'Get guidance on your applications and documents.' },
  { icon: GraduationCap, title: 'Admission', text: 'Move ahead with your admission, with support along the way.' },
];

const EXTRA_FIELDS: ExtraField[] = [
  {
    name: 'program_interest',
    label: 'Program of interest',
    type: 'select',
    options: ['MBBS / BDS', 'B.Tech / CSE / IT', 'MBA / PGDM', 'BBA / BCA / MCA', 'Not sure yet'],
  },
];

export default function StudyInIndiaPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={GraduationCap}
        eyebrow="Education in India"
        title={
          <>
            Study in <Accent>India</Accent>
          </>
        }
        lead={LEAD}
        ctas={[
          { label: 'Talk to a counsellor', href: '/counselling' },
          { label: 'Send an enquiry', href: '#enquire', variant: 'outline' },
        ]}
      />

      {/* Program groups */}
      <PageSection labelledBy="india-programs-heading">
        <SectionHeading
          id="india-programs-heading"
          eyebrow="Programs in India"
          title={
            <>
              Programs you can <Accent>pursue in India</Accent>
            </>
          }
          intro="Our counsellors guide you across medicine, engineering, management and computer applications."
        />

        <ul role="list" aria-label="Program groups available in India" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map(({ category, name, text, icon: Icon, tile }, i) => (
            <li
              key={name}
              data-reveal
              data-reveal-d={i + 1}
              className="group flex flex-col rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:hover:translate-y-0"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg shadow-black/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 ${tile}`}
              >
                <Icon size={26} className="text-white" aria-hidden />
              </span>
              <p className="mt-5 text-xs font-semibold tracking-wide text-primary dark:text-accent">{category}</p>
              <h3 className="mt-1 font-display text-xl font-bold leading-tight tracking-tight">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center" data-reveal>
          <CtaLink cta={{ label: 'Explore all programs', href: '/education/programs', variant: 'link' }} />
        </div>
      </PageSection>

      {/* What our counsellors help with */}
      {/* overflow-clip (not hidden) so the heading column can stay sticky on large screens */}
      <PageSection tone="muted" className="overflow-clip" labelledBy="india-help-heading">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 animate-aurora rounded-full bg-primary/10 blur-[100px]"
        />
        <div className="relative grid gap-2 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="india-help-heading"
              align="left"
              eyebrow="How we help"
              title={
                <>
                  What our <Accent>counsellors help with</Accent>
                </>
              }
              intro="From choosing an institution to planning your finances, our counsellors guide you through each step."
            />
          </div>

          <div className="space-y-5 lg:col-span-7">
            <ul role="list" className="space-y-5">
              {HELP.map(({ title, text, icon: Icon }, i) => (
                <li
                  key={title}
                  data-reveal
                  data-reveal-d={i + 1}
                  className="flex items-start gap-4 rounded-3xl border border-foreground/10 bg-card p-5 shadow-lg shadow-black/5 sm:p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-accent">
                    <Icon size={22} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-snug tracking-tight">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* MBA counselling highlight */}
            <div
              data-reveal
              data-reveal-d="3"
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-6 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 sm:p-8"
            >
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 animate-aurora rounded-full bg-emerald-400/20 blur-3xl"
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white">
                  <BriefcaseBusiness size={14} aria-hidden /> MBA counselling
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight">Planning an MBA or PGDM?</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">Pick the right program for your career.</p>
                <ul role="list" className="mt-5 space-y-3">
                  {MBA_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm font-semibold leading-snug">
                      <CircleCheck size={18} className="mt-px shrink-0 text-emerald-300" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Next steps */}
      <PageSection labelledBy="india-steps-heading">
        <SectionHeading
          id="india-steps-heading"
          eyebrow="Next steps"
          title={
            <>
              Your path to <Accent>admission</Accent>
            </>
          }
          intro="A simple, guided route from your first conversation to your admission."
        />
        <StudySteps steps={STEPS} label="Steps from your first conversation to admission" />
      </PageSection>

      {/* Enquiry */}
      <PageSection id="enquire" tone="muted" className="scroll-mt-32">
        <div data-reveal className="mx-auto max-w-3xl">
          <LeadForm
            requirement="Education"
            source="education-study-in-india"
            title="Ask about studying in India"
            intro="Tell us what you are looking for and how you would like us to reach you."
            extraFields={EXTRA_FIELDS}
            messageLabel="Your question"
            whatsappText="Hi GlofiHub! I would like to know more about studying in India."
          />
        </div>
      </PageSection>

      <CtaBand
        title="Ready to take the first step?"
        text="Talk to a GlofiHub counsellor about the right program and institution for you in India."
        ctas={[
          { label: 'Talk to a counsellor', href: '/counselling' },
          { label: 'Explore Study Abroad', href: '/education/study-abroad', variant: 'outline' },
        ]}
      />
    </main>
  );
}
