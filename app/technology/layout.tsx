import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: { default: 'GlofiHub Technology — Build. Automate. Scale.', template: '%s | GlofiHub Technology' },
  description: 'Web, apps, AI, CRM, automation and SaaS from GlofiHub Technology.',
};

// GlofiHub Technology is its own website inside the GlofiHub group: its own navbar + footer (components/site).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell slug="technology">{children}</SiteShell>;
}
