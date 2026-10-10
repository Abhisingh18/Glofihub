import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: { default: 'GlofiHub Academy — Learn Skills That Move You Forward', template: '%s | GlofiHub Academy' },
  description: 'Online courses, live classes, workshops and certifications from GlofiHub Academy.',
};

// GlofiHub Academy is its own website inside the GlofiHub group: its own navbar + footer (components/site).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell slug="academy">{children}</SiteShell>;
}
