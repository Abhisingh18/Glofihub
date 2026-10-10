import {
  Bot, BrainCircuit, Boxes, Cloud, Code2, Database, Globe, Layers, LayoutDashboard, Megaphone,
  MessageCircle, MessageSquareText, Monitor, Package, Plug, Rocket, Search, Share2, ShoppingCart,
  Smartphone, Sparkles, Users, Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * The five GlofiHub Technology categories (Ecosystem Blueprint §4) — shared by the parent site's
 * <TechnologySection /> and the Technology website's home page (<TechCategories />).
 * Plain data (no 'use client'): safe to import from server and client components alike.
 */
export interface TechItem {
  name: string;
  detail: string;
  icon: LucideIcon;
}

export interface TechCategory {
  /** Anchor id — identical to the category's section id on /technology/services. */
  id: string;
  title: string;
  /** Compact label for chips and quick links. */
  short: string;
  tagline: string;
  icon: LucideIcon;
  /** Gradient for the category icon tile. */
  tile: string;
  items: TechItem[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'web-app-development',
    title: 'Web & App Development',
    short: 'Web & Apps',
    tagline: 'Websites, apps and online stores — built end to end for your business.',
    icon: Code2,
    tile: 'from-cyan-500 to-blue-600',
    items: [
      { name: 'Websites', detail: 'Fast, responsive, SEO-ready websites tailored to your brand.', icon: Globe },
      { name: 'Web Apps', detail: 'Scalable web apps and dashboards with secure logins.', icon: Monitor },
      { name: 'Android / iOS', detail: 'Mobile apps with a smooth, native-like experience.', icon: Smartphone },
      { name: 'E-commerce', detail: 'Feature-rich online stores with payments and inventory.', icon: ShoppingCart },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    short: 'AI & Automation',
    tagline: 'Smart assistants and automation that take repetitive work off your plate.',
    icon: BrainCircuit,
    tile: 'from-violet-500 to-fuchsia-600',
    items: [
      { name: 'AI Assistants', detail: 'Assistants that help your customers and your team get answers fast.', icon: Sparkles },
      { name: 'AI Agents', detail: 'Agents that take on routine tasks and work around the clock.', icon: Bot },
      { name: 'Automation', detail: 'Automate workflows, replies and data with AI.', icon: Workflow },
      { name: 'Chatbots', detail: 'Chatbots that talk to customers and capture enquiries 24/7.', icon: MessageSquareText },
    ],
  },
  {
    id: 'business-systems',
    title: 'Business Systems',
    short: 'CRM & Systems',
    tagline: 'Systems that keep leads, people and operations organised in one place.',
    icon: Database,
    tile: 'from-emerald-500 to-green-600',
    items: [
      { name: 'CRM', detail: 'Track leads, customers and follow-ups from first contact to close.', icon: Users },
      { name: 'ERP', detail: 'Manage staff, stock and day-to-day operations in one system.', icon: Layers },
      { name: 'Dashboards', detail: 'Clear, live views of the numbers that matter to you.', icon: LayoutDashboard },
      { name: 'Custom Software', detail: 'Bespoke software built around your exact requirements.', icon: Code2 },
    ],
  },
  {
    id: 'digital-growth',
    title: 'Digital Growth',
    short: 'Digital Growth',
    tagline: 'Data-driven campaigns that grow your reach, traffic and sales online.',
    icon: Megaphone,
    tile: 'from-amber-500 to-orange-600',
    items: [
      { name: 'SEO', detail: 'Rank higher on Google with on-page, technical and off-page SEO.', icon: Search },
      { name: 'Social Media', detail: 'Engaging content and campaigns across Instagram, Facebook and more.', icon: Share2 },
      { name: 'Digital Marketing', detail: 'Campaigns, ads and content managed end to end.', icon: Megaphone },
      { name: 'WhatsApp Automation', detail: 'Reach customers directly with broadcasts and automation.', icon: MessageCircle },
    ],
  },
  {
    // Same id as the SaaS category on /technology/services (components/AllServices.tsx), so
    // "See all services" deep-links land on the right section.
    id: 'saas-product',
    title: 'SaaS & Product Development',
    short: 'SaaS & Product',
    tagline: 'Take a product from idea to production — with the APIs and cloud to run it.',
    icon: Rocket,
    tile: 'from-primary to-blue-600',
    items: [
      { name: 'SaaS', detail: 'Launch your subscription software from idea to production.', icon: Boxes },
      { name: 'APIs', detail: 'Connect your tools with secure, reliable APIs.', icon: Plug },
      { name: 'Cloud', detail: 'Hosting, DevOps and reliable deployment.', icon: Cloud },
      { name: 'Product Development', detail: 'Shape, build and ship a product around your idea.', icon: Package },
    ],
  },
];
