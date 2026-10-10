import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { About, JoinGlofiHub } from '@/components/About';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';
import { SITE } from '@/lib/site';

const TITLE = 'About GlofiHub — Founder, Leadership & Team';
const DESCRIPTION =
  'GlofiHub is an ecosystem connecting education, academy, jobs & careers, consulting, technology, global opportunities and a partner network. Meet the founder, leadership and team across India, Russia and Central Asia.';

export const metadata: Metadata = {
  // `absolute` so the root "%s | GlofiHub" template doesn't repeat the brand name.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: '/about',
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.ogImage],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      {/* Spacer so the first section clears the fixed navbar */}
      <div className="h-20 md:h-24" />
      <About />
      <Team />
      <JoinGlofiHub />
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
