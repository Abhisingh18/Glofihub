import { Award, Compass, GraduationCap, PencilRuler, Rocket } from 'lucide-react';
import { Accent, PageSection, SectionHeading } from '@/components/site/kit';
import { AcademySteps, type AcademyStep } from './AcademySteps';

// Generic wording on purpose: this is how the journey is being shaped, not a promise about a specific course.
const STEPS: AcademyStep[] = [
  {
    title: 'Choose a track',
    text: 'Pick the course area that matches your goal, from technology and languages to career preparation.',
    icon: Compass,
  },
  {
    title: 'Learn with experts',
    text: 'Learn from educators and industry professionals, in the format that suits you.',
    icon: GraduationCap,
  },
  {
    title: 'Build skills with practice',
    text: 'Reinforce each lesson with practice, so your skills grow step by step.',
    icon: PencilRuler,
  },
  {
    title: 'Earn a certificate',
    text: 'Complete a program and receive a certificate that shows your progress.',
    icon: Award,
  },
  {
    title: 'Move forward',
    text: 'Take your new skills into your studies, your job search or your business.',
    icon: Rocket,
  },
];

/** Academy home, section 3: the "How learning works" stepper. Server component. */
export function AcademyHowItWorks() {
  return (
    <PageSection id="how-learning-works" tone="muted" labelledBy="academy-how-heading">
      <SectionHeading
        id="academy-how-heading"
        eyebrow="The journey"
        title={
          <>
            How learning <Accent>works</Accent>
          </>
        }
        intro="From choosing a track to taking your next step, this is how we are shaping the learning journey."
      />

      <AcademySteps steps={STEPS} />

      <p data-reveal className="mx-auto mt-10 max-w-xl text-center text-xs font-medium leading-relaxed text-foreground/65 md:text-sm">
        Details will be confirmed for each course as it launches.
      </p>
    </PageSection>
  );
}
