'use client';

import { useId, useState, type FormEvent } from 'react';
import { CheckCircle2, CircleAlert, Loader2, MessageCircle, Send } from 'lucide-react';
import { SITE } from '@/lib/site';
import { getAttribution } from '@/lib/utm';

/**
 * Reusable enquiry form for the GlofiHub business websites. Posts to /api/leads (the same CRM inbox
 * as the main contact form). Core fields (name, phone, email, city/country, preferred contact method,
 * message) are always there; `extraFields` adds business-specific questions, which are appended to the
 * message as "Label: value" lines so the admin sees them in the Leads inbox.
 */
export interface ExtraField {
  name: string;
  label: string;
  type?: 'text' | 'select' | 'textarea';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface Props {
  /** Must be one of LEAD_REQUIREMENTS (lib/validations.ts), e.g. 'Import-Export', 'Academy / Courses'. */
  requirement: string;
  /** Short tag saved with the lead, e.g. 'import-export-enquiry'. */
  source: string;
  title: string;
  intro?: string;
  extraFields?: ExtraField[];
  messageLabel?: string;
  messageRequired?: boolean;
  submitLabel?: string;
  successText?: string;
  /** Text for the WhatsApp fallback button. */
  whatsappText?: string;
  id?: string;
}

type Method = 'phone' | 'whatsapp' | 'email';
type Status = 'idle' | 'sending' | 'success' | 'error';

const FIELD =
  'w-full rounded-xl border border-foreground/10 bg-muted/40 px-4 py-3 text-base sm:text-sm placeholder:text-foreground/40 transition-all focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';
const LABEL = 'mb-1.5 block text-xs font-semibold tracking-wide text-foreground/70';

export function LeadForm({
  requirement,
  source,
  title,
  intro,
  extraFields = [],
  messageLabel = 'Message',
  messageRequired = false,
  submitLabel = 'Submit enquiry',
  successText = 'Thank you — we have received your request.',
  whatsappText,
  id,
}: Props) {
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

  const [core, setCore] = useState({ name: '', phone: '', email: '', location: '', message: '', website: '' });
  const [method, setMethod] = useState<Method>('whatsapp');
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const setC = (k: keyof typeof core) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCore((c) => ({ ...c, [k]: e.target.value }));
    setErrors((er) => (er[k] ? { ...er, [k]: '' } : er));
    if (status === 'success') setStatus('idle');
  };
  const setE = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setExtra((x) => ({ ...x, [k]: e.target.value }));
    setErrors((er) => (er[k] ? { ...er, [k]: '' } : er));
    if (status === 'success') setStatus('idle');
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (core.name.trim().length < 2) er.name = 'Please enter your name';
    const phone = core.phone.trim();
    if (phone.length < 8 || phone.length > 20 || !/^[0-9+\-()\s]+$/.test(phone)) er.phone = 'Please enter a valid phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(core.email.trim())) er.email = 'Please enter a valid email address';
    if (messageRequired && !core.message.trim()) er.message = 'Please add a few details';
    for (const f of extraFields) if (f.required && !(extra[f.name] ?? '').trim()) er[f.name] = 'This field is required';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  // Business-specific answers become "Label: value" lines in front of the free-text message.
  const buildMessage = () => {
    const lines = extraFields
      .map((f) => ((extra[f.name] ?? '').trim() ? `${f.label}: ${(extra[f.name] ?? '').trim()}` : ''))
      .filter(Boolean);
    const note = core.message.trim();
    return [...lines, note ? `${messageLabel}: ${note}` : ''].filter(Boolean).join('\n').slice(0, 2000);
  };

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    [whatsappText ?? `Hi GlofiHub! I have an enquiry (${requirement}).`, core.name && `Name: ${core.name}`, buildMessage()]
      .filter(Boolean)
      .join('\n')
  )}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending' || !validate()) return;
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: core.name.trim(),
          phone: core.phone.trim(),
          email: core.email.trim(),
          location: core.location.trim() || undefined,
          requirement,
          contact_method: method,
          message: buildMessage() || undefined,
          source,
          page: window.location.pathname,
          website: core.website, // honeypot — must stay empty
          ...getAttribution(),
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        setStatus('success');
        setCore({ name: '', phone: '', email: '', location: '', message: '', website: '' });
        setExtra({});
        return;
      }
      setServerError(data?.error || 'Something went wrong. Please try again or message us on WhatsApp.');
      setStatus('error');
    } catch {
      setServerError('Network error. Please try again or message us on WhatsApp.');
      setStatus('error');
    }
  };

  const err = (k: string) =>
    errors[k] ? (
      <p id={fid(`${k}-err`)} className="mt-1 text-[11px] font-medium text-rose-600">
        {errors[k]}
      </p>
    ) : null;
  const ariaFor = (k: string) => ({ 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? fid(`${k}-err`) : undefined });

  return (
    <div id={id} className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold tracking-tight">{title}</h2>
      {intro && <p className="mt-2 text-sm leading-relaxed text-foreground/60">{intro}</p>}

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={fid('website')}>Website</label>
          <input id={fid('website')} name="website" tabIndex={-1} autoComplete="off" value={core.website} onChange={setC('website')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={fid('name')} className={LABEL}>
              Name <span aria-hidden>*</span>
            </label>
            <input id={fid('name')} className={FIELD} autoComplete="name" value={core.name} onChange={setC('name')} required {...ariaFor('name')} />
            {err('name')}
          </div>
          <div>
            <label htmlFor={fid('phone')} className={LABEL}>
              Phone <span aria-hidden>*</span>
            </label>
            <input
              id={fid('phone')}
              className={FIELD}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 XXXXX XXXXX"
              value={core.phone}
              onChange={setC('phone')}
              required
              {...ariaFor('phone')}
            />
            {err('phone')}
          </div>
          <div>
            <label htmlFor={fid('email')} className={LABEL}>
              Email <span aria-hidden>*</span>
            </label>
            <input
              id={fid('email')}
              className={FIELD}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={core.email}
              onChange={setC('email')}
              required
              {...ariaFor('email')}
            />
            {err('email')}
          </div>
          <div>
            <label htmlFor={fid('location')} className={LABEL}>
              City / Country
            </label>
            <input id={fid('location')} className={FIELD} autoComplete="address-level2" value={core.location} onChange={setC('location')} />
          </div>
        </div>

        {extraFields.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {extraFields.map((f) => (
              <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label htmlFor={fid(f.name)} className={LABEL}>
                  {f.label} {f.required && <span aria-hidden>*</span>}
                </label>
                {f.type === 'select' ? (
                  <select id={fid(f.name)} className={`${FIELD} cursor-pointer`} value={extra[f.name] ?? ''} onChange={setE(f.name)} required={f.required} {...ariaFor(f.name)}>
                    <option value="">Select…</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea id={fid(f.name)} rows={3} className={FIELD} placeholder={f.placeholder} value={extra[f.name] ?? ''} onChange={setE(f.name)} required={f.required} {...ariaFor(f.name)} />
                ) : (
                  <input id={fid(f.name)} className={FIELD} placeholder={f.placeholder} value={extra[f.name] ?? ''} onChange={setE(f.name)} required={f.required} {...ariaFor(f.name)} />
                )}
                {err(f.name)}
              </div>
            ))}
          </div>
        )}

        <fieldset>
          <legend className={LABEL}>Preferred contact method</legend>
          <div className="flex flex-wrap gap-2">
            {(['whatsapp', 'phone', 'email'] as const).map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                  method === m ? 'border-primary bg-primary/10 text-primary dark:text-accent' : 'border-foreground/15 text-foreground/70 hover:border-primary/40'
                }`}
              >
                <input type="radio" name={fid('method')} value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                {m === 'whatsapp' ? 'WhatsApp' : m}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={fid('message')} className={LABEL}>
            {messageLabel} {messageRequired && <span aria-hidden>*</span>}
          </label>
          <textarea id={fid('message')} rows={4} className={FIELD} value={core.message} onChange={setC('message')} {...ariaFor('message')} />
          {err('message')}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {status === 'sending' ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={16} aria-hidden />}
            {status === 'sending' ? 'Sending…' : submitLabel}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3.5 text-sm font-semibold hover:border-[#25D366] hover:text-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <MessageCircle size={16} aria-hidden /> Chat on WhatsApp
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <div aria-live="polite" role="status">
          {status === 'success' && (
            <p className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={18} aria-hidden className="mt-px shrink-0" /> {successText}
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <CircleAlert size={18} aria-hidden className="mt-px shrink-0" /> {serverError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
