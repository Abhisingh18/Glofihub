import { BookOpen, Code2, GraduationCap, Ship, type LucideIcon } from 'lucide-react';

/**
 * The GlofiHub group's businesses — single source of truth for the home-page
 * "Our Businesses" blocks and the /{slug} landing pages.
 *
 * To add a business: add an entry here. 'live' blocks link to `href`;
 * 'soon' blocks link to a generated /{slug} "launching soon" page
 * (see app/[division]/page.tsx).
 */
export interface DivisionStat {
  value: string;
  label: string;
}

export interface Division {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** Where the home-page block leads. */
  href: string;
  status: 'live' | 'soon';
  icon: LucideIcon;
  /** Tailwind classes for the icon tile / hover glow, and the spotlight colour. */
  iconBg: string;
  glow: string;
  spot: string;
  /** Optional: render as the large "featured" tile on the home-page Businesses grid. */
  featured?: boolean;
  /** Optional: proof points shown on the featured tile (reuse existing site numbers only). */
  stats?: DivisionStat[];
}

export const DIVISIONS: Division[] = [
  {
    slug: 'education',
    name: 'GlofiHub Education',
    tagline: 'Study abroad & MBBS counselling',
    description:
      'Expert counselling for MBBS abroad, overseas education and admissions in India — with on-ground support from application to arrival.',
    highlights: ['MBBS in Russia & Central Asia', 'Admissions in India', 'Visa & documentation support'],
    href: '/#service-education',
    status: 'live',
    icon: GraduationCap,
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    glow: 'group-hover:shadow-blue-500/25',
    spot: 'rgba(59,130,246,0.18)',
    featured: true,
    stats: [
      { value: '1000+', label: 'Students Guided' },
      { value: '10+', label: 'Countries Reached' },
      { value: '95%', label: 'Visa Success Rate' },
    ],
  },
  {
    slug: 'academy',
    name: 'GlofiHub Academy',
    tagline: 'Skills & career-ready training',
    description:
      'Industry-designed courses that build in-demand skills, taught by working professionals and backed by recognised certification.',
    highlights: ['Technical & professional skills', 'Project-based learning', 'Industry-recognised certificates'],
    href: '/academy',
    status: 'soon',
    icon: BookOpen,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-emerald-500/25',
    spot: 'rgba(16,185,129,0.18)',
  },
  {
    slug: 'export-import',
    name: 'GlofiHub Export–Import',
    tagline: 'Global trade support',
    description: 'Connecting businesses with international markets through export and import services.',
    highlights: ['Export', 'Import', 'Trade documentation & logistics'],
    href: '/export-import',
    status: 'soon',
    icon: Ship,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/25',
    spot: 'rgba(245,158,11,0.18)',
  },
  {
    slug: 'digital',
    name: 'GlofiHub Digital',
    tagline: 'Web, apps, AI & marketing',
    description:
      'Websites, apps and AI agents plus digital marketing, branding and PR — everything a business needs to grow online.',
    highlights: ['Web, app & AI development', 'SEO & digital marketing', 'Branding & PR'],
    href: '/services',
    status: 'live',
    icon: Code2,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    glow: 'group-hover:shadow-indigo-500/25',
    spot: 'rgba(99,102,241,0.18)',
  },
];
