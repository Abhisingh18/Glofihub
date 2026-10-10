import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: { default: 'GlofiHub Import-Export — Global Trade Support', template: '%s | GlofiHub Import-Export' },
  description: 'Connecting businesses with international markets through import and export services.',
};

// GlofiHub Import-Export is its own website inside the GlofiHub group: its own navbar + footer (components/site).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell slug="import-export">{children}</SiteShell>;
}
