import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Building2,
  CalendarClock,
  ClipboardList,
  Factory,
  FileCheck2,
  FileText,
  Handshake,
  Landmark,
  MessageSquareText,
  Package,
  PackageCheck,
  Rocket,
  Route,
  Store,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { SITE } from '@/lib/site';

/**
 * Content for the GlofiHub Import-Export website (home, services, enquiry).
 * The business is "launching soon": everything here is generic PLANNED scope. Do not add products,
 * prices, shipments, partner / port / country names, certifications, timelines or guarantees.
 */

export const TRADE_HOME = '/import-export';
export const TRADE_SERVICES_PAGE = '/import-export/services';
export const TRADE_ENQUIRY = '/import-export/enquiry';

export const TRADE_WHATSAPP_TEXT = 'Hi GlofiHub! I have an import-export enquiry.';

/** WhatsApp deep link to the GlofiHub number (digits only come from SITE.whatsapp). */
export function tradeWhatsAppHref(text: string = TRADE_WHATSAPP_TEXT): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Focus ring for links / buttons on a light or dark page background (same as components/site/kit.tsx). */
export const TRADE_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
/** Focus ring on the navy gradient surfaces. */
export const TRADE_FOCUS_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

/* ───────────────────────────── Services ───────────────────────────── */

export type TradeServiceId = 'import' | 'export' | 'documentation' | 'logistics';

export interface TradeService {
  /** Anchor id on /import-export/services (the home-page cards link to /import-export/services#<id>). */
  id: TradeServiceId;
  /** Must match an entry of `categories` for the import-export business in lib/divisions.ts. */
  label: string;
  /** [plain word(s), gradient word(s)] for the h2 on the services page. */
  heading: [string, string];
  icon: LucideIcon;
  /** Gradient stops for the icon tile / accent bar (used with bg-gradient-to-br / -r). */
  tile: string;
  /** Soft tint (background + text) for small check marks and icons. */
  soft: string;
  /** One line, used on the home-page cards. */
  summary: string;
  /** Short paragraph, used on the services page. */
  detail: string;
  /** Label of the call to action on the services page. */
  cta: string;
  /** Generic planned scope, 4-6 bullets. */
  points: string[];
}

export const TRADE_SERVICES: TradeService[] = [
  {
    id: 'import',
    label: 'Import',
    heading: ['Import', 'support'],
    icon: ArrowDownToLine,
    tile: 'from-orange-500 to-red-600',
    soft: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    summary: 'Sourcing and supplier connection support for goods you want to bring in.',
    detail:
      'For businesses that want to bring goods or materials in from international suppliers. GlofiHub Import-Export is being set up to help you define what you need, connect with suppliers and keep the paperwork and shipment steps organised.',
    cta: 'Enquire about import',
    points: [
      'Understanding your requirement: what you need, how much, and by when',
      'Support in connecting with international suppliers',
      'Documentation checklist support for your import',
      'Shipment coordination support',
      'Follow-up as your requirement progresses',
    ],
  },
  {
    id: 'export',
    label: 'Export',
    heading: ['Export', 'support'],
    icon: ArrowUpFromLine,
    tile: 'from-emerald-500 to-teal-600',
    soft: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    summary: 'Buyer connection and market support for goods you want to sell abroad.',
    detail:
      'For businesses that want to sell to buyers in international markets. GlofiHub Import-Export is being set up to help you describe your offer, connect with potential buyers and organise the documents and shipment steps.',
    cta: 'Enquire about export',
    points: [
      'Understanding your product and the market you want to reach',
      'Help preparing your product information for potential buyers',
      'Support in connecting with international buyers',
      'Documentation checklist support for your export',
      'Shipment coordination support',
      'Follow-up as your requirement progresses',
    ],
  },
  {
    id: 'documentation',
    label: 'Trade Documentation',
    heading: ['Trade', 'documentation'],
    icon: FileCheck2,
    tile: 'from-blue-500 to-indigo-600',
    soft: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    summary: 'Checklist and paperwork support for your import or export.',
    detail:
      'Trade usually comes with paperwork. We are planning to help you understand what may be needed, keep it organised and know what to check with the relevant authorities.',
    cta: 'Ask about documentation',
    points: [
      'A documentation checklist for your import or export',
      'Help keeping your paperwork organised and complete',
      'Guidance on the information you may need from suppliers or buyers',
      'Pointers to compliance steps worth checking with the relevant authorities',
      'Support in preparing shipment-related paperwork',
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics Support',
    heading: ['Logistics', 'support'],
    icon: Truck,
    tile: 'from-sky-500 to-cyan-600',
    soft: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    summary: 'Coordination support for moving your shipment from origin to destination.',
    detail:
      'Moving goods across borders involves several parties. We are planning to support coordination between you and transport or logistics providers.',
    cta: 'Ask about logistics',
    points: [
      'Support in understanding your shipping options',
      'Coordination between you and transport or logistics providers',
      'Shipment coordination support from dispatch to delivery',
      'Help keeping everyone informed as the shipment moves',
      'Follow-up after delivery',
    ],
  },
];

export function getTradeService(id: TradeServiceId): TradeService {
  const service = TRADE_SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown Import-Export service: ${id}`);
  return service;
}

/* ───────────────────────────── Process ───────────────────────────── */

export interface TradeStep {
  title: string;
  text: string;
  icon: LucideIcon;
}

/** The PLANNED process (shown as such on the home page). Generic wording, no promises. */
export const TRADE_STEPS: TradeStep[] = [
  {
    title: 'Share your requirement',
    text: 'Tell us what you want to import or export, roughly how much, and where it needs to go.',
    icon: ClipboardList,
  },
  {
    title: 'We understand your needs',
    text: 'We go through your details, ask follow-up questions and talk through what you want to achieve.',
    icon: MessageSquareText,
  },
  {
    title: 'Sourcing & market connection',
    text: 'Where it applies, we support connecting you with suitable suppliers or buyers.',
    icon: Handshake,
  },
  {
    title: 'Documentation & compliance support',
    text: 'We help you work through the paperwork and checks a trade typically involves.',
    icon: FileCheck2,
  },
  {
    title: 'Logistics coordination',
    text: 'We support coordination with transport and logistics providers for your shipment.',
    icon: Truck,
  },
  {
    title: 'Delivery & follow-up',
    text: 'We follow up as the shipment reaches its destination and help with any open questions afterwards.',
    icon: PackageCheck,
  },
];

/* ───────────────────────────── Audience ───────────────────────────── */

export const TRADE_AUDIENCE: { label: string; icon: LucideIcon }[] = [
  { label: 'Importers', icon: ArrowDownToLine },
  { label: 'Exporters', icon: ArrowUpFromLine },
  { label: 'Manufacturers', icon: Factory },
  { label: 'Traders', icon: Store },
  { label: 'Startups & small businesses', icon: Rocket },
  { label: 'Institutions', icon: Landmark },
];

/* ───────────────────────── Before you enquire ───────────────────────── */

export const TRADE_PREPARE: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: 'Product details',
    text: 'What the product is, plus any specifications or variants you need.',
    icon: Package,
  },
  {
    title: 'Quantity',
    text: 'An approximate volume or order size. An estimate is fine.',
    icon: Boxes,
  },
  {
    title: 'Origin and destination',
    text: 'Where the goods would come from and where they need to go.',
    icon: Route,
  },
  {
    title: 'Timeline',
    text: 'When you need things done, and how flexible that date is.',
    icon: CalendarClock,
  },
  {
    title: 'Your business details',
    text: 'Your company name and the best way to reach you.',
    icon: Building2,
  },
  {
    title: 'Anything you already have',
    text: 'Existing quotes, supplier or buyer details, or past trade experience.',
    icon: FileText,
  },
];
