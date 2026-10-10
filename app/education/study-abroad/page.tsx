import type { Metadata } from 'next';
import {
  CircleCheck,
  Cpu,
  Globe,
  Landmark,
  Luggage,
  MapPin,
  Microscope,
  PlaneTakeoff,
  Stamp,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { Accent, CtaBand, CtaLink, PageSection, SectionHeading, SiteHero } from '@/components/site/kit';
import { LeadForm, type ExtraField } from '@/components/site/LeadForm';
import { StudyCountries, STUDY_COUNTRY_NAMES } from '@/components/education/StudyCountries';
import { StudySteps, type StudyStep } from '@/components/education/StudySteps';
import { SITE } from '@/lib/site';

const PATH = '/education/study-abroad';
const TITLE = 'Study Abroad';
const OG_TITLE = `${TITLE} | GlofiHub Education`;
const DESCRIPTION =
  'Study abroad in Russia, Georgia, Uzbekistan, Kazakhstan and Kyrgyzstan — MBBS, MD / MS, aviation and B.Tech programs with on-ground support from GlofiHub.';

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
  'Direct admissions to premier medical & state universities across Russia, Georgia, Uzbekistan, Kazakhstan and Kyrgyzstan, with full on-ground support.';

// Claims from the existing "MBBS Abroad Counselling" flyer.
const MBBS_POINTS = ['NMC & WHO approved universities', 'No donation · Affordable fees', 'End-to-end visa & admission support'];

// The other programs offered abroad (existing GlofiHub copy); "Global MBBS" is the highlighted block.
const OTHER_PROGRAMS: { name: string; text: string; icon: LucideIcon; tile: string }[] = [
  {
    name: 'International MD / MS',
    text: 'Postgraduate medical study at universities abroad.',
    icon: Microscope,
    tile: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Aviation & Pilot Training',
    text: 'Pilot training and aviation programs, with counsellor guidance.',
    icon: PlaneTakeoff,
    tile: 'from-sky-500 to-blue-600',
  },
  {
    name: 'Global B.Tech Programs',
    text: 'Engineering and technology degree programs abroad.',
    icon: Cpu,
    tile: 'from-emerald-500 to-teal-600',
  },
];

// GlofiHub's existing approach, in the order a student meets it.
const STEPS: StudyStep[] = [
  {
    icon: Landmark,
    title: 'University selection',
    text: 'Guidance on choosing a university and applying, plus scholarship and financial-aid assistance.',
  },
  { icon: Stamp, title: 'Visa & interview prep', text: 'Help with visa documentation and interview preparation.' },
  {
    icon: Luggage,
    title: 'Pre-departure orientation',
    text: 'Orientation and planning before you leave for your host country.',
  },
  { icon: MapPin, title: 'On-ground support', text: 'Support from the GlofiHub team in your host country.' },
];

const EXTRA_FIELDS: ExtraField[] = [
  { name: 'preferred_country', label: 'Preferred country', type: 'select', options: [...STUDY_COUNTRY_NAMES, 'Not sure'] },
  { name: 'preferred_course', label: 'Preferred course', placeholder: 'e.g. MBBS, B.Tech, Aviation' },
];

export default function StudyAbroadPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={Globe}
        eyebrow="Education abroad"
        title={
          <>
            Study <Accent>Abroad</Accent>
          </>
        }
        lead={LEAD}
        ctas={[
          { label: 'Talk to a counsellor', href: '/counselling' },
          { label: 'Send an enquiry', href: '#enquire', variant: 'outline' },
        ]}
      />

      {/* Destinations */}
      <PageSection labelledBy="abroad-destinations-heading">
        <SectionHeading
          id="abroad-destinations-heading"
          eyebrow="Destinations"
          title={
            <>
              Where you can <Accent>study</Accent>
            </>
          }
          intro="Choose a destination — our counsellors help you find the right university there."
        />
        <StudyCountries />
      </PageSection>

      {/* Programs abroad, with the MBBS block highlighted */}
      <PageSection tone="muted" className="overflow-hidden" labelledBy="abroad-programs-heading">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 animate-aurora rounded-full bg-emerald-500/10 blur-[100px]"
        />
        <div className="relative">
          <SectionHeading
            id="abroad-programs-heading"
            eyebrow="What you can study"
            title={
              <>
                Programs you can <Accent>pursue abroad</Accent>
              </>
            }
            intro="From medicine to aviation, our counsellors help you find the right program and university."
          />

          <ul role="list" aria-label="Programs available abroad" className="grid gap-5 md:grid-cols-3">
            {/* MBBS abroad — highlighted */}
            <li
              data-reveal
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-7 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 sm:p-9 md:col-span-3 lg:col-span-2 lg:row-span-3"
            >
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 animate-aurora rounded-full bg-emerald-400/20 blur-3xl"
              />
              <Stethoscope
                aria-hidden
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 text-white/10"
              />
              <div className="relative flex h-full flex-col">
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide">
                  <Stethoscope size={14} aria-hidden /> MBBS abroad
                </span>
                <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight">Global MBBS</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                  Study medicine in Russia, Georgia, Kazakhstan and more.
                </p>
                <ul role="list" className="mt-6 space-y-3.5">
                  {MBBS_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm font-semibold leading-snug sm:text-base">
                      <CircleCheck size={20} className="mt-px shrink-0 text-emerald-300" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 lg:mt-auto lg:pt-8">
                  <CtaLink cta={{ label: 'Ask about MBBS abroad', href: '#enquire' }} onDark />
                </div>
              </div>
            </li>

            {OTHER_PROGRAMS.map(({ name, text, icon: Icon, tile }, i) => (
              <li
                key={name}
                data-reveal
                data-reveal-d={i + 1}
                className="group flex items-start gap-4 rounded-3xl border border-foreground/10 bg-card p-5 shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:hover:translate-y-0 sm:p-6 md:flex-col lg:flex-row"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md shadow-black/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 ${tile}`}
                >
                  <Icon size={22} className="text-white" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight">{name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center" data-reveal>
            <CtaLink cta={{ label: 'Explore all programs', href: '/education/programs', variant: 'link' }} />
          </div>
        </div>
      </PageSection>

      {/* Approach */}
      <PageSection labelledBy="abroad-approach-heading">
        <SectionHeading
          id="abroad-approach-heading"
          eyebrow="Our approach"
          title={
            <>
              Support at <Accent>every stage</Accent>
            </>
          }
          intro="From choosing a university to support in your host country, GlofiHub stays with you."
        />
        <StudySteps steps={STEPS} label="How GlofiHub supports you when you study abroad" />
      </PageSection>

      {/* Enquiry */}
      <PageSection id="enquire" tone="muted" className="scroll-mt-32">
        <div data-reveal className="mx-auto max-w-3xl">
          <LeadForm
            requirement="Education"
            source="education-study-abroad"
            title="Ask about studying abroad"
            intro="Tell us which country and course interest you, and how you would like us to reach you."
            extraFields={EXTRA_FIELDS}
            messageLabel="Your question"
            whatsappText="Hi GlofiHub! I would like to know more about studying abroad."
          />
        </div>
      </PageSection>

      <CtaBand
        title="Planning to study abroad?"
        text="Talk to a GlofiHub counsellor about universities, visas and on-ground support in your chosen country."
        ctas={[
          { label: 'Talk to a counsellor', href: '/counselling' },
          { label: 'Explore Study in India', href: '/education/study-in-india', variant: 'outline' },
        ]}
      />
    </main>
  );
}
