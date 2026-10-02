'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Phone, X, Headphones } from 'lucide-react';
import { SITE } from '@/lib/site';

/** Contact details come from SITE (lib/site.ts) — never hardcode them here. */
const WHATSAPP_TEXT = 'Hi GlofiHub 👋, I would like to know more about your services.';
const WHATSAPP_HREF = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
const CALL_HREF = `tel:${SITE.phone}`;
const MENU_ID = 'floating-contact-menu';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Official WhatsApp glyph (lucide has no brand icon). */
function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function FloatingContact() {
  // Open by default on larger screens so WhatsApp & Call are always visible; user can collapse.
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // On small screens, start collapsed so the buttons don't cover content.
  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) setOpen(false);
  }, []);

  // Esc collapses the menu when focus is inside it and returns focus to the trigger.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label="Contact GlofiHub"
      onKeyDown={onKeyDown}
      className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col items-start gap-3"
    >
      {/* Speed-dial actions (invisible when collapsed so they leave the tab order) */}
      <div
        id={MENU_ID}
        className={`flex flex-col items-start gap-3 transition-all duration-300 motion-reduce:transition-none ${
          open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-3 invisible pointer-events-none'
        }`}
      >
        {/* WhatsApp */}
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center gap-3 rounded-full cursor-pointer ${FOCUS_RING}`}
          aria-label="Chat on WhatsApp"
        >
          <span className="relative w-[3.25rem] h-[3.25rem] sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/40 ring-4 ring-[#25D366]/15 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform">
            <WhatsAppIcon size={26} />
          </span>
          {/* Label: always shown on phones; on larger screens it only appears on hover/focus (absolutely
              positioned, so it never covers page content or adds an invisible click area). */}
          <span className="px-3.5 py-2 rounded-xl bg-card border border-foreground/10 shadow-lg text-left transition-all duration-200 motion-reduce:transition-none sm:absolute sm:left-full sm:top-1/2 sm:ml-3 sm:-translate-y-1/2 sm:-translate-x-1 sm:whitespace-nowrap sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:group-focus-visible:opacity-100 sm:group-focus-visible:translate-x-0">
            <span className="block text-xs font-bold text-foreground leading-tight">Chat on WhatsApp</span>
            <span className="block text-[11px] font-medium text-foreground/55">Instant reply · 9 AM–9 PM</span>
          </span>
        </a>

        {/* Call */}
        <a
          href={CALL_HREF}
          className={`group relative flex items-center gap-3 rounded-full cursor-pointer ${FOCUS_RING}`}
          aria-label={`Call us on ${SITE.phoneDisplay}`}
        >
          <span className="relative w-[3.25rem] h-[3.25rem] sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/40 ring-4 ring-primary/15 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform">
            <Phone size={24} />
          </span>
          {/* Label: always shown on phones; on larger screens it only appears on hover/focus (absolutely
              positioned, so it never covers page content or adds an invisible click area). */}
          <span className="px-3.5 py-2 rounded-xl bg-card border border-foreground/10 shadow-lg text-left transition-all duration-200 motion-reduce:transition-none sm:absolute sm:left-full sm:top-1/2 sm:ml-3 sm:-translate-y-1/2 sm:-translate-x-1 sm:whitespace-nowrap sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:group-focus-visible:opacity-100 sm:group-focus-visible:translate-x-0">
            <span className="block text-xs font-bold text-foreground leading-tight">Call Us Now</span>
            <span className="block text-[11px] font-medium text-foreground/55">{SITE.phoneDisplay}</span>
          </span>
        </a>
      </div>

      {/* Main trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative w-[3.75rem] h-[3.75rem] sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 transition-transform cursor-pointer ${FOCUS_RING}`}
        aria-label={open ? 'Close contact menu' : 'Open contact menu'}
        aria-expanded={open}
        aria-controls={MENU_ID}
      >
        {/* Single soft pulse ring (only when collapsed) */}
        {!open && (
          <span aria-hidden className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping motion-reduce:animate-none" />
        )}
        <span className="relative transition-transform duration-300 motion-reduce:transition-none" style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
          {open ? <X size={26} /> : <Headphones size={26} />}
        </span>

        {/* Live dot */}
        {!open && (
          <span aria-hidden className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-background flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" />
          </span>
        )}
      </button>
    </div>
  );
}
