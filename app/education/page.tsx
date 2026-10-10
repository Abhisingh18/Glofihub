import type { Metadata } from 'next';
import { GraduationCap, MapPin } from 'lucide-react';
import { Contact } from '@/components/Contact';
import { EduIndiaAbroad } from '@/components/education/EduIndiaAbroad';
import { EduJourney } from '@/components/education/EduJourney';
import { EduPathways } from '@/components/education/EduPathways';
import { Accent, CtaBand, SiteHero } from '@/components/site/kit';
import { SITE } from '@/lib/site';

const TITLE = 'GlofiHub Education — Study in India & Abroad';
const DESCRIPTION =
  'Education pathways in India and abroad — MBBS, BDS, Engineering, Management and more. Explore programs, compare studying in India and abroad, and get counselling support from GlofiHub Education.';

export const metadata: Metadata = {
  // `absolute` so the layout's "%s | GlofiHub Education" template does not repeat the brand name.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/education' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: '/education',
    images: [{ url: SITE.ogImage, width: 500, height: 500, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.ogImage],
  },
};

/**
 * GlofiHub Education — home of the Education website (no login anywhere). Navbar and footer come
 * from the site layout. Sections: hero → pathways → India vs abroad → journey → guidance band → contact.
 */
export default function EducationHomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        id="education-home"
        icon={GraduationCap}
        eyebrow="GlofiHub Education"
        title={
          <>
            Education pathways in <Accent>India and abroad</Accent>
          </>
        }
        lead="MBBS, BDS, Engineering, Management and more — explore your options in India and abroad, with guidance from university selection to pre-departure planning."
        ctas={[
          { label: 'Talk to a Counsellor', href: '/counselling' },
          { label: 'Explore Programs', href: '/education/programs', variant: 'outline' },
        ]}
      >
        <p className="mt-8 flex items-start justify-center gap-2 text-xs font-semibold text-foreground/60 sm:items-center">
          <MapPin size={14} aria-hidden className="mt-0.5 shrink-0 sm:mt-0" />
          <span>On-ground support in Russia, Georgia, Uzbekistan, Kazakhstan &amp; Kyrgyzstan</span>
        </p>
      </SiteHero>

      <EduPathways />
      <EduIndiaAbroad />
      <EduJourney />

      <CtaBand
        id="guidance"
        title="Need guidance? Talk to a counsellor."
        text="Get free counselling for study in India and abroad, and keep in touch through the student portal with secure in-app chat."
        ctas={[
          { label: 'Free counselling', href: '/counselling' },
          { label: 'Student portal', href: '/counselling#portal', variant: 'outline' },
        ]}
      />

      <Contact defaultRequirement="education" />
    </main>
  );
}
