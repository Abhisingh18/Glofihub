import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';

export const metadata: Metadata = {
  title: 'About Us — Founder & Team',
  description:
    'Meet the founder and the executive team behind GlofiHub — mentors and on-ground experts guiding students across India, Russia, and Central Asia.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About GlofiHub — Founder & Team',
    description:
      'Meet the founder and the team guiding students across India, Russia, and Central Asia.',
    url: '/about',
    type: 'profile',
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
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
