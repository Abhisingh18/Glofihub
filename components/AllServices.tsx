'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Megaphone, Sparkles, Package, FolderKanban, ArrowRight, Phone, Code2, MessageCircle,
  Globe, Monitor, Smartphone, Bot, Workflow, Rocket, ShoppingCart, Database, PenTool,
  Plug, Cloud, LayoutTemplate, Search, MapPin, Share2, MonitorPlay, TrendingUp, Mail,
  MessageSquare, Mic, FileText, Landmark, Building2, ShieldCheck, Newspaper, Send, Gem,
  BadgeCheck, Clapperboard, Video, Tv, Users, Star, Palette, Store, Film,
  type LucideIcon,
} from 'lucide-react';
import { SITE } from '@/lib/site';

interface ServiceItem {
  name: string;
  detail: string;
}
interface ServiceCategory {
  /** Anchor id for the sticky quick-nav. */
  id: string;
  icon: LucideIcon;
  title: string;
  intro: string;
  items: ServiceItem[];
  /** Portfolio-style category (not counted as "services", different enquiry wording). */
  showcase?: boolean;
}

const WHATSAPP_TEXT = 'Hi GlofiHub 👋, I want to know more about your services.';
const waLink = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
const enquiryText = (cat: ServiceCategory) =>
  cat.showcase
    ? 'Hi GlofiHub 👋, I would like to see samples of your work.'
    : `Hi GlofiHub 👋, I would like to know more about your ${cat.title} services.`;

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-app-ai',
    icon: Code2,
    title: 'Web, App & AI Development',
    intro: 'Custom websites, apps and AI agents — built end to end for your business.',
    items: [
      { name: 'Website Development', detail: 'Fast, responsive, SEO-ready websites tailored to your brand.' },
      { name: 'Web Application Development', detail: 'Scalable web apps & dashboards with secure logins.' },
      { name: 'Mobile App Development', detail: 'Android & iOS apps with a smooth, native-like experience.' },
      { name: 'AI Agents & Chatbots', detail: 'Smart assistants that talk to customers & automate tasks 24/7.' },
      { name: 'AI Automation', detail: 'Automate workflows, replies and data with AI.' },
      { name: 'SaaS Product Development', detail: 'Launch your subscription software from idea to production.' },
      { name: 'E-commerce Platforms', detail: 'Feature-rich online stores with payments & inventory.' },
      { name: 'CRM & ERP Systems', detail: 'Custom systems to manage leads, staff & operations.' },
      { name: 'Custom Software', detail: 'Bespoke software built around your exact requirements.' },
      { name: 'UI/UX Design', detail: 'Clean, modern interfaces that users love.' },
      { name: 'API Development & Integration', detail: 'Connect your tools with secure, reliable APIs.' },
      { name: 'Cloud & Deployment', detail: 'Hosting, DevOps and reliable deployment.' },
    ],
  },
  {
    id: 'digital-marketing',
    icon: Megaphone,
    title: 'Digital Marketing',
    intro: 'Data-driven campaigns that grow your reach, traffic and sales online.',
    items: [
      { name: 'Business Website with SEO', detail: 'A conversion-focused website built with SEO from day one.' },
      { name: 'SEO Services', detail: 'Rank higher on Google with on-page, technical & off-page SEO.' },
      { name: 'GMB SEO', detail: 'Dominate local searches with an optimised Google Business Profile.' },
      { name: 'Social Media Marketing', detail: 'Engaging content & campaigns across Instagram, Facebook & more.' },
      { name: 'YouTube Promotion', detail: 'Grow views, subscribers and watch-time with targeted promotion.' },
      { name: 'Paid Ads / PPC', detail: 'High-ROI Google & Meta ad campaigns, managed end to end.' },
      { name: 'WhatsApp Marketing', detail: 'Reach customers directly with bulk broadcasts & automation.' },
      { name: 'Email Marketing', detail: 'Nurture leads with designed, automated email journeys.' },
      { name: 'SMS Marketing', detail: 'Instant bulk SMS for offers, alerts and reminders.' },
      { name: 'Voice Marketing', detail: 'Automated voice-call campaigns that reach people at scale.' },
      { name: 'Content Marketing', detail: 'Blogs, articles and copy that attract and convert.' },
      { name: 'Political Campaign Marketing', detail: '360° digital campaigns for political outreach.' },
      { name: 'Digital Marketing by Industry', detail: 'Tailored strategies built for your specific sector.' },
    ],
  },
  {
    id: 'branding-pr',
    icon: Sparkles,
    title: 'Branding & PR',
    intro: 'Build a powerful, trusted identity that people recognise and remember.',
    items: [
      { name: 'Online Reputation Management', detail: 'Monitor, protect and improve your brand image online.' },
      { name: 'PR Agency', detail: 'Strategic public relations that get you noticed.' },
      { name: 'Press Release Distribution', detail: 'Publish your news across leading media outlets.' },
      { name: 'Brand Image Building', detail: 'Craft a consistent, memorable brand identity.' },
      { name: 'Digital Branding Agency', detail: 'Full-service branding built for the digital age.' },
      { name: 'Corporate Film Makers', detail: 'Cinematic corporate films that tell your story.' },
      { name: 'Corporate Video Production', detail: 'End-to-end video production for businesses.' },
      { name: 'TV Ads', detail: 'Concept-to-broadcast television commercials.' },
      { name: 'Influencer Marketing', detail: 'Partner with creators to amplify your reach.' },
      { name: 'Celebrity Management', detail: 'Connect your brand with the right celebrities.' },
      { name: 'Graphic Designing', detail: 'Logos, creatives and collateral that stand out.' },
    ],
  },
  {
    id: 'website-seo-packages',
    icon: Package,
    title: 'Website & SEO Packages',
    intro: 'Ready-made packages to get your business online and growing — fast.',
    items: [
      { name: 'Small Business Website Package', detail: 'An affordable, professional site to get you online quickly.' },
      { name: 'Business Website with SEO Package', detail: 'A complete website plus SEO to drive steady traffic.' },
      { name: 'eCommerce Web Designing Package', detail: 'Start selling online with a feature-rich store.' },
      { name: 'SEO Optimisation Package', detail: 'Ongoing SEO to climb the rankings month after month.' },
    ],
  },
  {
    id: 'our-work',
    icon: FolderKanban,
    title: 'Our Work',
    intro: 'A glimpse of the areas we deliver results in — across formats and channels.',
    showcase: true,
    items: [
      { name: 'Web Designing Portfolio', detail: 'Modern, responsive websites across industries.' },
      { name: 'SEO Portfolio', detail: 'Proven ranking & traffic growth case studies.' },
      { name: 'Graphic Design Portfolio', detail: 'Brand identities, creatives and print design.' },
      { name: 'Video Production Portfolio', detail: 'Corporate films, ads and social videos.' },
      { name: 'Digital PR', detail: 'Media coverage and reputation campaigns.' },
    ],
  },
];

/** Per-item icon (presentation only). Unlisted items fall back to the category icon. */
const ITEM_ICONS: Record<string, LucideIcon> = {
  // Web, App & AI Development
  'Website Development': Globe,
  'Web Application Development': Monitor,
  'Mobile App Development': Smartphone,
  'AI Agents & Chatbots': Bot,
  'AI Automation': Workflow,
  'SaaS Product Development': Rocket,
  'E-commerce Platforms': ShoppingCart,
  'CRM & ERP Systems': Database,
  'Custom Software': Code2,
  'UI/UX Design': PenTool,
  'API Development & Integration': Plug,
  'Cloud & Deployment': Cloud,
  // Digital Marketing
  'Business Website with SEO': LayoutTemplate,
  'SEO Services': Search,
  'GMB SEO': MapPin,
  'Social Media Marketing': Share2,
  'YouTube Promotion': MonitorPlay,
  'Paid Ads / PPC': TrendingUp,
  'WhatsApp Marketing': MessageCircle,
  'Email Marketing': Mail,
  'SMS Marketing': MessageSquare,
  'Voice Marketing': Mic,
  'Content Marketing': FileText,
  'Political Campaign Marketing': Landmark,
  'Digital Marketing by Industry': Building2,
  // Branding & PR
  'Online Reputation Management': ShieldCheck,
  'PR Agency': Newspaper,
  'Press Release Distribution': Send,
  'Brand Image Building': Gem,
  'Digital Branding Agency': BadgeCheck,
  'Corporate Film Makers': Clapperboard,
  'Corporate Video Production': Video,
  'TV Ads': Tv,
  'Influencer Marketing': Users,
  'Celebrity Management': Star,
  'Graphic Designing': Palette,
  // Website & SEO Packages
  'Small Business Website Package': Store,
  'Business Website with SEO Package': Globe,
  'eCommerce Web Designing Package': ShoppingCart,
  'SEO Optimisation Package': Search,
  // Our Work
  'Web Designing Portfolio': Monitor,
  'SEO Portfolio': TrendingUp,
  'Graphic Design Portfolio': Palette,
  'Video Production Portfolio': Film,
  'Digital PR': Newspaper,
};

interface Tone {
  /** Gradient for the category tile + active quick-nav chip. */
  tile: string;
  /** Item icon box (idle + group-hover). */
  icon: string;
  /** Item card hover border / glow. */
  hover: string;
  /** Hairline accent along the top edge of the category panel. */
  line: string;
}

// Indexed by category position (cyan, blue, emerald, violet, amber).
const TONES: Tone[] = [
  {
    tile: 'from-cyan-500 to-blue-600',
    icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white',
    hover: 'hover:border-sky-500/40 hover:shadow-sky-500/10',
    line: 'via-sky-500/60',
  },
  {
    tile: 'from-primary to-blue-600',
    icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
    hover: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
    line: 'via-blue-500/60',
  },
  {
    tile: 'from-emerald-500 to-green-600',
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
    hover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    line: 'via-emerald-500/60',
  },
  {
    tile: 'from-violet-500 to-fuchsia-600',
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white',
    hover: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
    line: 'via-violet-500/60',
  },
  {
    tile: 'from-amber-500 to-orange-600',
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    hover: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    line: 'via-amber-500/60',
  },
];

const SERVICE_COUNT = CATEGORIES.filter((c) => !c.showcase).reduce((n, c) => n + c.items.length, 0);

const RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const RING_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950';

const STEPS = [
  { title: 'Share your goals', text: 'Message or call us and tell us what you want to achieve.' },
  { title: 'Get the right plan', text: 'We recommend the services and package that fit your business.' },
  { title: 'We get to work', text: 'Our experts take it from idea to results.' },
];

export function AllServices() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  // Highlight the quick-nav chip of the category currently crossing the upper-middle of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = CATEGORIES.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).pop();
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Keep the active chip visible inside the horizontally scrollable chip row (mobile).
  useEffect(() => {
    if (!activeId) return;
    const box = chipsRef.current;
    const chip = box?.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!box || !chip || box.scrollWidth <= box.clientWidth) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.scrollTo({
      left: chip.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [activeId]);

  const openChatbot = () => window.dispatchEvent(new CustomEvent('openChatbot'));

  return (
    // overflow-x-clip (not -hidden) so the sticky quick-nav keeps working.
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      {/* Ambient glows */}
      <div aria-hidden className="animate-aurora pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div aria-hidden className="animate-aurora pointer-events-none absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="animate-aurora pointer-events-none absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="animate-hero-rise inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold tracking-wide text-primary dark:text-accent mb-5">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
              <Code2 size={13} />
            </span>
            GlofiHub Digital
          </span>
          <h1
            className="animate-hero-rise font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]"
            style={{ animationDelay: '80ms' }}
          >
            Everything Your Brand{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Needs to Grow
            </span>
          </h1>
          <p
            className="animate-hero-rise mt-5 text-base md:text-lg text-foreground/60 font-medium leading-relaxed"
            style={{ animationDelay: '160ms' }}
          >
            GlofiHub Digital brings web, apps and AI together with digital marketing, branding and PR —{' '}
            {SERVICE_COUNT}+ services under one roof, delivered by experts who care about your results.
          </p>
          <div
            className="animate-hero-rise mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <a
              href={waLink(WHATSAPP_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-shine group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0 transition-all ${RING}`}
            >
              <MessageCircle size={16} /> Get Started on WhatsApp
              <ArrowRight size={16} className="group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
            </a>
            <a
              href={`#${CATEGORIES[0].id}`}
              className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-card border border-foreground/15 text-foreground font-semibold text-sm tracking-wide hover:border-foreground/30 hover:shadow-md transition-all ${RING}`}
            >
              Explore Services
            </a>
          </div>
        </div>

        {/* Quick-nav + categories (sticky nav lives only as long as the categories do) */}
        <div>
          <div className="sticky top-[4.5rem] z-30 mb-10 md:mb-14">
            <nav
              aria-label="Service categories"
              className="rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30"
            >
              <div
                ref={chipsRef}
                className="relative flex gap-1.5 p-1.5 overflow-x-auto snap-x lg:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const active = activeId === cat.id;
                  return (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      data-chip={cat.id}
                      aria-current={active ? 'location' : undefined}
                      onClick={() => setActiveId(cat.id)}
                      className={`snap-start shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${RING} ${
                        active
                          ? `bg-gradient-to-r ${TONES[i % TONES.length].tile} text-white shadow-md`
                          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      <Icon size={15} />
                      {cat.title}
                      <span
                        className={`text-[11px] leading-none rounded-full px-1.5 py-1 font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-foreground/8 text-foreground/60'
                        }`}
                      >
                        {cat.items.length}
                      </span>
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="space-y-10 md:space-y-14">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              const tone = TONES[i % TONES.length];
              return (
                <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className="scroll-mt-28">
                  <div
                    data-reveal
                    className="relative rounded-3xl border border-foreground/10 bg-muted/30 dark:bg-card/40 p-5 sm:p-8 md:p-10"
                  >
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent ${tone.line} to-transparent`}
                    />

                    {/* Category header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <span
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${tone.tile} text-white flex items-center justify-center shadow-lg shrink-0`}
                        >
                          <Icon size={24} />
                        </span>
                        <div className="min-w-0">
                          <h2
                            id={`${cat.id}-title`}
                            className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight"
                          >
                            {cat.title}
                          </h2>
                          <p className="mt-1 text-sm md:text-base text-foreground/60 font-medium">{cat.intro}</p>
                        </div>
                      </div>
                      <a
                        href={waLink(enquiryText(cat))}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Enquire about ${cat.title} on WhatsApp`}
                        className={`group/enq shrink-0 self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-foreground/15 text-foreground text-sm font-semibold hover:border-foreground/30 hover:shadow-md transition-all ${RING}`}
                      >
                        <MessageCircle size={15} />
                        Enquire on WhatsApp
                        <ArrowRight size={14} className="group-hover/enq:translate-x-0.5 motion-reduce:group-hover/enq:translate-x-0 transition-transform" />
                      </a>
                    </div>

                    {/* Items grid */}
                    <ul role="list" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {cat.items.map((item, idx) => {
                        const ItemIcon = ITEM_ICONS[item.name] ?? cat.icon;
                        return (
                          // data-reveal on the <li>, hover effects on the inner card, so the
                          // reveal transition never fights the hover transition.
                          <li key={item.name} data-reveal data-reveal-d={String((idx % 3) + 1)}>
                            <div
                              className={`group h-full flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0 ${tone.hover}`}
                            >
                              <span
                                className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${tone.icon}`}
                              >
                                <ItemIcon size={18} />
                              </span>
                              <div className="min-w-0">
                                <h3 className="font-display font-bold text-foreground leading-tight">{item.name}</h3>
                                <p className="text-sm text-foreground/60 font-medium mt-1 leading-relaxed">{item.detail}</p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          data-reveal
          className="mt-16 md:mt-24 relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-950 text-white p-6 sm:p-10 md:p-14"
        >
          <span aria-hidden className="animate-aurora pointer-events-none absolute -top-16 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <span aria-hidden className="animate-aurora pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-white mb-5">
                <Sparkles size={14} /> Let&apos;s build something great
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Not sure which service you need?
              </h2>
              <p className="mt-4 text-white/75 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Talk to our team — we&apos;ll understand your goals and recommend the right plan for you.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3">
                <a
                  href={waLink(WHATSAPP_TEXT)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-shine group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-white text-primary font-semibold text-sm tracking-wide text-center hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0 transition-all ${RING_ON_DARK}`}
                >
                  <MessageCircle size={16} /> Get Started on WhatsApp
                  <ArrowRight size={16} className="group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm tracking-wide hover:bg-white/20 transition-all ${RING_ON_DARK}`}
                >
                  <Phone size={16} /> Call {SITE.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={openChatbot}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white/85 hover:text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition-all cursor-pointer ${RING_ON_DARK}`}
                >
                  <Bot size={16} /> Ask our AI assistant
                </button>
              </div>

              <p className="mt-5 text-sm text-white/65 font-medium">
                Prefer email?{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className={`font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white rounded-sm ${RING_ON_DARK}`}
                >
                  {SITE.email}
                </a>
              </p>
            </div>

            {/* How it works */}
            <ol className="space-y-3">
              {STEPS.map((step, n) => (
                <li
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-4 sm:p-5"
                >
                  <span className="w-9 h-9 rounded-full bg-white text-primary font-display font-bold flex items-center justify-center shrink-0">
                    {n + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold leading-tight">{step.title}</h3>
                    <p className="mt-1 text-sm text-white/70 font-medium leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
