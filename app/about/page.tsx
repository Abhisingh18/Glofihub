import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'About Us — GlofiHub | Founder & Team',
  description: 'Meet the founder and the executive team behind GlofiHub — mentors and on-ground experts across India, Russia, and Central Asia.',
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
    </main>
  );
}
