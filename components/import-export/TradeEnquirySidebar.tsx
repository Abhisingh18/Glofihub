import { Mail, MessageCircle, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { TRADE_FOCUS_ON_DARK, tradeWhatsAppHref } from './TradeContent';

// Generic on purpose: no response-time promise, and honest that the business is still launching.
const NEXT_STEPS = [
  {
    title: 'We review your enquiry',
    text: 'Our team reads the details you share about your trade requirement.',
  },
  {
    title: 'We get in touch',
    text: 'We contact you using the method you chose in the form: WhatsApp, phone or email.',
  },
  {
    title: 'We talk it through',
    text: "We'll be upfront about how we can help, and about what is still being set up while Import-Export is launching soon.",
  },
];

const CONTACT_ROW = `flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 motion-reduce:transition-none ${TRADE_FOCUS_ON_DARK}`;

/** Side column of the enquiry page: "What happens next" + direct contact details (from SITE). */
export function TradeEnquirySidebar() {
  const last = NEXT_STEPS.length - 1;
  return (
    // Sticky only on large screens that are also tall enough to show the whole column (otherwise it could be clipped).
    <aside aria-label="About your enquiry" className="space-y-5 lg:top-32 lg:[@media(min-height:800px)]:sticky">
      <section
        aria-labelledby="trade-next-heading"
        data-reveal
        className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 md:p-7"
      >
        <h2 id="trade-next-heading" className="font-display text-xl font-extrabold tracking-tight">
          What happens next
        </h2>
        <ol className="mt-5 space-y-5">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="relative pl-12">
              <span
                aria-hidden
                className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-xs font-bold text-white shadow-md shadow-primary/25"
              >
                {i + 1}
              </span>
              {i < last && (
                <span
                  aria-hidden
                  className="absolute -bottom-5 left-[15px] top-8 w-0.5 rounded-full bg-gradient-to-b from-primary/50 to-accent/25"
                />
              )}
              <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground/65">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="trade-contact-heading"
        data-reveal
        data-reveal-d="2"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-6 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10 md:p-7"
      >
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 animate-aurora rounded-full bg-emerald-400/20 blur-3xl"
        />
        <h2 id="trade-contact-heading" className="relative font-display text-xl font-extrabold tracking-tight">
          Prefer to talk first?
        </h2>
        <p className="relative mt-2 text-sm leading-relaxed text-white/75">You can also reach the GlofiHub team directly.</p>
        <ul className="relative mt-5 space-y-2.5">
          <li>
            <a href={tradeWhatsAppHref()} target="_blank" rel="noopener noreferrer" className={CONTACT_ROW}>
              <MessageCircle size={18} aria-hidden className="shrink-0" /> Chat on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`tel:${SITE.phone}`} className={CONTACT_ROW}>
              <Phone size={18} aria-hidden className="shrink-0" /> {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`} className={CONTACT_ROW}>
              <Mail size={18} aria-hidden className="shrink-0" /> <span className="min-w-0 break-all">{SITE.email}</span>
            </a>
          </li>
        </ul>
      </section>
    </aside>
  );
}
