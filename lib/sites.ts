/**
 * Configuration of the five GlofiHub business websites. Each one lives under its own path
 * (/counselling, /education, /academy, /import-export, /technology) and has its own navbar,
 * footer and pages — see components/site/*. Pure data: safe to import from client components.
 *
 * Link convention: a link with an `id` points at a section of that site's HOME page and is
 * highlighted by scroll-spy; the first link is "Home" and its id is `${slug}-home` (the hero's id).
 */
export type SiteSlug = 'counselling' | 'education' | 'academy' | 'import-export' | 'technology';

export interface SiteLink {
  label: string;
  href: string;
  /** Section id on the site's home page (scroll-spy). */
  id?: string;
}

export interface SiteConfig {
  slug: SiteSlug;
  /** Home path of the site, e.g. '/counselling'. */
  home: string;
  /** Small label under "GlofiHub" in the navbar, e.g. "Counselling". */
  subtitle: string;
  links: SiteLink[];
  /** Show Login / Logout (+ Get Started) in the navbar. Only the counselling site has accounts. */
  auth: boolean;
  /** Primary navbar button when `auth` is false. */
  cta: { label: string; href: string } | null;
  /** One-sentence footer blurb. */
  blurb: string;
  /** Optional extra footer column. */
  footerExtra?: { title: string; links: SiteLink[] };
}

export const SITES: Record<SiteSlug, SiteConfig> = {
  counselling: {
    slug: 'counselling',
    home: '/counselling',
    subtitle: 'Counselling',
    auth: true,
    cta: null,
    links: [
      { label: 'Home', href: '/counselling', id: 'counselling-home' },
      { label: 'Pathways', href: '/counselling#services', id: 'services' },
      { label: 'Success Stories', href: '/counselling#portfolio', id: 'portfolio' },
      { label: 'Reviews', href: '/counselling#reviews', id: 'reviews' },
      { label: 'Videos', href: '/counselling#videos', id: 'videos' },
      { label: 'Awards', href: '/counselling#achievements', id: 'achievements' },
      { label: 'Contact', href: '/counselling#contact', id: 'contact' },
    ],
    blurb: 'Counselling for study in India and abroad, with a student portal, secure in-app chat and on-ground support.',
    footerExtra: {
      title: 'Account',
      links: [
        { label: 'Student Login', href: '/login' },
        { label: 'Student Sign Up', href: '/register' },
        { label: 'Staff Login', href: '/login' },
      ],
    },
  },
  education: {
    slug: 'education',
    home: '/education',
    subtitle: 'Education',
    auth: false,
    cta: { label: 'Talk to a Counsellor', href: '/counselling' },
    links: [
      { label: 'Home', href: '/education', id: 'education-home' },
      { label: 'Study in India', href: '/education/study-in-india' },
      { label: 'Study Abroad', href: '/education/study-abroad' },
      { label: 'Programs', href: '/education/programs' },
      { label: 'Contact', href: '/education#contact', id: 'contact' },
    ],
    blurb: 'Education pathways in India and abroad — MBBS, BDS, Engineering, Management and more.',
  },
  academy: {
    slug: 'academy',
    home: '/academy',
    subtitle: 'Academy',
    auth: false,
    cta: { label: 'Get notified', href: '/academy#contact' },
    links: [
      { label: 'Home', href: '/academy', id: 'academy-home' },
      { label: 'Courses', href: '/academy/courses' },
      { label: 'Teach with us', href: '/academy/teach' },
      { label: 'Contact', href: '/academy#contact', id: 'contact' },
    ],
    blurb: 'Online courses, live classes, workshops and certifications — skills that move you forward.',
  },
  'import-export': {
    slug: 'import-export',
    home: '/import-export',
    subtitle: 'Import-Export',
    auth: false,
    cta: { label: 'Trade Enquiry', href: '/import-export/enquiry' },
    links: [
      { label: 'Home', href: '/import-export', id: 'import-export-home' },
      { label: 'Services', href: '/import-export/services' },
      { label: 'How it works', href: '/import-export#process', id: 'process' },
      { label: 'Enquiry', href: '/import-export/enquiry' },
    ],
    blurb: 'Connecting businesses with international markets through import and export services.',
  },
  technology: {
    slug: 'technology',
    home: '/technology',
    subtitle: 'Technology',
    auth: false,
    cta: { label: 'Talk to our tech team', href: '/technology#contact' },
    links: [
      { label: 'Home', href: '/technology', id: 'technology-home' },
      { label: 'Services', href: '/technology/services' },
      { label: 'Contact', href: '/technology#contact', id: 'contact' },
    ],
    blurb: 'Web, apps, AI, CRM, automation and SaaS — build, automate and scale.',
  },
};

export const SITE_SLUGS = Object.keys(SITES) as SiteSlug[];
