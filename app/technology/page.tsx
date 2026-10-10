import type { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import { Contact } from '@/components/Contact';
import { Accent, CtaBand, SiteHero } from '@/components/site/kit';
import { TechCategories } from '@/components/technology/TechCategories';
import { TechEcosystem } from '@/components/technology/TechEcosystem';
import { TechHeroChips } from '@/components/technology/TechHeroChips';
import { TechProcess } from '@/components/technology/TechProcess';
import { SITE } from '@/lib/site';

const TITLE = 'GlofiHub Technology — Build. Automate. Scale.';
const DESCRIPTION =
  'GlofiHub Technology: websites and mobile apps, AI assistants and automation, CRM and business systems, digital growth, and SaaS and product development.';
const SOCIAL_DESCRIPTION = 'Web, apps, AI, CRM, automation and SaaS from GlofiHub Technology.';

export const metadata: Metadata = {
  // `absolute` so the site layout's "%s | GlofiHub Technology" template doesn't repeat the brand name.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/technology' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    url: '/technology',
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
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [SITE.ogImage],
  },
};

// Home of the GlofiHub Technology website. Navbar, footer, chat and contact buttons come from the
// site layout (app/technology/layout.tsx -> SiteShell). No login anywhere on this site.
export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-clip">
      <SiteHero
        id="technology-home"
        icon={Code2}
        eyebrow="GlofiHub Technology"
        title={
          <>
            Build. Automate. <Accent>Scale.</Accent>
          </>
        }
        lead="Web, apps, AI, CRM, automation and SaaS."
        ctas={[
          { label: 'Explore services', href: '/technology/services' },
          { label: 'Talk to our tech team', href: '#contact', variant: 'outline' },
        ]}
      >
        <TechHeroChips />
      </SiteHero>

      <TechCategories />
      <TechProcess />
      <TechEcosystem />

      <CtaBand
        title="Have something to build, automate or launch?"
        text="Tell us what you have in mind and our tech team will help you find the right place to start."
        ctas={[
          { label: 'Talk to our tech team', href: '#contact' },
          { label: 'Browse all services', href: '/technology/services', variant: 'outline' },
        ]}
      />

      {/* Contact owns id="contact"; the wrapper only gives the #contact jump some room under the fixed two-row header. */}
      <div className="[&_#contact]:scroll-mt-20">
        <Contact defaultRequirement="technology" />
      </div>
    </main>
  );
}
