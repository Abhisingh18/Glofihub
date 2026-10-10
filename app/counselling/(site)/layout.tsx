import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: { default: 'GlofiHub Counselling — Study in India & Abroad Counselling', template: '%s | GlofiHub Counselling' },
  description:
    'Expert counselling for MBBS abroad, overseas education and admissions in India — with a student portal, secure in-app chat and on-ground support.',
};

// GlofiHub Counselling is its own website inside the group (with Login / Logout in its navbar).
// The admin portal (/counselling/admin) sits OUTSIDE this route group, so it does not get this shell.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell slug="counselling">{children}</SiteShell>;
}
