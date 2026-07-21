'use client';

import { useEffect, useState } from 'react';
import { X, Stethoscope, Briefcase, CheckCircle2, ArrowRight, CalendarClock, type LucideIcon } from 'lucide-react';

const WHATSAPP_NUMBER = '919241168875';

interface Flyer {
  key: string;
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  icon: LucideIcon;
  gradient: string;   // header background
  accent: string;     // badge / icon tint
  wa: string;         // prefilled WhatsApp text
}

const FLYERS: Flyer[] = [
  {
    key: 'mbbs',
    tag: 'Admissions Open 2026',
    title: 'MBBS Abroad Counselling',
    subtitle: 'Study medicine in Russia, Georgia, Kazakhstan & more — at a fraction of the cost.',
    points: ['NMC & WHO approved universities', 'No donation · Affordable fees', 'End-to-end visa & admission support'],
    icon: Stethoscope,
    gradient: 'from-primary via-primary to-blue-950',
    accent: 'text-emerald-300',
    wa: 'Hi GlofiHub! 👋 I saw the MBBS Abroad counselling flyer. I want free counselling for MBBS admission.',
  },
  {
    key: 'mba',
    tag: 'Limited Seats',
    title: 'MBA Counselling',
    subtitle: 'Top B-schools in India & abroad — pick the right programme for your career.',
    points: ['Profile evaluation & college shortlisting', 'Scholarship & education loan guidance', 'Application + interview preparation'],
    icon: Briefcase,
    gradient: 'from-violet-700 via-violet-800 to-indigo-950',
    accent: 'text-amber-300',
    wa: 'Hi GlofiHub! 👋 I saw the MBA counselling flyer. I want free counselling for MBA admission.',
  },
];

const FIRST_DELAY = 5000;    // first flyer after 5s
const ROTATE_AFTER = 12000;  // auto-switch to next flyer after 12s
const REOPEN_AFTER = 45000;  // reappear 45s after being closed

export function CounsellingFlyers() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // First appearance
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), FIRST_DELAY);
    return () => clearTimeout(t);
  }, []);

  // While open: rotate to the next flyer
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % FLYERS.length), ROTATE_AFTER);
    return () => clearTimeout(t);
  }, [open, index]);

  const close = () => {
    setOpen(false);
    setIndex((i) => (i + 1) % FLYERS.length); // next time show the other flyer
    setTimeout(() => setOpen(true), REOPEN_AFTER);
  };

  if (!open) return null;

  const f = FLYERS[index];
  const Icon = f.icon;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(f.wa)}`;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-24 md:translate-x-0 z-[60] w-[min(22rem,calc(100vw-2rem))] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div key={f.key} className="relative rounded-3xl overflow-hidden bg-card border border-foreground/10 shadow-2xl">
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${f.gradient} text-white p-5 overflow-hidden`}>
          <span aria-hidden className="pointer-events-none absolute -top-10 -right-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X size={16} />
          </button>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold tracking-wide mb-3 ${f.accent}`}>
            <CalendarClock size={11} /> {f.tag}
          </span>

          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center shrink-0">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-display text-lg font-extrabold leading-tight">{f.title}</h3>
              <p className="text-[11px] text-white/75 font-medium mt-0.5 leading-snug">{f.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <ul className="space-y-2 mb-4">
            {f.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[13px] text-foreground/75 font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" /> {p}
              </li>
            ))}
          </ul>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-md shadow-[#25D366]/30 hover:-translate-y-0.5 transition-all"
          >
            Book Free Counselling <ArrowRight size={15} />
          </a>

          <button
            onClick={() => { close(); window.dispatchEvent(new CustomEvent('openGetStarted')); }}
            className="w-full mt-2 py-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Or create your free account →
          </button>

          {/* Flyer dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {FLYERS.map((x, i) => (
              <button
                key={x.key}
                onClick={() => setIndex(i)}
                aria-label={`Show ${x.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === index ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
