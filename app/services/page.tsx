import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { AllServices } from '@/components/AllServices';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';

export const metadata: Metadata = {
  title: 'Our Services — Digital Marketing, Branding, Web & SEO',
  description:
    'Explore all GlofiHub services — digital marketing, SEO, social media, branding & PR, website packages and more. Everything your brand needs to grow, under one roof.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Our Services — GlofiHub',
    description:
      'Digital marketing, SEO, branding & PR, website packages and more — under one roof.',
    url: '/services',
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <AllServices />
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
