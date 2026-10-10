import type { Metadata } from 'next';
import { BookOpen, Briefcase, ClipboardCheck, FileText, GraduationCap, Link2, Presentation, UserPlus } from 'lucide-react';
import { Accent, CtaBand, PageSection, SectionHeading, SiteHero } from '@/components/site/kit';
import { LeadForm, type ExtraField } from '@/components/site/LeadForm';
import { AcademyFormSection } from '@/components/academy/AcademyFormSection';
import { AcademySteps, type AcademyStep } from '@/components/academy/AcademySteps';
import { AcademyWhoWeSeek } from '@/components/academy/AcademyWhoWeSeek';
import { academyMetadata } from '@/components/academy/AcademyMetadata';

export const metadata: Metadata = academyMetadata({
  title: 'Teach with Us',
  description:
    'Join the GlofiHub Academy faculty. We are looking for subject teachers, trainers and industry professionals — tell us about your subject and experience.',
  path: '/academy/teach',
});

// Generic on purpose: no payment, commission or timeline terms are promised here.
const STEPS: AcademyStep[] = [
  {
    title: 'Apply',
    text: 'Tell us your subject, your experience and a link to your profile or portfolio.',
    icon: FileText,
  },
  {
    title: 'We review',
    text: 'Our team reviews your application and your area of expertise.',
    icon: ClipboardCheck,
  },
  {
    title: 'Onboarding',
    text: 'If it is a good fit, we guide you through getting started.',
    icon: UserPlus,
  },
  {
    title: 'Teach',
    text: 'Share your expertise with learners as GlofiHub Academy launches.',
    icon: Presentation,
  },
];

const EXTRA_FIELDS: ExtraField[] = [
  { name: 'subject', label: 'Subject / skill area', required: true, placeholder: 'e.g. Spoken English, Graphic Design' },
  { name: 'experience', label: 'Years of experience', placeholder: 'e.g. 5' },
  { name: 'profile', label: 'LinkedIn or portfolio link', placeholder: 'https://' },
];

// GlofiHub Academy — teach with us. The faculty is still being built: this page only says who we are
// looking for and collects applications. No names, payment terms or schedules.
export default function AcademyTeachPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={GraduationCap}
        eyebrow="For educators and professionals"
        badge="Building our faculty"
        title={
          <>
            Teach with <Accent>GlofiHub</Accent>
          </>
        }
        lead="Share what you know with learners. We are building a faculty of educators and industry professionals for GlofiHub Academy. Tell us about your subject and your experience."
        ctas={[
          { label: 'Apply to teach', href: '#apply' },
          { label: 'How it works', href: '#how-it-works', variant: 'outline' },
        ]}
      />

      <AcademyWhoWeSeek />

      <PageSection id="how-it-works" tone="plain" labelledBy="teach-how-heading" className="scroll-mt-20">
        <SectionHeading
          id="teach-how-heading"
          eyebrow="The process"
          title={
            <>
              How it <Accent>works</Accent>
            </>
          }
          intro="A simple path from your application to teaching with GlofiHub Academy."
        />
        <AcademySteps steps={STEPS} />
        <p data-reveal className="mx-auto mt-10 max-w-xl text-center text-xs font-medium leading-relaxed text-foreground/65 md:text-sm">
          Details are shared with each educator as the Academy takes shape.
        </p>
      </PageSection>

      <AcademyFormSection
        id="apply"
        tone="muted"
        eyebrow="Apply to teach"
        icon={GraduationCap}
        intro="We are building our faculty step by step. Tell us what you teach and a little about your experience."
        points={[
          { icon: BookOpen, text: 'The subject or skill area you would teach.' },
          { icon: Briefcase, text: 'A short note on your experience.' },
          { icon: Link2, text: 'A LinkedIn or portfolio link, if you have one.' },
        ]}
      >
        <LeadForm
          requirement="Academy / Courses"
          source="academy-instructor"
          title="Become a GlofiHub instructor"
          intro="Share your details and the subject you would like to teach."
          extraFields={EXTRA_FIELDS}
          messageLabel="About you"
          submitLabel="Apply to teach"
          successText="Thanks — we have received your application and our team will review it."
          whatsappText="Hi GlofiHub! I'd like to teach with GlofiHub Academy."
        />
      </AcademyFormSection>

      <CtaBand
        title="Looking to learn instead?"
        text="See the course areas we are planning and tell us what you want to learn."
        ctas={[
          { label: 'Explore courses', href: '/academy/courses' },
          { label: 'Back to Academy', href: '/academy', variant: 'outline' },
        ]}
      />
    </main>
  );
}
