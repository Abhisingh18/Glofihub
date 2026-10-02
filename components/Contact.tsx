'use client';

import {
  Check,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  MessageCircle,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { DIVISIONS } from '@/lib/divisions';
import { SITE } from '@/lib/site';

const ADDRESS = 'Dwarkapuri Road No. 2, Hanuman Nagar, Kankarbagh, Patna, Bihar – 800020';
const OTHER_BUSINESS = 'Other / Not sure';
const WHATSAPP_BASE = `https://wa.me/${SITE.whatsapp}`;

interface FormState {
  name: string;
  phone: string;
  email: string;
  business: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', phone: '', email: '', business: '', message: '' };

/** Shared styling for every field on the dark-gradient panel (visible focus ring, 16px text on mobile to avoid iOS zoom). */
const fieldClass =
  'contact-field w-full min-w-0 px-4 py-3.5 bg-white/10 border border-white/25 rounded-xl text-base sm:text-sm ' +
  'placeholder:text-white/50 transition-colors hover:bg-white/15 ' +
  'focus-visible:outline-none focus-visible:border-emerald-300 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-emerald-300/70';

const labelClass = 'block text-xs font-semibold text-white/85 mb-2 tracking-wide';

function ContactRow({
  href,
  icon: Icon,
  label,
  value,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-foreground/10 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 transition-all motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md shadow-primary/25"
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold text-foreground/70 tracking-wide">{label}</span>
        <span className="block text-sm font-bold text-foreground mt-0.5 break-words group-hover:text-primary transition-colors">
          {value}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        size={16}
        className="shrink-0 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

export function Contact() {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const update =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const selectedDivision = DIVISIONS.find((d) => d.name === form.business);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // There is no lead backend yet — the form only prefills a WhatsApp message.
    const whatsappMessage = [
      `Hi GlofiHub! I am ${form.name.trim()}.`,
      `Business: ${form.business}`,
      `Email: ${form.email.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Message: ${form.message.trim()}`,
    ].join('\n');

    const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setWaUrl(url);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setWaUrl(null), 8000);
  };

  return (
    <section id="contact" aria-labelledby={id('heading')} className="w-full">
      {/* Autofill keeps the dark field look; native controls (select list) render dark. */}
      <style>{`
        .contact-field:-webkit-autofill,
        .contact-field:-webkit-autofill:hover,
        .contact-field:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          caret-color: #fff;
          transition: background-color 99999s ease-out 0s;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left — info */}
        <div
          data-reveal
          className="w-full lg:w-1/2 bg-muted/30 p-6 sm:p-8 md:p-14 lg:p-16 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5 w-fit">
            <Sparkles size={14} className="text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-primary">Contact Us</span>
          </div>
          <h2
            id={id('heading')}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground"
          >
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Touch
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/70 leading-relaxed font-medium max-w-md">
            Questions about studying abroad, skills, global trade or digital services? Tell us which GlofiHub business
            you&apos;re enquiring about and our team will guide you — reach out anytime.
          </p>

          {/* Contact rows */}
          <div className="flex flex-col gap-3 mt-8 max-w-xl">
            <ContactRow href={`tel:${SITE.phone}`} icon={Phone} label="Call Us" value={SITE.phoneDisplay} />
            <ContactRow
              href={WHATSAPP_BASE}
              icon={MessageCircle}
              label="WhatsApp"
              value={SITE.phoneDisplay}
              external
            />
            <ContactRow href={`mailto:${SITE.email}`} icon={Mail} label="Email Us" value={SITE.email} />
            <ContactRow
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
              icon={MapPin}
              label="Visit Us"
              value={ADDRESS}
              external
            />
          </div>

          {/* Why choose us */}
          <div className="mt-8 pt-7 border-t border-foreground/10">
            <p className="text-xs font-semibold text-primary tracking-wide mb-4">Why Choose Us</p>
            <ul className="grid grid-cols-2 gap-3">
              {['AI Guidance', 'Verified Jobs', '24/7 Support', 'End-to-End'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground/80">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0"
                  >
                    <Check className="text-emerald-600 dark:text-emerald-400" size={11} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — form */}
        <div
          data-reveal
          data-reveal-d="1"
          className="relative w-full lg:w-1/2 bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 p-6 sm:p-8 md:p-14 lg:p-16 flex flex-col justify-center overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-aurora motion-reduce:animate-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-blue-400/15 blur-3xl"
          />

          <div className="relative">
            <h3
              id={id('form-title')}
              className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight mb-1"
            >
              Send us a message
            </h3>
            <p className="text-sm text-white/80 font-medium mb-1">
              Fill this in and we&apos;ll continue the conversation on WhatsApp.
            </p>
            <p className="text-xs text-white/70 mb-6">
              Fields marked <span aria-hidden="true" className="text-emerald-300 font-bold">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <form onSubmit={handleSubmit} aria-labelledby={id('form-title')} className="space-y-4 [color-scheme:dark]">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label htmlFor={id('name')} className={labelClass}>
                    Your Name <span aria-hidden="true" className="text-emerald-300">*</span>
                  </label>
                  <input
                    id={id('name')}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    className={`${fieldClass} text-white`}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor={id('phone')} className={labelClass}>
                    Phone Number <span aria-hidden="true" className="text-emerald-300">*</span>
                  </label>
                  <input
                    id={id('phone')}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    className={`${fieldClass} text-white`}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={id('email')} className={labelClass}>
                  Email Address <span aria-hidden="true" className="text-emerald-300">*</span>
                </label>
                <input
                  id={id('email')}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  className={`${fieldClass} text-white`}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor={id('business')} className={labelClass}>
                  Which business are you enquiring about?{' '}
                  <span aria-hidden="true" className="text-emerald-300">*</span>
                </label>
                <div className="relative">
                  <select
                    id={id('business')}
                    name="business"
                    value={form.business}
                    onChange={update('business')}
                    aria-describedby={selectedDivision ? id('business-hint') : undefined}
                    className={`${fieldClass} appearance-none cursor-pointer pr-11 ${form.business ? 'text-white' : 'text-white/60'}`}
                    required
                  >
                    <option value="" className="bg-[#0A2F6B] text-white">
                      Select a business
                    </option>
                    {DIVISIONS.map((d) => (
                      <option key={d.slug} value={d.name} className="bg-[#0A2F6B] text-white">
                        {d.name}
                      </option>
                    ))}
                    <option value={OTHER_BUSINESS} className="bg-[#0A2F6B] text-white">
                      {OTHER_BUSINESS}
                    </option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                  />
                </div>
                {selectedDivision && (
                  <p id={id('business-hint')} className="mt-2 text-xs text-white/75 leading-relaxed">
                    {selectedDivision.tagline}
                    {selectedDivision.status === 'soon' &&
                      ` — ${selectedDivision.name} is launching soon, but you can still send an enquiry.`}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={id('message')} className={labelClass}>
                  Your Message <span aria-hidden="true" className="text-emerald-300">*</span>
                </label>
                <textarea
                  id={id('message')}
                  name="message"
                  autoComplete="off"
                  value={form.message}
                  onChange={update('message')}
                  className={`${fieldClass} text-white resize-y min-h-24`}
                  rows={4}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-shine group w-full py-4 bg-white text-[#0A2F6B] font-semibold text-sm tracking-wide rounded-full hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]"
              >
                <MessageCircle size={16} aria-hidden="true" /> Continue on WhatsApp
                <ArrowRight
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  size={16}
                />
              </button>

              <p className="text-[11px] text-white/70 text-center leading-relaxed">
                This opens WhatsApp with your details pre-filled — tap send there to reach us.
              </p>
            </form>

            {/* Status region stays mounted so screen readers announce the success message. */}
            <div aria-live="polite" role="status">
              {waUrl && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-300/40 text-emerald-50 text-xs text-center animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
                  <p className="font-semibold">Form submitted! Opening WhatsApp…</p>
                  <p className="mt-1 text-emerald-100/90">
                    Nothing happened?{' '}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-2 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                    >
                      Continue on WhatsApp
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
