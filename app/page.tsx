'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { Videos } from '@/components/Videos';
import { Achievements } from '@/components/Achievements';
import { ParentReviews } from '@/components/ParentReviews';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <ParentReviews />
      <Videos />
      <Achievements />
      <Contact />
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
