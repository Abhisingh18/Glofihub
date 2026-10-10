import type { Metadata } from 'next';
import { BookOpen, Check, Info, Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { EDU_GROUPS, EDU_PROGRAMS } from '@/components/education/EduProgramData';
import { EduPlaceTag } from '@/components/education/EduPlaceTag';
import { EduProgramGroup } from '@/components/education/EduProgramGroup';
import { Accent, CtaBand, PageSection, SiteHero } from '@/components/site/kit';
import { LeadForm, type ExtraField } from '@/components/site/LeadForm';
import { SITE } from '@/lib/site';

const TITLE = 'Programs';
const DESCRIPTION =
  'Explore programs in India and abroad — MBBS, BDS, B.Tech, MBA, PGDM, BBA, BCA, MCA, Global MBBS, International MD / MS and Aviation & Pilot Training.';

export const metadata: Metadata = {
  // The Education layout adds " | GlofiHub Education" to this title.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/education/programs' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${TITLE} | GlofiHub Education`,
    description: DESCRIPTION,
    url: '/education/programs',
    images: [{ url: SITE.ogImage, width: 500, height: 500, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: {
    card: 'summary',
    title: `${TITLE} | GlofiHub Education`,
    description: DESCRIPTION,
    images: [SITE.ogImage],
  },
};

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Business-specific questions; the answers are added to the lead's message in the CRM inbox. */
const ENQUIRY_FIELDS: ExtraField[] = [
  { name: 'study_in', label: 'Study in', type: 'select', options: ['India', 'Abroad', 'Not sure yet'] },
  {
    name: 'program',
    label: 'Program of interest',
    type: 'select',
    options: [...EDU_PROGRAMS.map((p) => p.name), 'Not sure yet'],
  },
];

const WHATSAPP_HREF = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  'Hi GlofiHub! I would like to know more about your education programs.'
)}`;

const GOOD_TO_KNOW = [
  'Free counselling for study in India and abroad',
  'Fees and eligibility are explained during counselling',
  'On-ground support in host countries',
];

function ContactRow({
  href,
  icon: Icon,
  label,
  value,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`flex items-center gap-3 rounded-2xl border border-foreground/10 bg-muted/30 p-3 transition-colors hover:border-primary/40 motion-reduce:transition-none ${FOCUS}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/25">
        <Icon size={18} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-wide text-foreground/60">{label}</span>
        <span className="block break-words text-sm font-bold text-foreground">{value}</span>
      </span>
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

/**
 * GlofiHub Education — all programs, grouped Medical / Technology / Management / Other, each tagged
 * "India" / "Abroad" exactly as the existing GlofiHub copy lists them. No fees or eligibility on purpose
 * (they are explained during counselling). Navbar and footer come from the site layout.
 */
export default function EducationProgramsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={BookOpen}
        eyebrow="GlofiHub Education"
        title={<Accent>Programs</Accent>}
        lead="MBBS, BDS, Engineering, Management and more — see which programs are available in India and abroad."
        ctas={[
          { label: 'Talk to a Counsellor', href: '/counselling' },
          { label: 'Send an enquiry', href: '#enquire', variant: 'outline' },
        ]}
      />

      {/* Jump links + how to read the tags */}
      <section aria-label="Browse programs" className="border-y border-foreground/10 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
          <nav aria-label="Program groups">
            <ul role="list" className="flex flex-wrap justify-center gap-2">
              {EDU_GROUPS.map((g) => {
                const Icon = g.icon;
                return (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className={`inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40 motion-reduce:transition-none ${FOCUS}`}
                    >
                      <Icon size={15} aria-hidden />
                      {g.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex flex-col items-center gap-2 text-center text-xs font-medium text-foreground/60 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
            <p className="flex flex-wrap items-center justify-center gap-2">
              <span>Tags show where each program is offered:</span>
              <EduPlaceTag where="india" />
              <EduPlaceTag where="abroad" />
            </p>
            <p className="flex items-center gap-1.5">
              <Info size={14} aria-hidden className="shrink-0" />
              <span>Fees and eligibility are explained during counselling.</span>
            </p>
          </div>
        </div>
      </section>

      {EDU_GROUPS.map((g, i) => (
        <EduProgramGroup key={g.id} group={g} tone={i % 2 === 0 ? 'plain' : 'muted'} askRow={g.id === 'other'} />
      ))}

      <CtaBand
        title="Not sure which program fits you?"
        text="Fees and eligibility are explained during counselling, based on the program and destination you choose."
        ctas={[
          { label: 'Book free counselling', href: '/counselling' },
          { label: 'Send an enquiry', href: '#enquire', variant: 'outline' },
        ]}
      />

      <PageSection tone="muted">
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
          <div id="enquire" className="scroll-mt-28 lg:col-span-3" data-reveal>
            <LeadForm
              requirement="Education"
              source="education-programs"
              title="Enquire about a program"
              intro="Tell us which program you are considering and whether you are looking at India or abroad. A counsellor will get back to you on your preferred contact method."
              extraFields={ENQUIRY_FIELDS}
              messageLabel="Anything else we should know?"
              submitLabel="Send enquiry"
              successText="Thank you — we have received your enquiry. A GlofiHub counsellor will be in touch."
              whatsappText="Hi GlofiHub! I would like to know more about your education programs."
            />
          </div>

          <aside aria-label="Other ways to reach us" className="space-y-5 lg:col-span-2" data-reveal data-reveal-d="1">
            <div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5">
              <h3 className="font-display text-lg font-extrabold tracking-tight">Prefer to talk first?</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                Call or message us and we will help you choose a program.
              </p>
              <ul role="list" className="mt-5 space-y-3">
                <li>
                  <ContactRow href={`tel:${SITE.phone}`} icon={Phone} label="Call us" value={SITE.phoneDisplay} />
                </li>
                <li>
                  <ContactRow href={WHATSAPP_HREF} icon={MessageCircle} label="WhatsApp" value={SITE.phoneDisplay} external />
                </li>
                <li>
                  <ContactRow href={`mailto:${SITE.email}`} icon={Mail} label="Email us" value={SITE.email} />
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5">
              <h3 className="font-display text-lg font-extrabold tracking-tight">Good to know</h3>
              <ul role="list" className="mt-4 space-y-3">
                {GOOD_TO_KNOW.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium leading-snug text-foreground/80">
                    <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15">
                      <Check size={12} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </PageSection>
    </main>
  );
}
