'use client';

import {
  Megaphone, Sparkles, Package, FolderKanban, Check, ArrowRight, Phone,
  type LucideIcon,
} from 'lucide-react';

interface ServiceItem {
  name: string;
  detail: string;
}
interface ServiceCategory {
  icon: LucideIcon;
  title: string;
  intro: string;
  items: ServiceItem[];
}

const WHATSAPP_NUMBER = '919241168875';
const WHATSAPP_TEXT = 'Hi GlofiHub 👋, I want to know more about your services.';

const CATEGORIES: ServiceCategory[] = [
  {
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
    icon: FolderKanban,
    title: 'Our Work',
    intro: 'A glimpse of the areas we deliver results in — across formats and channels.',
    items: [
      { name: 'Web Designing Portfolio', detail: 'Modern, responsive websites across industries.' },
      { name: 'SEO Portfolio', detail: 'Proven ranking & traffic growth case studies.' },
      { name: 'Graphic Design Portfolio', detail: 'Brand identities, creatives and print design.' },
      { name: 'Video Production Portfolio', detail: 'Corporate films, ads and social videos.' },
      { name: 'Digital PR', detail: 'Media coverage and reputation campaigns.' },
    ],
  },
];

const accents = [
  'from-primary to-blue-600',
  'from-emerald-500 to-green-600',
  'from-violet-500 to-fuchsia-600',
  'from-amber-500 to-orange-600',
];

export function AllServices() {
  const total = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="relative pt-28 md:pt-32 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 tracking-wide mb-5">
            <Sparkles size={14} /> Our Services
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Everything Your Brand{' '}
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Needs to Grow
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-foreground/60 font-medium leading-relaxed">
            From digital marketing and branding to websites and PR — {total}+ services
            under one roof, delivered by experts who care about your results.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12 md:space-y-16">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title}>
                {/* Category header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accents[i % accents.length]} text-white flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon size={22} />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">{cat.title}</h2>
                    <p className="text-sm text-foreground/55 font-medium">{cat.intro}</p>
                  </div>
                </div>

                {/* Items grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="group p-5 rounded-2xl bg-card border border-foreground/10 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/12 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-foreground leading-tight">{item.name}</h3>
                          <p className="text-sm text-foreground/55 font-medium mt-1 leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-20 relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-950 text-white p-8 md:p-12 text-center">
          <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 w-60 h-60 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
              Not sure which service you need?
            </h2>
            <p className="mt-3 text-white/75 font-medium max-w-xl mx-auto">
              Talk to our team — we&apos;ll understand your goals and recommend the right plan for you.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="tel:+919241168875"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm tracking-wide hover:bg-white/20 transition-all"
              >
                <Phone size={16} /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
