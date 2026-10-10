import { BookOpen, Briefcase, Code2, Compass, GraduationCap, Globe, Handshake, type LucideIcon } from 'lucide-react';

/**
 * The GlofiHub ecosystem's verticals — single source of truth for the home-page
 * "Explore the GlofiHub Ecosystem" blocks, navbar menu, footer, contact form,
 * chatbot and the /{slug} landing pages. Copy follows the Ecosystem Blueprint.
 *
 * To add a vertical: add an entry here. 'live' blocks link to `href`;
 * 'soon' blocks link to a generated /{slug} "launching soon" page
 * (see app/[division]/page.tsx).
 */
export interface DivisionStat {
  value: string;
  label: string;
}

export interface Division {
  slug: string;
  /** Full brand name, e.g. "GlofiHub Education". */
  name: string;
  /** Short label for nav, chips, footer and selects, e.g. "Education". */
  short: string;
  tagline: string;
  description: string;
  /** Three short bullets for cards. */
  highlights: string[];
  /** Fuller category list from the blueprint (vertical pages / sections). */
  categories?: string[];
  /** Card call-to-action label, e.g. "Explore Education". */
  cta: string;
  /** Where the home-page block leads. */
  href: string;
  status: 'live' | 'soon';
  icon: LucideIcon;
  /** Tailwind classes for the icon tile / hover glow, and the spotlight colour. */
  iconBg: string;
  glow: string;
  spot: string;
  /** Optional: render as the large "featured" tile on the home-page ecosystem grid. */
  featured?: boolean;
  /** Optional: proof points shown on the featured tile (reuse existing site numbers only). */
  stats?: DivisionStat[];
}

export const DIVISIONS: Division[] = [
  {
    slug: 'education',
    name: 'GlofiHub Education',
    short: 'Education',
    tagline: 'Study in India & Abroad',
    description: 'Education pathways in India and abroad — MBBS, BDS, Engineering, Management & more.',
    highlights: ['Medical', 'Technology', 'Management & other programs'],
    categories: ['Medical', 'Technology', 'Management', 'Other Programs'],
    cta: 'Explore Education',
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
    short: 'Academy',
    tagline: 'Learn skills that move you forward',
    description: 'Online courses, live classes, workshops and certifications.',
    highlights: ['AI & technology', 'Languages', 'Creative & career skills'],
    categories: [
      'AI & ChatGPT',
      'Computer & IT',
      'Video Editing',
      'Graphic Design',
      'Digital Marketing',
      'Spoken English',
      'Russian',
      'German',
      'Business Skills',
      'Career Skills',
      'Medical / FMGE',
    ],
    cta: 'Explore Academy',
    href: '/academy',
    status: 'soon',
    icon: BookOpen,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-emerald-500/25',
    spot: 'rgba(16,185,129,0.18)',
  },
  {
    slug: 'jobs',
    name: 'GlofiHub Jobs & Careers',
    short: 'Jobs & Careers',
    tagline: 'Jobs, resume, interviews, career support',
    description: 'Jobs, career preparation, skill development and career guidance.',
    highlights: ['Jobs', 'Resume & interview preparation', 'Career guidance'],
    categories: ['Jobs', 'Career preparation', 'Skill development', 'Career guidance'],
    cta: 'Explore Careers',
    href: '/#careers',
    status: 'live',
    icon: Briefcase,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/25',
    spot: 'rgba(245,158,11,0.18)',
  },
  {
    slug: 'consulting',
    name: 'GlofiHub Consulting',
    short: 'Consulting',
    tagline: 'Education, career & business consulting',
    description: 'Education, career and business consulting — plus institutional consulting and partnership advisory.',
    highlights: ['Education & career consulting', 'Business consulting', 'Institutional consulting & partnership advisory'],
    categories: [
      'Education Consulting',
      'Career Consulting',
      'Business Consulting',
      'International Opportunities',
      'Institutional Consulting',
      'Partnership Advisory',
    ],
    cta: 'Explore Consulting',
    href: '/consulting',
    status: 'soon',
    icon: Compass,
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
    glow: 'group-hover:shadow-cyan-500/25',
    spot: 'rgba(6,182,212,0.18)',
  },
  {
    slug: 'technology',
    name: 'GlofiHub Technology',
    short: 'Technology',
    tagline: 'Build. Automate. Scale.',
    description: 'Web, apps, AI, CRM, automation and SaaS.',
    highlights: ['Web & app development', 'AI & automation', 'CRM, SaaS & digital growth'],
    categories: [
      'Web & App Development',
      'AI & Automation',
      'Business Systems',
      'Digital Growth',
      'SaaS & Product Development',
    ],
    cta: 'Explore Technology',
    href: '/services',
    status: 'live',
    icon: Code2,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    glow: 'group-hover:shadow-indigo-500/25',
    spot: 'rgba(99,102,241,0.18)',
  },
  {
    slug: 'global-opportunities',
    name: 'GlofiHub Global Opportunities',
    short: 'Global Opportunities',
    tagline: 'Study, work and grow internationally',
    description: 'International education, jobs, events and opportunities.',
    highlights: ['Study abroad & scholarships', 'International jobs & internships', 'Fellowships, programs & events'],
    categories: [
      'Study Abroad',
      'International Jobs',
      'Scholarships',
      'Fellowships & Programs',
      'Internships',
      'International Events',
    ],
    cta: 'Explore Opportunities',
    href: '/global-opportunities',
    status: 'soon',
    icon: Globe,
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    glow: 'group-hover:shadow-rose-500/25',
    spot: 'rgba(244,63,94,0.18)',
  },
  {
    slug: 'partners',
    name: 'GlofiHub Partner Network',
    short: 'Partner Network',
    tagline: 'Your network. Our platform. Shared growth.',
    description: 'Build with GlofiHub — for students, consultants, professionals and institutions.',
    highlights: ['Register & get trained', 'Refer or submit leads', 'Earn on eligible transactions'],
    categories: [
      'Students',
      'Professionals',
      'Consultants',
      'Educators',
      'Business Owners',
      'Community Leaders',
      'International Representatives',
    ],
    cta: 'Become a Partner',
    href: '/#partner-network',
    status: 'live',
    icon: Handshake,
    iconBg: 'bg-gradient-to-br from-fuchsia-500 to-purple-600',
    glow: 'group-hover:shadow-fuchsia-500/25',
    spot: 'rgba(217,70,239,0.18)',
  },
];
