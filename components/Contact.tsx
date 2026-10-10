'use client';

import {
  Check,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
  Sparkles,
  MessageCircle,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { DIVISIONS } from '@/lib/divisions';
import { SITE } from '@/lib/site';
import { getAttribution } from '@/lib/utm';

const ADDRESS = 'Dwarkapuri Road No. 2, Hanuman Nagar, Kankarbagh, Patna, Bihar – 800020';
const WHATSAPP_BASE = `https://wa.me/${SITE.whatsapp}`;

/** Requirement options, in display order. The label is what gets sent to the CRM; the slug is used for prefill links/events. */
const REQUIREMENTS = [
  { slug: 'education', label: 'Education' },
  { slug: 'academy', label: 'Academy / Courses' },
  { slug: 'jobs', label: 'Jobs & Careers' },
  { slug: 'consulting', label: 'Consulting' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'global-opportunities', label: 'Global Opportunities' },
  { slug: 'partners', label: 'Partner Network' },
  { slug: 'institutional', label: 'Institutional Partnership' },
  { slug: 'other', label: 'Other' },
] as const;

type ContactMethod = 'phone' | 'whatsapp' | 'email';

const METHODS: { value: ContactMethod; label: string; icon: LucideIcon }[] = [
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'email', label: 'Email', icon: Mail },
];

/** Input limits (keeps requests small; the server validates again). */
const MAX = { name: 100, phone: 25, email: 254, location: 120, message: 1000 } as const;

const GENERIC_ERROR = "We couldn't send your request right now. Please try again, or reach us directly on WhatsApp.";

interface FormState {
  name: string;
  phone: string;
  email: string;
  location: string;
  requirement: string;
  contactMethod: ContactMethod | '';
  message: string;
  /** Honeypot — real visitors never see or fill this. */
  website: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  email: '',
  location: '',
  requirement: '',
  contactMethod: '',
  message: '',
  website: '',
};

type FieldKey = 'name' | 'phone' | 'email' | 'requirement' | 'contactMethod';
type FieldErrors = Partial<Record<FieldKey, string>>;
const FIELD_ORDER: FieldKey[] = ['name', 'phone', 'email', 'requirement', 'contactMethod'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Accepts a requirement slug ("partners") or label ("Partner Network"); returns the label, or '' if unknown. */
function resolveRequirement(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (!v) return '';
  return REQUIREMENTS.find((r) => r.slug === v || r.label.toLowerCase() === v)?.label ?? '';
}

function validate(f: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (f.name.trim().length < 2) errors.name = 'Please enter your name.';

  const phone = f.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s\-().]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number (7–15 digits).';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!REQUIREMENTS.some((r) => r.label === f.requirement)) {
    errors.requirement = 'Please choose what you need help with.';
  }
  if (!METHODS.some((m) => m.value === f.contactMethod)) {
    errors.contactMethod = "Please choose how you'd like us to contact you.";
  }
  return errors;
}

/** WhatsApp deep link with whatever the visitor has filled in so far (works with an empty form too). */
function buildWhatsAppUrl(f: FormState): string {
  const lines: string[] = [];
  const add = (label: string, value: string) => {
    const v = value.trim();
    if (v) lines.push(`${label}: ${v}`);
  };
  add('Name', f.name);
  add('Phone', f.phone);
  add('Email', f.email);
  add('City / Country', f.location);
  add('Requirement', f.requirement);
  const method = METHODS.find((m) => m.value === f.contactMethod);
  if (method) add('Preferred contact', method.label);
  add('Message', f.message);

  const intro = lines.length
    ? "Hi GlofiHub! I'd like to get in touch."
    : "Hi GlofiHub! I'd like to know more about GlofiHub.";
  return `${WHATSAPP_BASE}?text=${encodeURIComponent([intro, ...lines].join('\n'))}`;
}

/** Shared styling for every field on the dark-gradient panel (visible focus ring, 16px text on mobile to avoid iOS zoom). */
const fieldClass =
  'contact-field w-full min-w-0 px-4 py-3.5 bg-white/10 border border-white/25 rounded-xl text-base sm:text-sm ' +
  'placeholder:text-white/50 transition-colors hover:bg-white/15 aria-invalid:border-rose-300 ' +
  'focus-visible:outline-none focus-visible:border-emerald-300 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-emerald-300/70';

const labelClass = 'block text-xs font-semibold text-white/85 mb-2 tracking-wide';

const ctaBase =
  'w-full sm:flex-1 lg:flex-none xl:flex-1 py-4 px-5 font-semibold text-sm tracking-wide rounded-full flex items-center justify-center gap-2.5 cursor-pointer ' +
  'transition-all motion-reduce:transition-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

function Required() {
  return (
    <>
      <span aria-hidden="true" className="text-emerald-300">
        *
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}

function Optional() {
  return <span className="font-normal text-white/65"> (optional)</span>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-rose-200">
      {message}
    </p>
  );
}

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
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [focusRequest, setFocusRequest] = useState<{ field: 'requirement' | 'message'; n: number } | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const requirementRef = useRef<HTMLSelectElement>(null);
  const methodRef = useRef<HTMLInputElement>(null); // first radio of the group
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const submittingRef = useRef(false);
  /** True once the visitor has typed their own message — a later prefill must not overwrite it. */
  const messageDirty = useRef(false);

  const submitting = status === 'submitting';
  const waHref = useMemo(() => buildWhatsAppUrl(form), [form]);

  const selectedSlug = REQUIREMENTS.find((r) => r.label === form.requirement)?.slug;
  const selectedDivision = selectedSlug ? DIVISIONS.find((d) => d.slug === selectedSlug) : undefined;

  const clearError = (key: FieldKey) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  const dismissSuccess = () => setStatus((s) => (s === 'success' ? 'idle' : s));

  const update =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (key === 'message') messageDirty.current = value.trim() !== '';
      setForm((f) => ({ ...f, [key]: value }));
      clearError(key as FieldKey); // no-op for fields that have no validation error
      dismissSuccess();
    };

  const chooseMethod = (value: ContactMethod) => {
    setForm((f) => ({ ...f, contactMethod: value }));
    clearError('contactMethod');
    dismissSuccess();
  };

  /** Apply a requirement / message prefill (from the `prefillContact` event or the URL query). */
  const applyPrefill = useCallback((detail: { requirement?: unknown; message?: unknown }, focus: boolean) => {
    const label = typeof detail.requirement === 'string' ? resolveRequirement(detail.requirement) : '';
    const message = typeof detail.message === 'string' ? detail.message.trim().slice(0, MAX.message) : '';
    if (!label && !message) return;

    const applyMessage = Boolean(message) && !messageDirty.current;
    if (applyMessage) messageDirty.current = false;

    setForm((f) => ({
      ...f,
      ...(label ? { requirement: label } : {}),
      ...(applyMessage ? { message } : {}),
    }));
    if (label) setErrors((prev) => (prev.requirement ? { ...prev, requirement: undefined } : prev));
    setStatus((s) => (s === 'success' ? 'idle' : s));
    if (focus) setFocusRequest({ field: applyMessage ? 'message' : 'requirement', n: Date.now() });
  }, []);

  // Prefill: once from the URL on mount, and whenever another section dispatches `prefillContact`.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    applyPrefill({ requirement: params.get('requirement'), message: params.get('message') }, false);

    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<{ requirement?: unknown; message?: unknown } | null>).detail;
      if (detail && typeof detail === 'object') applyPrefill(detail, true);
    };
    window.addEventListener('prefillContact', onPrefill);
    return () => window.removeEventListener('prefillContact', onPrefill);
  }, [applyPrefill]);

  // Move focus after a prefill event, once the new values are committed. preventScroll so we
  // don't fight the dispatcher's smooth scroll to #contact.
  useEffect(() => {
    if (!focusRequest) return;
    const el = focusRequest.field === 'message' ? messageRef.current : requirementRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    if (el instanceof HTMLTextAreaElement) el.setSelectionRange(el.value.length, el.value.length);
  }, [focusRequest]);

  const focusField = (key: FieldKey) => {
    const refs = {
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      requirement: requirementRef,
      contactMethod: methodRef,
    } as const;
    refs[key].current?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const found = validate(form);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      setStatus('idle');
      setServerError('');
      focusField(firstInvalid);
      return;
    }

    submittingRef.current = true;
    setStatus('submitting');
    setServerError('');

    const location = form.location.trim();
    const message = form.message.trim();
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      ...(location ? { location } : {}),
      requirement: form.requirement,
      contact_method: form.contactMethod,
      ...(message ? { message } : {}),
      source: 'contact-form',
      page: window.location.pathname,
      ...getAttribution(),
      website: form.website,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let data: { ok?: boolean; error?: string } | null = null;
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        data = null;
      }

      if (res.ok && data?.ok) {
        setForm(EMPTY_FORM);
        setErrors({});
        messageDirty.current = false;
        setStatus('success');
      } else {
        setServerError(typeof data?.error === 'string' && data.error.trim() ? data.error : GENERIC_ERROR);
        setStatus('error');
      }
    } catch {
      setServerError(GENERIC_ERROR);
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      submittingRef.current = false;
    }
  };

  const describedBy = (key: FieldKey) => (errors[key] ? id(`${key}-error`) : undefined);

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
            Let&apos;s Start{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
              Something Meaningful
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/70 leading-relaxed font-medium max-w-md">
            Education, skills, careers, consulting, technology, global opportunities or a partnership — tell us what
            you&apos;re looking for and the GlofiHub team will point you in the right direction.
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

          {/* What to expect */}
          <div className="mt-8 pt-7 border-t border-foreground/10">
            <p className="text-xs font-semibold text-primary tracking-wide mb-4">How to reach us</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                'One request form for every GlofiHub vertical',
                'Choose phone, WhatsApp or email to hear back',
                'Share as much or as little as you like',
                'Prefer to talk first? Call or WhatsApp us directly',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground/80">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 mt-0.5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0"
                  >
                    <Check className="text-emerald-600 dark:text-emerald-400" size={11} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium leading-snug">{item}</span>
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
              Tell us what you need
            </h3>
            <p className="text-sm text-white/80 font-medium mb-1">
              Share your requirement and choose how you&apos;d like us to reach you.
            </p>
            <p className="text-xs text-white/70 mb-6">
              Fields marked <span aria-hidden="true" className="text-emerald-300 font-bold">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-labelledby={id('form-title')}
              aria-busy={submitting}
              className="space-y-4 [color-scheme:dark]"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label htmlFor={id('name')} className={labelClass}>
                    Name <Required />
                  </label>
                  <input
                    ref={nameRef}
                    id={id('name')}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={MAX.name}
                    value={form.name}
                    onChange={update('name')}
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy('name')}
                    className={`${fieldClass} text-white`}
                    placeholder="Full name"
                  />
                  <FieldError id={id('name-error')} message={errors.name} />
                </div>
                <div className="min-w-0">
                  <label htmlFor={id('phone')} className={labelClass}>
                    Phone <Required />
                  </label>
                  <input
                    ref={phoneRef}
                    id={id('phone')}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={MAX.phone}
                    value={form.phone}
                    onChange={update('phone')}
                    aria-required="true"
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={describedBy('phone')}
                    className={`${fieldClass} text-white`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  <FieldError id={id('phone-error')} message={errors.phone} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label htmlFor={id('email')} className={labelClass}>
                    Email <Required />
                  </label>
                  <input
                    ref={emailRef}
                    id={id('email')}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={MAX.email}
                    value={form.email}
                    onChange={update('email')}
                    aria-required="true"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy('email')}
                    className={`${fieldClass} text-white`}
                    placeholder="you@example.com"
                  />
                  <FieldError id={id('email-error')} message={errors.email} />
                </div>
                <div className="min-w-0">
                  <label htmlFor={id('location')} className={labelClass}>
                    City / Country
                    <Optional />
                  </label>
                  <input
                    id={id('location')}
                    name="location"
                    type="text"
                    autoComplete="address-level2"
                    maxLength={MAX.location}
                    value={form.location}
                    onChange={update('location')}
                    className={`${fieldClass} text-white`}
                    placeholder="e.g. Patna, India"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={id('requirement')} className={labelClass}>
                  Requirement <Required />
                </label>
                <div className="relative">
                  <select
                    ref={requirementRef}
                    id={id('requirement')}
                    name="requirement"
                    autoComplete="off"
                    value={form.requirement}
                    onChange={update('requirement')}
                    aria-required="true"
                    aria-invalid={errors.requirement ? true : undefined}
                    aria-describedby={
                      [describedBy('requirement'), selectedDivision ? id('requirement-hint') : undefined]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    className={`${fieldClass} appearance-none cursor-pointer pr-11 ${form.requirement ? 'text-white' : 'text-white/60'}`}
                  >
                    <option value="" className="bg-[#0A2F6B] text-white">
                      What do you need help with?
                    </option>
                    {REQUIREMENTS.map((r) => (
                      <option key={r.slug} value={r.label} className="bg-[#0A2F6B] text-white">
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                  />
                </div>
                <FieldError id={id('requirement-error')} message={errors.requirement} />
                {selectedDivision && (
                  <p id={id('requirement-hint')} className="mt-2 text-xs text-white/75 leading-relaxed">
                    {selectedDivision.tagline}
                    {selectedDivision.status === 'soon' &&
                      ` — ${selectedDivision.name} is launching soon, but you can still send a request.`}
                  </p>
                )}
              </div>

              <fieldset className="min-w-0" aria-describedby={describedBy('contactMethod')}>
                <legend className={labelClass}>
                  Preferred Contact Method <Required />
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m, i) => {
                    const checked = form.contactMethod === m.value;
                    const Icon = m.icon;
                    return (
                      <div key={m.value} className="relative min-w-0">
                        <input
                          ref={i === 0 ? methodRef : undefined}
                          id={id(`method-${m.value}`)}
                          type="radio"
                          name="contact_method"
                          value={m.value}
                          checked={checked}
                          onChange={() => chooseMethod(m.value)}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={id(`method-${m.value}`)}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2 py-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer select-none transition-colors motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0A2F6B] ${
                            checked
                              ? 'bg-white text-[#0A2F6B] border-white'
                              : `bg-white/10 text-white/85 hover:bg-white/15 ${errors.contactMethod ? 'border-rose-300' : 'border-white/25'}`
                          }`}
                        >
                          <Icon size={15} aria-hidden="true" className="shrink-0" />
                          {m.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <FieldError id={id('contactMethod-error')} message={errors.contactMethod} />
              </fieldset>

              <div>
                <label htmlFor={id('message')} className={labelClass}>
                  Message
                  <Optional />
                </label>
                <textarea
                  ref={messageRef}
                  id={id('message')}
                  name="message"
                  autoComplete="off"
                  maxLength={MAX.message}
                  value={form.message}
                  onChange={update('message')}
                  className={`${fieldClass} text-white resize-y min-h-24`}
                  rows={4}
                  placeholder="Tell us a little about what you're looking for"
                />
              </div>

              {/* Honeypot — visually hidden, skipped by keyboard and assistive tech. Humans never fill it. */}
              <div aria-hidden="true" className="sr-only">
                <label htmlFor={id('website')}>Leave this field empty</label>
                <input
                  id={id('website')}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={update('website')}
                />
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${ctaBase} btn-shine group bg-white text-[#0A2F6B] hover:shadow-2xl hover:shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={16}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" /> Submit Request
                    </>
                  )}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ctaBase} bg-emerald-500/15 text-white border border-emerald-300/50 hover:bg-emerald-500/25 hover:border-emerald-200/70`}
                >
                  <MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <p className="text-[11px] text-white/70 text-center leading-relaxed">
                Submit Request sends your details to the GlofiHub team. Chat on WhatsApp opens WhatsApp with whatever
                you&apos;ve filled in — tap send there to reach us.
              </p>
            </form>

            {/* Status regions stay mounted so screen readers announce the messages. */}
            <div aria-live="polite" role="status">
              {status === 'success' && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-300/40 text-emerald-50 text-sm animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
                  <p className="flex items-center gap-2 font-semibold">
                    <CircleCheck size={18} aria-hidden="true" className="shrink-0 text-emerald-300" />
                    Request received
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/90">
                    Thank you — your request has been sent to the GlofiHub team. We&apos;ll get back to you using your
                    preferred contact method.
                  </p>
                </div>
              )}
            </div>
            <div role="alert">
              {status === 'error' && (
                <div className="mt-4 p-4 rounded-xl bg-rose-500/15 border border-rose-300/50 text-rose-50 text-sm animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
                  <p className="flex items-start gap-2 font-semibold">
                    <CircleAlert size={18} aria-hidden="true" className="shrink-0 mt-px text-rose-200" />
                    <span>{serverError || GENERIC_ERROR}</span>
                  </p>
                  <p className="mt-2 text-xs text-rose-100/90">
                    In a hurry?{' '}
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-2 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                    >
                      Continue on WhatsApp
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>{' '}
                    with your details pre-filled.
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
