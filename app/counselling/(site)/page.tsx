import type { Metadata } from 'next';
import { CounsellingHero } from '@/components/counselling/CounsellingHero';
import { PortalAccess } from '@/components/counselling/PortalAccess';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { ParentReviews } from '@/components/ParentReviews';
import { Videos } from '@/components/Videos';
import { Achievements } from '@/components/Achievements';
import { Contact } from '@/components/Contact';
import { FloatingGetStarted } from '@/components/FloatingGetStarted';
import { CounsellingFlyers } from '@/components/CounsellingFlyers';
import { getSession } from '@/lib/session-cookie';
import { ROLE_HOME } from '@/lib/roles';

const TITLE = 'GlofiHub Counselling — Study in India & Abroad Counselling';
const DESCRIPTION =
  'Expert counselling for MBBS abroad, overseas education and admissions in India — with on-ground support, secure in-app chat and a student portal.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/counselling' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/counselling', type: 'website' },
};

// GlofiHub Counselling — everything student-facing (pathways, success stories, reviews, videos,
// achievements) plus the student / counsellor sign-in. Navbar and footer come from the site layout.
export default async function CounsellingPage() {
  const session = await getSession();
  const dashboardHref = session ? ROLE_HOME[session.role] : null;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CounsellingHero dashboardHref={dashboardHref} />
      <Services eyebrow="GlofiHub Counselling" />
      <Portfolio />
      <ParentReviews />
      <Videos />
      <Achievements />
      <PortalAccess dashboardHref={dashboardHref} />
      <Contact defaultRequirement="counselling" />
      <FloatingGetStarted />
      <CounsellingFlyers />
    </main>
  );
}
