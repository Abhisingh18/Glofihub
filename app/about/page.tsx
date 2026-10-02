import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';
import { SITE } from '@/lib/site';

const TITLE = 'About GlofiHub — Founder & Team';
const DESCRIPTION =
  'Meet the founder and team behind the GlofiHub group — GlofiHub Education and GlofiHub Digital, with Academy and Export–Import launching soon. Mentors and on-ground experts guiding students across India, Russia and Central Asia.';

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
      {/* The About / Team sections only use h2s; this page needs its own h1. */}
      <h1 className="sr-only">{TITLE}</h1>
      <About />
      <Team />
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
