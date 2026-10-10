import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { CounsellingHero } from '@/components/counselling/CounsellingHero';
import { PortalAccess } from '@/components/counselling/PortalAccess';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { ParentReviews } from '@/components/ParentReviews';
import { Videos } from '@/components/Videos';
import { Achievements } from '@/components/Achievements';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';
import { FloatingGetStarted } from '@/components/FloatingGetStarted';
import { CounsellingFlyers } from '@/components/CounsellingFlyers';

const TITLE = 'GlofiHub Education — Study in India & Abroad Counselling';
const DESCRIPTION =
  'Expert counselling for MBBS abroad, overseas education and admissions in India — with on-ground support, secure in-app chat and a student portal.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/counselling' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/counselling', type: 'website' },
};

// The counselling business: everything student-facing (pathways, success stories, reviews, videos,
// achievements) plus the student / counsellor / admin portal entry points.
export default function CounsellingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <CounsellingHero />
      <Services />
      <Portfolio />
      <ParentReviews />
      <Videos />
      <Achievements />
      <PortalAccess />
      <Contact />
      <Footer />
      <Chatbot />
      <FloatingContact />
      <FloatingGetStarted />
      <CounsellingFlyers />
    </main>
  );
}
