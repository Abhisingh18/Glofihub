import { BriefcaseBusiness, Cpu, Plane, Stethoscope, type LucideIcon } from 'lucide-react';

/**
 * GlofiHub Education — the program catalogue behind /education and /education/programs.
 *
 * Built ONLY from the existing GlofiHub copy (components/Services.tsx):
 *   India  — MBBS / BDS, B.Tech / CSE / IT, MBA / PGDM, BBA / BCA / MCA
 *   Abroad — Global MBBS, International MD / MS, Aviation & Pilot Training, Global B.Tech Programs
 * grouped under the four existing categories (Medical, Technology, Management, Other Programs).
 *
 * Deliberately NO fees, eligibility, durations, rankings or university claims — those are explained
 * during counselling. Keep it that way unless the owner supplies verified content.
 * Plain data + class strings: safe to import from server components.
 */
export type EduPlace = 'india' | 'abroad';
export type EduGroupId = 'medical' | 'technology' | 'management' | 'other';

export const EDU_PLACE_LABEL: Record<EduPlace, string> = { india: 'India', abroad: 'Abroad' };

export interface EduProgram {
  /** Program name exactly as used in the existing GlofiHub copy. */
  name: string;
  group: EduGroupId;
  /** Where the program is offered — only what the existing copy says. */
  where: EduPlace[];
  /** One neutral sentence about what the program is. */
  blurb: string;
}

export interface EduGroup {
  id: EduGroupId;
  /** Short name, e.g. "Medical". */
  title: string;
  /** Heading on the programs page. */
  heading: string;
  /** One-line summary for the home-page pathway cards. */
  summary: string;
  /** Intro on the programs page. */
  intro: string;
  icon: LucideIcon;
  /** Full Tailwind class strings (dynamic fragments would not be picked up at build time). */
  tile: string;
  glow: string;
  programs: EduProgram[];
  /** Where at least one program of the group is offered. */
  where: EduPlace[];
}

/** In the order of the existing copy: the India list first, then the Abroad list. */
export const EDU_PROGRAMS: EduProgram[] = [
  { name: 'MBBS / BDS', group: 'medical', where: ['india'], blurb: 'Medical and dental degree programs in India.' },
  {
    name: 'B.Tech / CSE / IT',
    group: 'technology',
    where: ['india'],
    blurb: 'Engineering degree programs in India, including computer science and information technology.',
  },
  {
    name: 'MBA / PGDM',
    group: 'management',
    where: ['india'],
    blurb: 'Postgraduate management programs in India, with profile evaluation, college shortlisting and interview preparation.',
  },
  {
    name: 'BBA / BCA / MCA',
    group: 'management',
    where: ['india'],
    blurb: 'Business administration and computer-application programs in India.',
  },
  { name: 'Global MBBS', group: 'medical', where: ['abroad'], blurb: 'Medical degree programs at universities abroad.' },
  { name: 'International MD / MS', group: 'medical', where: ['abroad'], blurb: 'Postgraduate medical programs abroad.' },
  { name: 'Aviation & Pilot Training', group: 'other', where: ['abroad'], blurb: 'Aviation and pilot-training pathways abroad.' },
  { name: 'Global B.Tech Programs', group: 'technology', where: ['abroad'], blurb: 'Engineering degree programs at universities abroad.' },
];

const GROUPS: Omit<EduGroup, 'programs' | 'where'>[] = [
  {
    id: 'medical',
    title: 'Medical',
    heading: 'Medical programs',
    summary: 'Medical and dental degrees, plus postgraduate medical programs abroad.',
    intro: 'Medical and dental degrees in India, and medical degree and postgraduate programs abroad.',
    icon: Stethoscope,
    tile: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30',
    glow: 'bg-rose-500/20',
  },
  {
    id: 'technology',
    title: 'Technology',
    heading: 'Technology programs',
    summary: 'Engineering and computer-science degrees in India and abroad.',
    intro: 'Engineering and computer-science degrees, in India and at universities abroad.',
    icon: Cpu,
    tile: 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30',
    glow: 'bg-indigo-500/20',
  },
  {
    id: 'management',
    title: 'Management',
    heading: 'Management programs',
    summary: 'Business, management and computer-application programs in India.',
    intro: 'Business administration, management and computer-application programs in India.',
    icon: BriefcaseBusiness,
    tile: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30',
    glow: 'bg-amber-500/20',
  },
  {
    id: 'other',
    title: 'Other Programs',
    heading: 'Other programs',
    summary: 'Programs beyond the other three pathways, such as Aviation & Pilot Training.',
    intro: 'Programs beyond medical, technology and management, such as Aviation & Pilot Training.',
    icon: Plane,
    tile: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30',
    glow: 'bg-emerald-500/20',
  },
];

const PLACES: EduPlace[] = ['india', 'abroad'];

export const EDU_GROUPS: EduGroup[] = GROUPS.map((g) => {
  const programs = EDU_PROGRAMS.filter((p) => p.group === g.id);
  return { ...g, programs, where: PLACES.filter((w) => programs.some((p) => p.where.includes(w))) };
});

/** Flat lists in the order of the existing copy (used by the India / Abroad split on the home page). */
export const EDU_INDIA_PROGRAMS = EDU_PROGRAMS.filter((p) => p.where.includes('india'));
export const EDU_ABROAD_PROGRAMS = EDU_PROGRAMS.filter((p) => p.where.includes('abroad'));
