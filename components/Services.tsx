'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles, GraduationCap, Code2, Briefcase, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SubTabItem {
  id: string;
  label: string;
  details: string;
  courses: string[];
}

export function Services() {
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({
    'service-education': 'india',
    'service-skills': 'technical',
    'service-jobs': 'india',
    'service-partnerships': 'institutional',
  });

  const subTabs: Record<string, SubTabItem[]> = {
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

  const services: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    icon: LucideIcon;
  features: string[];
  }[] = [
    {
      id: 'service-education',
      title: 'Education Abroad',
      tagline: '50+ Countries',
      description: 'Personalized guidance for universities, scholarships, and admission across 50+ countries. Master the international admission process with expert mentorship.',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=900&fit=crop&q=80',
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

  return (
    <section id="services" className="relative overflow-hidden bg-background">
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
      `}</style>

      {/* Ambient brand aurora — matches Hero/About */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 right-1/4 w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />

      {/* ── Header (matches About / Pathway heading system) ── */}
      <div data-reveal className="relative z-10 py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-semibold tracking-wide text-primary">Our Services</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground max-w-4xl">
          What We Can Do for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
            Our Clients
          </span>
        </h2>
        <p className="mt-5 text-sm sm:text-base text-foreground/70 leading-relaxed font-medium max-w-2xl">
          We&apos;re a team of strategic education experts working globally. We believe progress happens when you choose innovation over comfort.
        </p>
      </div>

      {/* ── Service rows (framed inside the same max-w-7xl container as About/Pathway) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 space-y-8 md:space-y-10">
        {services.map((service, index) => {
          const currentSubTabId = activeTabs[service.id];
          const selectedSubTab = subTabs[service.id]?.find(tab => tab.id === currentSubTabId);
          const ServiceIcon = service.icon;

          return (
            <div
              key={service.id}
              id={service.id}
              data-reveal
              className="group rounded-3xl overflow-hidden border border-foreground/10 shadow-lg shadow-black/5 scroll-mt-24"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[480px] lg:min-h-[540px]`}>
              {/* Image Half */}
              <div className="w-full lg:w-1/2 relative min-h-[260px] md:min-h-[340px] lg:min-h-0 lg:h-auto overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                {/* Cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A214D]/85 via-[#0A214D]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#0A214D]/10 lg:to-[#0A214D]/40" />

                {/* Giant ghost index */}
                <span className="absolute bottom-1 left-4 lg:left-7 font-display text-[6rem] lg:text-[9rem] font-extrabold leading-none text-white/10 select-none pointer-events-none transition-all duration-700 group-hover:text-white/[0.18]">
                  0{index + 1}
                </span>

                {/* Floating icon + tagline chip */}
                <div className="absolute top-5 left-5 lg:top-8 lg:left-8 flex items-center gap-3">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <ServiceIcon size={24} />
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide">
                    {service.tagline}
                  </span>
                </div>
              </div>

              {/* Content Half */}
              <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-primary via-primary to-blue-950 p-7 sm:p-9 lg:p-11 flex flex-col justify-center overflow-hidden">
                {/* Inner glow accent on hover */}
                <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative">
                  <h3 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-extrabold text-white tracking-tight leading-tight mb-3">
                    {service.title}
                  </h3>
                  {/* Animated underline (emerald accent to match theme) */}
                  <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mb-5 transition-all duration-700 ease-out group-hover:w-24" />
                  <p className="text-sm text-white/75 leading-relaxed font-medium">{service.description}</p>

                  {/* Dynamic sub-tabs */}
                  <div className="border-t border-white/10 pt-6 mt-6 mb-6 text-center lg:text-left">
                    <p className="text-xs font-semibold text-white/50 tracking-wide mb-3">Choose Pathway / Segment</p>
                    <div className="grid grid-cols-2 lg:flex lg:flex-row gap-2 sm:gap-2.5 w-full lg:w-auto justify-center lg:justify-start">
                      {subTabs[service.id]?.map((tab) => {
                        const isActive = currentSubTabId === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTabs(prev => ({ ...prev, [service.id]: tab.id }))}
                            className={`w-full lg:w-auto px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer text-center ${
                              isActive
                                ? 'bg-white text-primary border-white shadow-lg shadow-black/30 scale-[1.03]'
                                : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10 hover:text-white hover:scale-[1.03]'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sub-tab details — re-keyed for transition on tab change */}
                    {selectedSubTab && (
                      <div
                        key={currentSubTabId}
                        className="mt-4 p-5 rounded-2xl bg-white/[0.07] border border-white/10 animate-subtab-slide text-left backdrop-blur-sm"
                      >
                        <p className="text-sm text-white/85 leading-relaxed font-medium mb-4">
                          {selectedSubTab.details}
                        </p>

                        <p className="text-xs font-semibold text-white/50 tracking-wide mb-3">Programs &amp; Core Fields</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                          {selectedSubTab.courses.map((course, cIdx) => (
                            <div
                              key={cIdx}
                              className="svc-course flex items-center gap-2.5 text-white/80"
                              style={{ animationDelay: `${cIdx * 70 + 120}ms` }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                              <span className="text-sm font-medium">{course}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3.5 mt-1">
                    <p className="text-xs font-semibold text-white/50 tracking-wide">Our Approach</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                      {service.features.map((feature, i) => (
                        <div
                          key={i}
                          className="svc-feature flex items-start gap-2.5 text-white/85"
                          style={{ animationDelay: `${i * 80 + 150}ms` }}
                        >
                          <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="text-emerald-300" size={11} strokeWidth={3} />
                          </span>
                          <span className="text-sm font-medium leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`https://wa.me/919241168875?text=${encodeURIComponent('Hi GlofiHub, I am interested in ' + service.title + ' (' + (selectedSubTab?.label || '') + ')')}`, '_blank')}
                    className="btn-shine group/btn mt-8 w-fit px-8 py-4 rounded-full bg-white text-primary font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                  >
                    Get Started
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </button>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
