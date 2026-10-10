'use client';

import { Fragment, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowRight,
  Check,
  Sparkles,
  GraduationCap,
  Code2,
  Briefcase,
  Handshake,
  Stethoscope,
  Cpu,
  BriefcaseBusiness,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SITE } from '@/lib/site';
import { DIVISIONS } from '@/lib/divisions';

interface SubTabItem {
  id: string;
  label: string;
  details: string;
  courses: string[];
}

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  features: string[];
}

const SUB_TABS: Record<string, SubTabItem[]> = {
  'service-education': [
    {
      id: 'india',
      label: 'In India',
      details: 'Secure admissions in leading Indian private and state institutions for top programs with dedicated, certified counselling.',
      courses: ['MBBS / BDS', 'B.Tech / CSE / IT', 'MBA / PGDM', 'BBA / BCA / MCA']
    },
    {
      id: 'abroad',
      label: 'Abroad',
      details: 'Direct admissions to premier medical & state universities across Russia, Georgia, Uzbekistan, Kazakhstan, and Kyrgyzstan with full on-ground support.',
      courses: ['Global MBBS', 'International MD / MS', 'Aviation & Pilot Training', 'Global B.Tech Programs']
    }
  ],
  'service-skills': [
    {
      id: 'technical',
      label: 'Technical Skills',
      details: 'Industry-designed software engineering cohorts led by expert developers. Master technical skills with live project execution.',
      courses: ['Full-Stack Web Dev', 'Data Science & AI', 'Machine Learning / Python', 'Cyber Security Basics']
    },
    {
      id: 'professional',
      label: 'Professional Skills',
      details: 'Equip yourself with career-ready professional communication, interview masterclasses, LinkedIn branding, and resume refinement.',
      courses: ['Business Communication', 'Resume & LinkedIn Mastery', 'Public Speaking Bootcamps', 'Corporate Etiquette Prep']
    }
  ],
  'service-jobs': [
    {
      id: 'india',
      label: 'Jobs in India',
      details: 'Direct placement connections with top tech corporations and healthcare networks in major tech hubs (Noida, Bangalore, Pune, Gurgaon).',
      courses: ['Software Engineer (SDE)', 'Business Development (BD)', 'Data Analyst Roles', 'Nursing & Hospital Admin']
    },
    {
      id: 'abroad',
      label: 'Jobs Abroad',
      details: 'Launch an international career with global pathways in hospital networks, corporate houses, and logistics partners abroad.',
      courses: ['Resident Medical Officers', 'Cloud/DevOps Engineers', 'International Logistics Liaison', 'Language Translation Experts']
    }
  ],
  'service-partnerships': [
    {
      id: 'institutional',
      label: 'With Colleges & Schools',
      details: 'Collaborate with GlofiHub to open specialized smart learning centers, career guidance pods, and academic pathways on-campus.',
      courses: ['Joint Global Pathways', 'On-Campus Training Pods', 'Smart Learning Setup', 'High-School AI Workshops']
    },
    {
      id: 'corporate',
      label: 'With Employers & Corporates',
      details: 'Partner with us to create custom-trained talent pipelines, sponsor technical bootcamps, and run dedicated hiring drives.',
      courses: ['Co-Designed Curriculum', 'Direct SDE Sourcing Pool', 'Dedicated Hiring Drives', 'Corporate Sponsorship Hubs']
    }
  ]
};

const SERVICES: ServiceItem[] = [
  {
    id: 'service-education',
    title: 'Education Abroad',
    tagline: 'Study in India & Abroad',
    description: 'Personalized guidance for universities, scholarships, and admission in India and abroad. Master the admission process with expert mentorship.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Students attending a seminar in a large hall',
    icon: GraduationCap,
    features: [
      'University selection & application guidance',
      'Scholarship and financial aid assistance',
      'Visa documentation and interview prep',
      'On-ground support in host countries',
      'Pre-departure orientation and planning'
    ]
  },
  {
    id: 'service-skills',
    title: 'Skill Development',
    tagline: 'Industry-Designed',
    description: 'Master in-demand skills through industry-designed courses. Build expertise that employers actively seek in today’s competitive global market.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Two learners working together at a laptop with code on the screen',
    icon: Code2,
    features: [
      'Industry-recognized certification programs',
      'Hands-on technical and soft skills training',
      'Project-based learning and case studies',
      'Mentorship from industry professionals',
      'Access to premium learning resources'
    ]
  },
  {
    id: 'service-jobs',
    title: 'Job Placement',
    tagline: 'Global Employers',
    description: 'Connect with leading global employers. We match your skills with opportunities that align perfectly with your career aspirations and growth goals.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'A team of professionals working on laptops around a table',
    icon: Briefcase,
    features: [
      'Direct connection with global employers',
      'Resume optimization and portfolio review',
      'Interview coaching and mock sessions',
      'Market research and competitor analysis',
      'Salary negotiation and contract support'
    ]
  },
  {
    id: 'service-partnerships',
    title: 'Global Partnerships',
    tagline: 'Academic + Corporate',
    description: 'Form powerful collaborations with global academic institutions, corporate recruiters, and regional networks. We build robust pathways for future leaders.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Two people shaking hands to seal a partnership',
    icon: Handshake,
    features: [
      'Institutional academic integrations & pathways',
      'Franchise and regional representative networks',
      'Corporate recruitment & placement partnerships',
      'Co-developed skill certifications with industry giants',
      'Joint ventures for mentorship and guidance'
    ]
  },
];

// Education pathway categories (blueprint §3: Medical, Technology, Management, Other Programs).
// Labels come from the Education vertical in lib/divisions.ts; icons are matched by label.
const EDU_CATEGORY_FALLBACK = ['Medical', 'Technology', 'Management', 'Other Programs'];
const EDU_CATEGORY_STYLE: Record<string, { icon: LucideIcon; tile: string }> = {
  Medical: { icon: Stethoscope, tile: 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300' },
  Technology: { icon: Cpu, tile: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300' },
  Management: { icon: BriefcaseBusiness, tile: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300' },
  'Other Programs': { icon: Layers, tile: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300' },
};
const EDU_CATEGORY_DEFAULT = EDU_CATEGORY_STYLE['Other Programs'];
const EDU_CATEGORIES: string[] =
  DIVISIONS.find((d) => d.slug === 'education')?.categories ?? EDU_CATEGORY_FALLBACK;

// Shared focus ring for controls that sit on the dark-navy content panel.
const ON_NAVY_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

export function Services() {
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({
    'service-education': 'india',
    'service-skills': 'technical',
    'service-jobs': 'india',
    'service-partnerships': 'institutional',
  });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (serviceId: string, tabId: string) =>
    setActiveTabs(prev => ({ ...prev, [serviceId]: tabId }));

  // WAI-ARIA tabs pattern: roving tabindex, Left/Right (+Home/End) move focus and select.
  const handleTabKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    serviceId: string,
    tabs: SubTabItem[],
    index: number
  ) => {
    let next = index;
    switch (e.key) {
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const target = tabs[next];
    selectTab(serviceId, target.id);
    tabRefs.current[`${serviceId}-tab-${target.id}`]?.focus();
  };

  return (
    <section id="services" aria-labelledby="services-heading" className="relative overflow-hidden bg-background">
      {/* Component-scoped animation helpers */}
      <style>{`
        @keyframes subTabSlide {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-subtab-slide {
          animation: subTabSlide 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes svcFeatureIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .svc-feature { opacity: 0; animation: svcFeatureIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes svcCourseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .svc-course { opacity: 0; animation: svcCourseIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .animate-subtab-slide { animation: none; }
          .svc-feature, .svc-course { opacity: 1; animation: none; }
        }
      `}</style>

      {/* Ambient brand aurora — matches Hero/About */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 right-1/4 w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />

      {/* ── Header (matches About / Pathway heading system) ── */}
      <div data-reveal className="relative z-10 pt-16 pb-10 md:pt-24 md:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
          <Sparkles size={14} className="text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide text-primary">GlofiHub Education</span>
        </div>
        <h2
          id="services-heading"
          className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground max-w-4xl"
        >
          Education Pathways{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
            in India and Abroad
          </span>
        </h2>
        <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium max-w-2xl">
          We&apos;re a team of strategic education experts working globally, guiding you from admission and visa support to skills, placement and partnerships. We believe progress happens when you choose innovation over comfort.
        </p>

        {/* Pathway categories — informational chips (not links) */}
        <div className="mt-8">
          <p id="services-pathways-label" className="text-xs font-semibold tracking-wide text-foreground/60 mb-3">
            Pathway categories
          </p>
          <ul role="list" aria-labelledby="services-pathways-label" className="flex flex-wrap gap-2.5">
            {EDU_CATEGORIES.map((label) => {
              const { icon: CategoryIcon, tile } = EDU_CATEGORY_STYLE[label] ?? EDU_CATEGORY_DEFAULT;
              return (
                <li
                  key={label}
                  className="inline-flex items-center gap-2.5 py-1.5 pl-1.5 pr-4 rounded-full bg-card border border-foreground/10 shadow-sm shadow-black/5 text-sm font-semibold text-foreground"
                >
                  <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tile}`}>
                    <CategoryIcon size={14} />
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── Service rows (framed inside the same max-w-7xl container as About/Pathway) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 space-y-8 md:space-y-10">
        {SERVICES.map((service, index) => {
          const tabs = SUB_TABS[service.id] ?? [];
          const currentSubTabId = activeTabs[service.id];
          const selectedSubTab = tabs.find(tab => tab.id === currentSubTabId);
          const ServiceIcon = service.icon;
          const titleId = `${service.id}-title`;
          const tablistLabelId = `${service.id}-pathway-label`;
          const panelId = `${service.id}-panel`;

          const interest = selectedSubTab ? `${service.title} (${selectedSubTab.label})` : service.title;
          const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi GlofiHub, I am interested in ${interest}`)}`;

          return (
            <Fragment key={service.id}>
              {/* Divider between the Education row and the supporting programmes */}
              {index === 1 && (
                <div data-reveal className="pt-4 md:pt-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      More ways GlofiHub supports your journey
                    </h3>
                    <span aria-hidden className="hidden sm:block h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                  </div>
                  <p className="mt-2 text-sm text-foreground/70 font-medium max-w-2xl">
                    Skill development, job placement and partnerships, alongside your education pathway.
                  </p>
                </div>
              )}
              {/* Outer element owns the anchor id + scroll-reveal (its transition is controlled by globals.css). */}
              <div id={service.id} data-reveal className="scroll-mt-24">
                <article
                  aria-labelledby={titleId}
                  className="group rounded-3xl overflow-hidden border border-foreground/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/30 transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/15"
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} lg:min-h-[540px]`}>
                    {/* Image Half */}
                    <div className="w-full lg:w-1/2 relative h-56 sm:h-72 md:h-80 lg:h-auto overflow-hidden bg-[#0A214D]">
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        width={1200}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out motion-safe:group-hover:scale-105"
                      />
                      {/* Cinematic gradient overlay */}
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0A214D]/85 via-[#0A214D]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#0A214D]/10 lg:to-[#0A214D]/40" />

                      {/* Giant ghost index */}
                      <span
                        aria-hidden
                        className="absolute bottom-1 left-4 lg:left-7 font-display text-[5rem] sm:text-[6rem] lg:text-[9rem] font-extrabold leading-none text-white/10 select-none pointer-events-none transition-colors duration-700 group-hover:text-white/[0.18]"
                      >
                        0{index + 1}
                      </span>

                      {/* Floating icon + tagline chip */}
                      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 lg:top-8 lg:left-8 flex items-center gap-3">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-xl transition-transform duration-500 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6">
                          <ServiceIcon size={24} aria-hidden="true" />
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide">
                          {service.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Content Half — fixed brand navy in both themes so white text always has contrast */}
                    <div className="relative w-full lg:w-1/2 min-w-0 bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 p-6 sm:p-9 lg:p-11 flex flex-col justify-center overflow-hidden">
                      {/* Inner glow accent on hover */}
                      <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                      <div className="relative">
                        <h3
                          id={titleId}
                          className="font-display text-2xl md:text-3xl lg:text-[2rem] font-extrabold text-white tracking-tight leading-tight mb-3"
                        >
                          {service.title}
                        </h3>
                        {/* Animated underline (emerald accent to match theme) */}
                        <div aria-hidden className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mb-5 transition-all duration-700 ease-out group-hover:w-24" />
                        <p className="text-sm text-white/80 leading-relaxed font-medium">{service.description}</p>

                        {/* Dynamic sub-tabs */}
                        <div className="border-t border-white/10 pt-6 mt-6 mb-6">
                          <p id={tablistLabelId} className="text-xs font-semibold text-white/65 tracking-wide mb-3">
                            Choose Pathway / Segment
                          </p>
                          <div role="tablist" aria-labelledby={tablistLabelId} className="flex flex-wrap gap-2">
                            {tabs.map((tab, tabIndex) => {
                              const isActive = currentSubTabId === tab.id;
                              const tabDomId = `${service.id}-tab-${tab.id}`;
                              return (
                                <button
                                  key={tab.id}
                                  ref={(el) => {
                                    tabRefs.current[tabDomId] = el;
                                  }}
                                  id={tabDomId}
                                  type="button"
                                  role="tab"
                                  aria-selected={isActive}
                                  aria-controls={panelId}
                                  tabIndex={isActive ? 0 : -1}
                                  onClick={() => selectTab(service.id, tab.id)}
                                  onKeyDown={(e) => handleTabKeyDown(e, service.id, tabs, tabIndex)}
                                  className={`inline-flex min-h-[44px] items-center justify-center px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer text-center ${ON_NAVY_FOCUS} ${
                                    isActive
                                      ? 'bg-white text-[#0A2F6B] border-white shadow-lg shadow-black/30'
                                      : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/40'
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Sub-tab details — inner block is re-keyed for the transition on tab change */}
                          <div
                            role="tabpanel"
                            id={panelId}
                            aria-labelledby={`${service.id}-tab-${currentSubTabId}`}
                            tabIndex={0}
                            className="mt-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]"
                          >
                            {selectedSubTab && (
                              <div
                                key={currentSubTabId}
                                className="p-4 sm:p-5 rounded-2xl bg-white/[0.07] border border-white/10 animate-subtab-slide text-left backdrop-blur-sm"
                              >
                                <p className="text-sm text-white/90 leading-relaxed font-medium mb-4">
                                  {selectedSubTab.details}
                                </p>

                                <p className="text-xs font-semibold text-white/65 tracking-wide mb-3">Programs &amp; Core Fields</p>
                                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                                  {selectedSubTab.courses.map((course, cIdx) => (
                                    <li
                                      key={course}
                                      className="svc-course flex items-center gap-2.5 text-white/85"
                                      style={{ animationDelay: `${cIdx * 70 + 120}ms` }}
                                    >
                                      <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                      <span className="text-sm font-medium">{course}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3.5 mt-1">
                          <p className="text-xs font-semibold text-white/65 tracking-wide">Our Approach</p>
                          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-3">
                            {service.features.map((feature, i) => (
                              <li
                                key={feature}
                                className="svc-feature flex items-start gap-2.5 text-white/90"
                                style={{ animationDelay: `${i * 80 + 150}ms` }}
                              >
                                <span aria-hidden className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                  <Check className="text-emerald-300" size={11} strokeWidth={3} />
                                </span>
                                <span className="text-sm font-medium leading-snug">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn-shine group/btn inline-flex w-fit items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#0A2F6B] font-semibold text-sm tracking-wide shadow-lg shadow-black/20 transition-all duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-500/20 ${ON_NAVY_FOCUS}`}
                          >
                            Get Started
                            <span className="sr-only"> with {service.title} on WhatsApp (opens in a new tab)</span>
                            <ArrowRight className="transition-transform motion-safe:group-hover/btn:translate-x-1" size={16} aria-hidden="true" />
                          </a>
                          <p className="text-xs font-medium text-white/65">Chat with our team on WhatsApp</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
