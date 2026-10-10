'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Divisions } from '@/components/Divisions';
import { HowItWorks } from '@/components/HowItWorks';
import { Services } from '@/components/Services';
import { AcademySection } from '@/components/AcademySection';
import { CareersSection } from '@/components/CareersSection';
import { GlobalOpportunitiesSection } from '@/components/GlobalOpportunitiesSection';
import { ConsultingSection } from '@/components/ConsultingSection';
import { TechnologySection } from '@/components/TechnologySection';
import { PartnerNetworkSection } from '@/components/PartnerNetworkSection';
import { InstitutionPartnerships } from '@/components/InstitutionPartnerships';
import { WhyGlofiHub } from '@/components/WhyGlofiHub';
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

// Order follows the GlofiHub Ecosystem Blueprint (§3–§8, §11–§12):
// Hero → ecosystem → how it works → verticals → partners → why → trust → contact → footer.
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Divisions />
      <HowItWorks />
      <Services />
      <AcademySection />
      <CareersSection />
      <GlobalOpportunitiesSection />
      <ConsultingSection />
      <TechnologySection />
      <PartnerNetworkSection />
      <InstitutionPartnerships />
      <WhyGlofiHub />
      {/* Trust: success stories, parent reviews, videos, recognitions */}
      <Portfolio />
      <ParentReviews />
      <Videos />
      <Achievements />
      <Contact />
      <Footer />
      <Chatbot />
      <FloatingContact />
      <FloatingGetStarted />
      <CounsellingFlyers />
    </main>
  );
}
