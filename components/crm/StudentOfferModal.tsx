'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WHATSAPP_NUMBER = '919241168875';

interface Plan { minutes: number; price: number; label: string; badge?: string; highlight?: boolean }
const PLANS: Plan[] = [
  { minutes: 11, price: 1, label: 'Intro call', badge: 'Just ₹1', highlight: true },
  { minutes: 30, price: 499, label: 'Standard' },
  { minutes: 60, price: 899, label: 'Extended' },
];

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function StudentOfferModal({ studentName }: { studentName: string }) {
  const [open, setOpen] = useState(false);

  // Show once per browser session on the dashboard.
  useEffect(() => {
    const seen = sessionStorage.getItem('glofihub_offer_seen');
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem('glofihub_offer_seen', '1');
    setOpen(false);
  };

  const waLink = (p: Plan) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi GlofiHub! 👋 I'm ${studentName || 'a student'}. I want to talk to a *Russia counsellor*. ` +
      `I'd like the ${p.minutes}-minute plan for ₹${p.price}. Please share the payment details.`
    )}`;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-blue-950 text-white p-6 overflow-hidden">
          <span aria-hidden className="pointer-events-none absolute -top-10 -right-6 w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl" />
          <button onClick={close} className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-semibold mb-3">
            <Sparkles size={12} /> Limited Offer
          </span>
          <h3 className="font-display text-2xl font-extrabold leading-tight">
            Talk to a Russia Counsellor 🇷🇺
          </h3>
          <p className="text-white/75 text-sm font-medium mt-1.5">
            Get expert guidance on MBBS & studying in Russia — directly on call.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-4 text-sm text-foreground/70">
            <Clock size={16} className="text-emerald-600 shrink-0" />
            Your call starts <b className="text-foreground">within 30 minutes</b> of payment.
          </div>

          {/* Plans */}
          <div className="space-y-2.5">
            {PLANS.map((p) => (
              <a
                key={p.minutes}
                href={waLink(p)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={
                  'group flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 ' +
                  (p.highlight
                    ? 'border-emerald-500/40 bg-emerald-500/[0.06] shadow-sm'
                    : 'border-foreground/10 bg-muted/30 hover:border-primary/30')
                }
              >
                <div>
                  <p className="font-display font-bold text-foreground flex items-center gap-2">
                    {p.minutes} minutes
                    {p.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">{p.badge}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-foreground/50 font-medium">{p.label} · 1-on-1 Russia counsellor</p>
                </div>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="font-display text-lg font-extrabold text-foreground">₹{p.price}</span>
                  <span className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WhatsAppIcon size={18} />
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-foreground/45 font-medium">
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-600" /> Pay via WhatsApp</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600" /> Admin connects you</span>
          </div>

          <button
            onClick={close}
            className="w-full mt-3 py-2 text-xs font-medium text-foreground/45 hover:text-foreground transition cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
