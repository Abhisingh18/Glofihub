import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: { default: 'GlofiHub Education — Study in India & Abroad', template: '%s | GlofiHub Education' },
  description: 'Education pathways in India and abroad — MBBS, BDS, Engineering, Management and more — from GlofiHub Education.',
};

// GlofiHub Education is its own website inside the GlofiHub group: its own navbar + footer (components/site).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell slug="education">{children}</SiteShell>;
}
