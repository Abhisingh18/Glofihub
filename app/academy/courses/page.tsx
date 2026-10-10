import type { Metadata } from 'next';
import { Bell, BookOpen, MonitorPlay } from 'lucide-react';
import { Accent, CtaBand, SiteHero } from '@/components/site/kit';
import { LeadForm, type ExtraField } from '@/components/site/LeadForm';
import { AcademyCourseGroups } from '@/components/academy/AcademyCourseGroups';
import { AcademyFormSection } from '@/components/academy/AcademyFormSection';
import { AcademyGroupNav } from '@/components/academy/AcademyGroupNav';
import { ACADEMY_CATEGORY_NAMES, ACADEMY_MODES } from '@/components/academy/AcademyData';
import { academyMetadata } from '@/components/academy/AcademyMetadata';

export const metadata: Metadata = academyMetadata({
  title: 'Courses',
  description:
    'Course areas planned for GlofiHub Academy: AI, IT, design, marketing, languages, career skills and Medical / FMGE. Launching soon — tell us what you want to learn.',
  path: '/academy/courses',
});

const EXTRA_FIELDS: ExtraField[] = [
  { name: 'category', label: 'Course category', type: 'select', options: ACADEMY_CATEGORY_NAMES },
  { name: 'mode', label: 'Preferred mode', type: 'select', options: ACADEMY_MODES },
];

// GlofiHub Academy — courses. Launching soon: every category is a planned area, listed without
// prices, schedules, instructors or enrolment. The form collects interest so we can follow up at launch.
export default function AcademyCoursesPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={BookOpen}
        eyebrow="GlofiHub Academy"
        badge="Launching soon"
        title={<Accent>Courses</Accent>}
        lead="Explore the course areas planned for GlofiHub Academy, from AI and IT to languages and career skills. Details will be shared as each one launches."
        ctas={[
          { label: 'Get notified', href: '#interest' },
          { label: 'Teach with us', href: '/academy/teach', variant: 'outline' },
        ]}
      >
        <AcademyGroupNav />
      </SiteHero>

      <AcademyCourseGroups />

      <AcademyFormSection
        id="interest"
        tone="muted"
        eyebrow="Get notified"
        icon={Bell}
        intro="Courses are launching soon. Tell us what you would like to learn and we will let you know when it is ready."
        points={[
          { icon: BookOpen, text: 'Choose the course category that interests you.' },
          { icon: MonitorPlay, text: 'Tell us how you prefer to learn: online, live classes or workshops.' },
          { icon: Bell, text: 'No account or sign-up needed. We will get in touch at launch.' },
        ]}
      >
        <LeadForm
          requirement="Academy / Courses"
          source="academy-courses"
          title="Tell us what you want to learn"
          intro="Share a few details and the area you are interested in."
          extraFields={EXTRA_FIELDS}
          submitLabel="Notify me"
          successText="Thanks — we will let you know when this launches."
          whatsappText="Hi GlofiHub! I'm interested in GlofiHub Academy courses."
        />
      </AcademyFormSection>

      <CtaBand
        title="Are you an educator or industry professional?"
        text="Help us build the GlofiHub Academy faculty. Share your subject and your experience."
        ctas={[{ label: 'Teach with GlofiHub', href: '/academy/teach' }]}
      />
    </main>
  );
}
