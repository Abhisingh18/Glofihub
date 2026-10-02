import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { AllServices } from '@/components/AllServices';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { FloatingContact } from '@/components/FloatingContact';
import { SITE } from '@/lib/site';

const TITLE = 'GlofiHub Digital — Web, App & AI Development, Marketing, Branding & PR';
const DESCRIPTION =
  'GlofiHub Digital brings website, app and AI development together with digital marketing, SEO, branding & PR and ready-made website packages — everything your brand needs to grow, under one roof.';

export const metadata: Metadata = {
  // `absolute` so the root "%s | GlofiHub" template doesn't repeat the brand name.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/services' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: 'GlofiHub Digital — Everything Your Brand Needs to Grow',
    description:
      'Web, app & AI development, digital marketing, SEO, branding & PR and website packages — under one roof.',
    url: '/services',
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `GlofiHub Digital — ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlofiHub Digital — Everything Your Brand Needs to Grow',
    description:
      'Web, app & AI development, digital marketing, SEO, branding & PR and website packages — under one roof.',
    images: [SITE.ogImage],
  },
};

export default function ServicesPage() {
  return (
    // overflow-x-clip (not -hidden): `hidden` would turn <main> into a scroll
    // container and break the sticky category quick-nav inside AllServices.
    <main className="min-h-screen bg-background text-foreground overflow-x-clip">
      <Navbar />
      <AllServices />
      <Footer />
      <Chatbot />
      <FloatingContact />
    </main>
  );
}
