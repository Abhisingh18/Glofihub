import type { Metadata } from 'next';
import { AllServices } from '@/components/AllServices';
import { SITE } from '@/lib/site';

const TITLE = 'GlofiHub Technology — Web, Apps, AI, CRM & Automation';
const DESCRIPTION =
  'GlofiHub Technology: web and app development, AI and automation, CRM and business systems, digital growth, and SaaS and product development — Build. Automate. Scale.';

export const metadata: Metadata = {
  // `absolute` so the site layout's "%s | GlofiHub Technology" template doesn't repeat the brand name.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/technology/services' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: 'GlofiHub Technology — Build. Automate. Scale.',
    description:
      'Web and app development, AI and automation, CRM and business systems, digital growth and SaaS.',
    url: '/technology/services',
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `GlofiHub Technology — ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlofiHub Technology — Build. Automate. Scale.',
    description:
      'Web and app development, AI and automation, CRM and business systems, digital growth and SaaS.',
    images: [SITE.ogImage],
  },
};

// The full service catalogue of the GlofiHub Technology website. Navbar, footer, chat and contact
// buttons come from the site layout (app/technology/layout.tsx -> SiteShell).
export default function TechnologyServicesPage() {
  return (
    // overflow-x-clip (not -hidden): `hidden` would turn <main> into a scroll
    // container and break the sticky category quick-nav inside AllServices.
    <main className="min-h-screen bg-background text-foreground overflow-x-clip">
      <AllServices />
    </main>
  );
}
