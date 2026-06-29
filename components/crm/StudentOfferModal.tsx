'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WHATSAPP_NUMBER = '919241168875';
const PRICE = 499;

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

  const waText =
    `Hi GlofiHub! 👋 I'm ${studentName || 'a student'}. ` +
    `I want to talk to a *Russia counsellor*. I'm ready to recharge ₹${PRICE} for a 30-minute call. ` +
    `Please share the payment details.`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

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
          <div className="flex items-end gap-2 mb-4">
            <span className="font-display text-4xl font-extrabold text-foreground">₹{PRICE}</span>
            <span className="text-foreground/55 font-medium mb-1">/ recharge</span>
          </div>

          <ul className="space-y-2.5 mb-5">
            <li className="flex items-center gap-2.5 text-sm text-foreground/75">
              <Clock size={16} className="text-emerald-600 shrink-0" />
              Your call starts <b className="text-foreground">within 30 minutes</b>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-foreground/75">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              1-on-1 with a dedicated Russia counsellor
            </li>
            <li className="flex items-center gap-2.5 text-sm text-foreground/75">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              Pay safely via WhatsApp with our team
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg shadow-[#25D366]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            <WhatsAppIcon size={20} /> Recharge ₹{PRICE} on WhatsApp
          </a>

          <p className="text-center text-[11px] text-foreground/45 font-medium mt-3 leading-relaxed">
            After payment, our admin will connect you to the right counsellor.
            You&apos;ll then be able to chat right here in the app.
          </p>

          <button
            onClick={close}
            className="w-full mt-2 py-2 text-xs font-medium text-foreground/45 hover:text-foreground transition cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
