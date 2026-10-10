import {
  Award,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Clapperboard,
  Cpu,
  Languages,
  Laptop,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Palette,
  PenTool,
  Presentation,
  Rocket,
  Stethoscope,
  TrendingUp,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';

/**
 * Shared content for the GlofiHub Academy website (home, courses, teach).
 *
 * The course categories come from the `academy` entry of lib/divisions.ts (single source of truth);
 * this file only adds how they are grouped, an icon and a neutral one-line description for each.
 * Pure data, no prices, schedules, instructor names or enrolment: the Academy is launching soon.
 */

export type AcademyGroupId = 'technology-ai' | 'creative-marketing' | 'languages' | 'career-medical';

export interface AcademyCategory {
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface AcademyGroup {
  /** Also the anchor on /academy/courses (#technology-ai, ...). */
  id: AcademyGroupId;
  title: string;
  blurb: string;
  icon: LucideIcon;
  /** Gradient for the icon tile and the card's top accent bar. */
  tile: string;
  /** Soft tint for the small per-category icon square. */
  chip: string;
  items: AcademyCategory[];
}

interface CategoryMeta {
  icon: LucideIcon;
  description: string;
}

const CATEGORY_META: Partial<Record<string, CategoryMeta>> = {
  'AI & ChatGPT': {
    icon: BrainCircuit,
    description: 'Understand modern AI tools and learn to use them for study, work and everyday tasks.',
  },
  'Computer & IT': {
    icon: Laptop,
    description: 'Build practical computer and IT skills for study, work and the digital workplace.',
  },
  'Video Editing': {
    icon: Clapperboard,
    description: 'Learn to cut, edit and polish video for social media, business or personal projects.',
  },
  'Graphic Design': {
    icon: PenTool,
    description: 'Learn the fundamentals of visual design and create graphics for brands and social media.',
  },
  'Digital Marketing': {
    icon: Megaphone,
    description: 'Understand how businesses reach and grow their audiences online.',
  },
  'Spoken English': {
    icon: MessageCircle,
    description: 'Build confidence in everyday and professional English conversation.',
  },
  Russian: {
    icon: Languages,
    description: 'Learn Russian for study, work, travel and everyday life.',
  },
  German: {
    icon: Languages,
    description: 'Learn German for study, work and opportunities in German-speaking countries.',
  },
  'Business Skills': {
    icon: TrendingUp,
    description: 'Build practical skills for the workplace and for running a business.',
  },
  'Career Skills': {
    icon: Rocket,
    description: 'Prepare for work with skills for resumes, interviews and professional growth.',
  },
  'Medical / FMGE': {
    icon: Stethoscope,
    description: 'Learning for medical students and graduates, including preparation for the FMGE.',
  },
};

type GroupDef = Omit<AcademyGroup, 'items'> & { items: string[] };

// Four themed groups covering the 11 academy categories of lib/divisions.ts.
const GROUP_DEFS: GroupDef[] = [
  {
    id: 'technology-ai',
    title: 'Technology & AI',
    blurb: 'Future-ready digital skills',
    icon: Cpu,
    tile: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    items: ['AI & ChatGPT', 'Computer & IT'],
  },
  {
    id: 'creative-marketing',
    title: 'Creative & Marketing',
    blurb: 'Create, design and promote',
    icon: Palette,
    tile: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
    chip: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300',
    items: ['Video Editing', 'Graphic Design', 'Digital Marketing'],
  },
  {
    id: 'languages',
    title: 'Languages',
    blurb: 'Communicate with confidence',
    icon: Languages,
    tile: 'bg-gradient-to-br from-emerald-500 to-green-600',
    chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    items: ['Spoken English', 'Russian', 'German'],
  },
  {
    id: 'career-medical',
    title: 'Career & Medical',
    blurb: 'Prepare for the next step',
    icon: Briefcase,
    tile: 'bg-gradient-to-br from-amber-500 to-orange-600',
    chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    items: ['Business Skills', 'Career Skills', 'Medical / FMGE'],
  },
];

const ACADEMY = DIVISIONS.find((d) => d.slug === 'academy');
const AVAILABLE = ACADEMY?.categories ?? GROUP_DEFS.flatMap((g) => g.items);
const MAPPED = new Set(GROUP_DEFS.flatMap((g) => g.items));
// A category added to lib/divisions.ts but not mapped above lands in the last group instead of vanishing.
const UNMAPPED = AVAILABLE.filter((c) => !MAPPED.has(c));

function toCategory(name: string): AcademyCategory {
  const meta = CATEGORY_META[name];
  return {
    name,
    icon: meta?.icon ?? BookOpen,
    description: meta?.description ?? 'Course details will be shared as this area launches.',
  };
}

export const ACADEMY_GROUPS: AcademyGroup[] = GROUP_DEFS.map(({ items, ...group }, i) => ({
  ...group,
  items: [
    ...items.filter((c) => AVAILABLE.includes(c)),
    ...(i === GROUP_DEFS.length - 1 ? UNMAPPED : []),
  ].map(toCategory),
})).filter((g) => g.items.length > 0);

/** Flat list of every category name, in display order (used for the course-category select). */
export const ACADEMY_CATEGORY_NAMES: string[] = ACADEMY_GROUPS.flatMap((g) => g.items.map((c) => c.name));

export interface AcademyFormat {
  title: string;
  text: string;
  icon: LucideIcon;
  /** Gradient for the icon tile and the card's top accent bar. */
  tile: string;
}

export const ACADEMY_FORMATS: AcademyFormat[] = [
  {
    title: 'Online courses',
    text: 'Structured learning you can follow online, from wherever you are.',
    icon: MonitorPlay,
    tile: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    title: 'Live classes',
    text: 'Interactive sessions where you can ask questions and learn directly from an instructor.',
    icon: Video,
    tile: 'bg-gradient-to-br from-sky-500 to-blue-600',
  },
  {
    title: 'Workshops',
    text: 'Focused, hands-on sessions built around one practical skill.',
    icon: Presentation,
    tile: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  {
    title: 'Certifications',
    text: 'Programs designed to end with a certificate that shows what you have learned.',
    icon: Award,
    tile: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
];

/** Options of the "preferred mode" select on the courses enquiry form. */
export const ACADEMY_MODES: string[] = ['Online', 'Live classes', 'Workshop', 'No preference'];
