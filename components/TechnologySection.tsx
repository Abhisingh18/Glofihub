'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, Code2, MessageCircle } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';
import { TECH_CATEGORIES as CATEGORIES } from '@/components/technology/TechData';

const FOCUS_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950';

export function TechnologySection() {
  const tech = DIVISIONS.find((d) => d.slug === 'technology');
  const exploreLabel = tech?.cta ?? 'Explore Technology';
  const exploreHref = tech?.href ?? '/technology';

  const [activeId, setActiveId] = useState<string>(CATEGORIES[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  // On mobile the tab rail scrolls sideways — keep the selected tab in view.
  useEffect(() => {
    const box = railRef.current;
    const tab = box?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    if (!box || !tab || box.scrollWidth <= box.clientWidth) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.scrollTo({
      left: tab.offsetLeft - (box.clientWidth - tab.offsetWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [activeId]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = CATEGORIES.length - 1;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next < 0) return;
    e.preventDefault();
    setActiveId(CATEGORIES[next].id);
    tabRefs.current[next]?.focus();
  };

  const talkToTechTeam = () => {
    const message = `Hi GlofiHub, I'd like to talk to your technology team about ${active.title}.`;
    const contact = document.getElementById('contact');
    if (!contact) {
      // Safety net if this section is ever rendered on a page without the contact form.
      window.location.href = `/?requirement=technology&message=${encodeURIComponent(message)}#contact`;
      return;
    }
    window.dispatchEvent(
      new CustomEvent('prefillContact', { detail: { requirement: 'technology', message } }),
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contact.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="technology"
      aria-labelledby="technology-heading"
      className="relative overflow-hidden bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Ambient glows */}
      <div aria-hidden className="animate-aurora pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div aria-hidden className="animate-aurora pointer-events-none absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header: heading left, intro right */}
        <div data-reveal className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-10 mb-8 md:mb-12">
          <div>
            <span className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold tracking-wide text-primary dark:text-accent mb-5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
                <Code2 size={13} aria-hidden />
              </span>
              GlofiHub Technology
            </span>
            <h2
              id="technology-heading"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]"
            >
              Build.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                Automate.
              </span>{' '}
              Scale.
            </h2>
          </div>
          <p className="text-base md:text-lg text-foreground/60 font-medium leading-relaxed">
            Web, apps, AI, CRM, automation and SaaS — the technology arm of the GlofiHub ecosystem, organised into five
            focus areas.
          </p>
        </div>

        {/* Dark-navy panel: tab rail + category content */}
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary via-primary to-blue-950 text-white shadow-2xl shadow-primary/20 dark:shadow-black/40"
        >
          {/* Dot grid + glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage: 'linear-gradient(to bottom, black, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 75%)',
            }}
          />
          <span aria-hidden className="animate-aurora pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <span aria-hidden className="animate-aurora pointer-events-none absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="relative grid lg:grid-cols-[19rem_minmax(0,1fr)]">
            {/* Tab rail: horizontal scroll on mobile, vertical list on desktop */}
            <div className="border-b border-white/10 p-2.5 sm:p-4 lg:border-b-0 lg:border-r lg:p-6">
              <p className="hidden lg:block px-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-white/50">
                Focus areas
              </p>
              <div
                ref={railRef}
                role="tablist"
                aria-label="GlofiHub Technology focus areas"
                className="relative flex gap-1.5 overflow-x-auto p-1.5 snap-x lg:flex-col lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const selected = cat.id === active.id;
                  return (
                    <button
                      key={cat.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`tech-tab-${cat.id}`}
                      data-tab={cat.id}
                      aria-selected={selected}
                      aria-controls={`tech-panel-${cat.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveId(cat.id)}
                      onKeyDown={(e) => onTabKeyDown(e, i)}
                      className={`snap-start shrink-0 lg:shrink lg:w-full inline-flex items-center gap-3 rounded-xl px-3 py-2.5 lg:px-3.5 lg:py-3 text-left text-sm font-semibold whitespace-nowrap lg:whitespace-normal transition-all duration-300 cursor-pointer ${FOCUS_ON_DARK} ${
                        selected
                          ? 'bg-white text-primary shadow-lg'
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.tile} text-white flex items-center justify-center shrink-0 shadow-md`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{cat.title}</span>
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className={`hidden lg:block shrink-0 transition-all duration-300 ${
                          selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panels */}
            <div className="min-w-0 p-5 sm:p-8 lg:p-10">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const selected = cat.id === active.id;
                return (
                  <div
                    key={cat.id}
                    role="tabpanel"
                    id={`tech-panel-${cat.id}`}
                    aria-labelledby={`tech-tab-${cat.id}`}
                    hidden={!selected}
                    tabIndex={selected ? 0 : -1}
                    className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-blue-950"
                  >
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                          <span
                            aria-hidden
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${cat.tile} text-white flex items-center justify-center shadow-lg shrink-0`}
                          >
                            <Icon size={24} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">{cat.title}</h3>
                            <p className="mt-1 text-sm md:text-base text-white/70 font-medium leading-relaxed">
                              {cat.tagline}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/technology/services#${cat.id}`}
                          aria-label={`See all ${cat.title} services`}
                          className={`group/all shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-white text-sm font-semibold hover:bg-white/20 transition-colors ${FOCUS_ON_DARK}`}
                        >
                          See all services
                          <ArrowUpRight
                            size={15}
                            aria-hidden
                            className="transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 motion-reduce:group-hover/all:translate-x-0 motion-reduce:group-hover/all:translate-y-0"
                          />
                        </Link>
                      </div>

                      <ul role="list" className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {cat.items.map((item, idx) => {
                          const ItemIcon = item.icon;
                          return (
                            <li key={item.name} className="flex">
                              <div className="group relative flex w-full items-start gap-3.5 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:border-white/30 motion-reduce:hover:translate-y-0">
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute -bottom-3 right-3 select-none font-display text-6xl font-extrabold leading-none text-white/[0.05]"
                                >
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span
                                  aria-hidden
                                  className="relative w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-white group-hover:text-primary"
                                >
                                  <ItemIcon size={20} />
                                </span>
                                <div className="relative min-w-0">
                                  <h4 className="font-display font-bold leading-tight">{item.name}</h4>
                                  <p className="mt-1 text-sm text-white/65 font-medium leading-relaxed">{item.detail}</p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="relative flex flex-col gap-5 border-t border-white/10 bg-black/10 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p className="max-w-xl text-sm md:text-base text-white/75 font-medium leading-relaxed text-center lg:text-left">
              Not sure where to start? Tell us what you want to build and our tech team will point you to the right fit.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 shrink-0">
              <Link
                href={exploreHref}
                className={`btn-shine group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-white text-primary font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0 transition-all ${FOCUS_ON_DARK}`}
              >
                {exploreLabel}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform"
                />
              </Link>
              <button
                type="button"
                onClick={talkToTechTeam}
                className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm tracking-wide hover:bg-white/20 transition-all cursor-pointer ${FOCUS_ON_DARK}`}
              >
                <MessageCircle size={16} aria-hidden /> Talk to our tech team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
