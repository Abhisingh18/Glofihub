import { Crown, Globe, MapPin, type LucideIcon } from 'lucide-react';

/**
 * Core-team data for /about — names, roles and descriptions are the owner's
 * existing copy (verbatim). Shared by the Leadership section, Global Presence
 * and the Team section so the people are defined in exactly one place.
 *
 * Departments from the blueprint that have NO members yet (Education Team,
 * Academy & Faculty, Careers, Technology, Partnerships) are intentionally not
 * listed — add a department object below once the owner supplies real people.
 */
export interface TeamPhoto {
  src: string;
  /** Intrinsic pixel size of `src` (prevents layout shift). */
  width: number;
  height: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification?: string;
  description: string;
  /** Portrait (WebP). Omitted for the founder, who uses the initials avatar tile. */
  photo?: TeamPhoto;
  /** Initials for the avatar tile (members without a photo). */
  initials?: string;
  founder?: boolean;
}

export interface TeamDepartment {
  id: string;
  name: string;
  icon: LucideIcon;
  members: TeamMember[];
}

const ujjawal: TeamMember = {
  id: 'ujjawal-kumar',
  name: 'Ujjawal Kumar',
  role: 'Founder & Strategic Head',
  qualification: 'Pursuing MBBS Abroad',
  // Taken verbatim from the Founder's Message.
  description: 'GlofiHub was created with a vision to connect education, skills, and real-world opportunities.',
  initials: 'UK',
  founder: true,
};

const abhishek: TeamMember = {
  id: 'abhishek-kumar',
  name: 'Abhishek Kumar',
  role: 'Co-Founder',
  description:
    'Co-architect of our integrated global career pathways, driving international university alliances, student success programs, and platform strategy.',
  photo: { src: '/team/abhishek_co_founder.webp', width: 800, height: 1067 },
};

const vishnu: TeamMember = {
  id: 'vishnu-d-rajput',
  name: 'Dr. Vishnu D. Rajput',
  role: 'Chief International Research Advisor',
  qualification: 'Principal Scientist & Head',
  description:
    'International Laboratory on Nanobiotechnology & Rhizosphere Bioengineering. Southern Federal University, Rostov-on-Don, Russia.',
  photo: { src: '/team/dr_vishnu_d_rajput.webp', width: 800, height: 797 },
};

const avnish: TeamMember = {
  id: 'avnish-kumar-yadav',
  name: 'Avnish Kumar Yadav',
  role: 'Business Expansion Head',
  description:
    'Leading strategic growth, institutional partnerships, and market expansion across India — building strong collaborations and seamless opportunities for students through innovation, networking, and impactful outreach.',
  photo: { src: '/team/avnish_kr_yadav_bussiness_expanssion_head.webp', width: 800, height: 800 },
};

const nitish: TeamMember = {
  id: 'nitish-kumar',
  name: 'Nitish Kumar',
  role: 'Patna Operations Head',
  description:
    'Manages regional student guidance, parent counseling, and pre-departure document verification processes at our Patna hub.',
  photo: { src: '/team/nitish_kumar_Patna_operation_head.webp', width: 800, height: 1000 },
};

const muqallid: TeamMember = {
  id: 'muqallid-irfan',
  name: 'Dr. Muqallid Irfan',
  role: 'Russian Operations Head',
  qualification: 'MBBS, MD',
  description:
    'Oversees our direct university relations and student on-ground welfare services across key Russian state & medical universities.',
  photo: { src: '/team/dr_muqallid_irfan_mbbs_md_russian_operations_head.webp', width: 800, height: 1067 },
};

const sudheer: TeamMember = {
  id: 'sudheer-kumar-saxena',
  name: 'Sudheer Kumar Saxena',
  role: 'Uzbekistan Operations Head',
  description:
    'Directs on-ground coordination, student accommodation, and university compliance protocols for our Central Asian pathways.',
  photo: { src: '/team/sudheer_kr_sexena_Uzbekistan_operations_head.webp', width: 800, height: 1067 },
};

/** Lookup for components that reference a person (e.g. "Led by …"). */
export const MEMBERS = { ujjawal, abhishek, vishnu, avnish, nitish, muqallid, sudheer } as const;

export const TEAM_DEPARTMENTS: TeamDepartment[] = [
  { id: 'leadership', name: 'Leadership', icon: Crown, members: [ujjawal, abhishek, vishnu] },
  { id: 'india-operations', name: 'India Operations', icon: MapPin, members: [avnish, nitish] },
  { id: 'russia-central-asia-operations', name: 'Russia & Central Asia Operations', icon: Globe, members: [muqallid, sudheer] },
];
