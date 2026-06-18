'use client';

import { useEffect, useState } from 'react';
import { X, GraduationCap, User, Mail, Phone, MapPin, Calendar, BookOpen, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { saveLead } from '@/lib/leads';

/**
 * Email delivery.
 * Web3Forms is a free, no-backend service that emails submissions to your inbox.
 * 1) Go to https://web3forms.com, enter info@glofihub.com, get a free Access Key.
 * 2) Paste it below. Until then, an email-client (mailto) fallback is used.
 */
const WEB3FORMS_ACCESS_KEY = '';
const ADMIN_EMAIL = 'info@glofihub.com';
const WHATSAPP_NUMBER = '919241168875';

interface StudentData {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: string;
  service: string;
  preference: string;
  message: string;
}

const empty: StudentData = { name: '', email: '', phone: '', city: '', age: '', service: '', preference: '', message: '' };

export function StudentForm() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<StudentData>(empty);

  useEffect(() => {
    const handleOpen = () => {
      setDone(false);
      setForm(empty);
      setOpen(true);
    };
    window.addEventListener('openStudentForm', handleOpen);
    return () => window.removeEventListener('openStudentForm', handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  const set = (k: keyof StudentData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const buildDetails = () =>
    `New Student Enquiry — GlofiHub\n\n` +
    `Name: ${form.name}\n` +
    `Email: ${form.email}\n` +
    `WhatsApp / Phone: ${form.phone}\n` +
    `City: ${form.city}\n` +
    `Age: ${form.age}\n` +
    `Interested In: ${form.service}\n` +
    `Preferred Country / Course: ${form.preference}\n` +
    `Message: ${form.message}`;

  const sendEmail = async (details: string) => {
    if (WEB3FORMS_ACCESS_KEY) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...form,
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New Student Lead: ${form.name}`,
            from_name: 'GlofiHub Website',
            email: form.email,
            to: ADMIN_EMAIL,
            message: details,
          }),
        });
        return;
      } catch {
        /* fall through to mailto */
      }
    }
    // Fallback: open the user's email client addressed to admin
    const subject = encodeURIComponent(`New Student Enquiry — ${form.name}`);
    const body = encodeURIComponent(details);
    window.open(`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const details = buildDetails();

    // 1) Save to the admin dashboard store (Supabase or localStorage)
    try {
      await saveLead({ ...form });
    } catch {
      /* non-blocking — WhatsApp/email still go through */
    }

    // 2) Email (Gmail inbox via Web3Forms, or mailto fallback)
    await sendEmail(details);

    // 3) WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details)}`, '_blank');

    setSending(false);
    setDone(true);
  };

  const field =
    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-foreground/10 focus:bg-background focus:border-primary focus:outline-none transition-all text-sm';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-lg max-h-[92dvh] flex flex-col bg-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary via-primary to-accent text-white p-5 flex items-center justify-between overflow-hidden shrink-0">
          <span aria-hidden className="pointer-events-none absolute -top-10 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-white/15 ring-2 ring-white/25 flex items-center justify-center">
              <GraduationCap size={22} />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Student Registration</h3>
              <p className="text-[11px] font-medium text-white/80">Fill your details — we&apos;ll reach you fast</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="relative p-2 hover:bg-white/20 rounded-xl transition cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="p-10 text-center flex flex-col items-center">
            <span className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
              <CheckCircle2 size={34} className="text-emerald-600" />
            </span>
            <h4 className="font-display text-xl font-extrabold text-foreground tracking-tight">Details Submitted!</h4>
            <p className="text-sm text-foreground/65 font-medium mt-2 max-w-xs">
              Your details have been shared on WhatsApp{WEB3FORMS_ACCESS_KEY ? ' and emailed to our team' : ' and your email app'}. Our counselor will connect with you shortly.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="btn-shine mt-6 px-7 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input className={field} placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input className={field} type="number" min={10} max={80} placeholder="Age" value={form.age} onChange={(e) => set('age', e.target.value)} required />
              </div>
            </div>

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input className={field} type="email" placeholder="Email address" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input className={field} type="tel" placeholder="WhatsApp number" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
              </div>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input className={field} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} required />
              </div>
            </div>

            <div className="relative">
              <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 z-10" />
              <select className={`${field} appearance-none cursor-pointer`} value={form.service} onChange={(e) => set('service', e.target.value)} required>
                <option value="">Interested in…</option>
                <option value="Education Abroad">Education Abroad</option>
                <option value="MBBS Abroad">MBBS Abroad</option>
                <option value="Education in India">Education in India</option>
                <option value="Job Placement">Job Placement</option>
                <option value="Skill Development">Skill Development</option>
                <option value="Collaboration">Collaboration</option>
              </select>
            </div>

            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input className={field} placeholder="Preferred country / course (e.g. Russia MBBS)" value={form.preference} onChange={(e) => set('preference', e.target.value)} />
            </div>

            <div className="relative">
              <MessageSquare size={15} className="absolute left-3.5 top-3 text-foreground/40" />
              <textarea className={`${field} pt-2.5`} rows={3} placeholder="Message (optional)" value={form.message} onChange={(e) => set('message', e.target.value)} />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-shine group w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
            >
              {sending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <><Send size={16} /> Submit Details</>}
            </button>

            <p className="text-center text-[11px] text-foreground/40 font-medium">
              Your details go to our team via WhatsApp &amp; email.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
