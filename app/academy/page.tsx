import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { Accent, SiteHero } from '@/components/site/kit';
import { Contact } from '@/components/Contact';
import { AcademyFormatCards } from '@/components/academy/AcademyFormatCards';
import { AcademyCategoryGrid } from '@/components/academy/AcademyCategoryGrid';
import { AcademyHowItWorks } from '@/components/academy/AcademyHowItWorks';
import { AcademyFacultyBlock } from '@/components/academy/AcademyFacultyBlock';
import { AcademyCrossLinks } from '@/components/academy/AcademyCrossLinks';
import { academyMetadata } from '@/components/academy/AcademyMetadata';

export const metadata: Metadata = academyMetadata({
  title: 'GlofiHub Academy — Learn Skills That Move You Forward',
  absoluteTitle: true,
  description:
    'Online courses, live classes, workshops and certifications from GlofiHub Academy: AI, IT, creative and marketing skills, languages and career preparation. Launching soon.',
  path: '/academy',
});

// GlofiHub Academy — its own website inside the GlofiHub group. Launching soon: no prices, schedules,
// instructors or enrolment, only what is planned and a way to get notified. Navbar and footer come
// from app/academy/layout.tsx.
export default function AcademyHomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        id="academy-home"
        icon={BookOpen}
        eyebrow="GlofiHub Academy"
        badge="Launching soon"
        title={
          <>
            Learn skills that <Accent>move you forward</Accent>
          </>
        }
        lead="Online courses, live classes, workshops and certifications."
        ctas={[
          { label: 'Explore courses', href: '/academy/courses' },
          { label: 'Get notified', href: '#contact', variant: 'outline' },
        ]}
      />
      <AcademyFormatCards />
      <AcademyCategoryGrid />
      <AcademyHowItWorks />
      <AcademyFacultyBlock />
      <AcademyCrossLinks />
      <Contact defaultRequirement="academy" />
    </main>
  );
}
