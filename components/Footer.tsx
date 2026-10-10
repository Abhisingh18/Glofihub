import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { DIVISIONS } from '@/lib/divisions';
import { SITE } from '@/lib/site';

// Company links that have real destinations.
const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Our Team', href: '/about#team' },
  { label: 'Contact', href: '/#contact' },
];

// No pages exist yet for these, so they render as plain muted text (never dead links).
const companyPending = ['Careers', 'Blog'];

// Legal pages do not exist yet — plain muted text only, no links.
const legalPending = ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Disclaimer', 'Cookie Policy'];

const socials = [
  { name: 'Facebook', href: SITE.social.facebook, Icon: Facebook },
  { name: 'Instagram', href: SITE.social.instagram, Icon: Instagram },
  { name: 'YouTube', href: SITE.social.youtube, Icon: Youtube },
  { name: 'LinkedIn', href: SITE.social.linkedin, Icon: Linkedin },
];

// The footer keeps a fixed dark-blue surface in both themes (the `--primary`
// token turns bright blue in dark mode, which would break text contrast here).
const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

const linkClass = `group inline-flex items-center gap-2 rounded-md text-sm font-medium text-white/70 hover:text-white transition-colors ${ring}`;
const dot =
  'w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400/60 group-hover:bg-emerald-400 transition-colors';
// Plain (non-link) items: muted, not interactive.
const pendingClass =
  'inline-flex items-center gap-2 text-sm font-medium text-white/55 cursor-default select-none';
const pendingDot = 'w-1.5 h-1.5 shrink-0 rounded-full bg-white/20';
const headingClass = 'font-display text-sm font-bold text-white mb-5 tracking-wide';
const iconTile =
  'w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 shrink-0';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 text-white pt-16 md:pt-20">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-blue-500/15 blur-[120px] animate-aurora" />
        <div
          className="absolute -bottom-40 -right-24 w-[420px] h-[420px] rounded-full bg-emerald-400/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-14">
        <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-5">
            <Link
              href="/"
              aria-label={`${SITE.name} home`}
              className={`inline-flex items-center gap-3 rounded-2xl ${ring}`}
            >
              <span className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-lg shrink-0">
                <img
                  src="/logo/logo.png"
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight">{SITE.name}</span>
            </Link>
            <p className="text-sm font-semibold tracking-wide text-emerald-300">{SITE.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed font-medium max-w-sm">
              Connecting learners, professionals, institutions and businesses with the education, skills,
              services and opportunities they need to move forward.
            </p>
            <ul className="flex flex-wrap gap-3 pt-1" aria-label="Social media">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${name}`}
                    className={`w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#0A2F6B] hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 ${ring}`}
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-explore" className="lg:col-span-2">
            <h3 id="footer-explore" className={headingClass}>
              Explore
            </h3>
            <ul className="space-y-3">
              {DIVISIONS.map((d) => (
                <li key={d.slug}>
                  <Link href={d.href} className={linkClass}>
                    <span className={dot} aria-hidden="true" />
                    <span>{d.short}</span>
                    {d.status === 'soon' && (
                      <span className="rounded-full border border-amber-300/30 bg-amber-300/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-amber-200">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company" className="lg:col-span-2">
            <h3 id="footer-company" className={headingClass}>
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    <span className={dot} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
              {companyPending.map((label) => (
                <li key={label}>
                  <span aria-disabled="true" className={pendingClass}>
                    <span className={pendingDot} aria-hidden="true" />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 id="footer-legal" className={headingClass}>
              Legal
            </h3>
            <ul aria-labelledby="footer-legal" className="space-y-3">
              {legalPending.map((label) => (
                <li key={label}>
                  <span aria-disabled="true" className={pendingClass}>
                    <span className={pendingDot} aria-hidden="true" />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Office & Contact */}
          <div className="lg:col-span-3">
            <h3 className={headingClass}>Office &amp; Contact</h3>
            <address className="space-y-4 not-italic">
              <div className="flex gap-3 items-start">
                <span className={iconTile}>
                  <MapPin size={17} aria-hidden="true" />
                </span>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Dwarkapuri Road No. 2, Hanuman Nagar, Kankarbagh, Patna, Bihar – 800020
                </p>
              </div>
              <a
                href={`tel:${SITE.phone}`}
                className={`flex items-center gap-3 rounded-xl text-sm text-white/70 font-medium hover:text-white transition-colors ${ring}`}
              >
                <span className={iconTile}>
                  <Phone size={16} aria-hidden="true" />
                </span>
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className={`flex items-center gap-3 rounded-xl text-sm text-white/70 font-medium hover:text-white transition-colors ${ring}`}
              >
                <span className={iconTile}>
                  <Mail size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 break-words">{SITE.email}</span>
              </a>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-4 text-center lg:text-left">
          <p className="text-xs font-medium text-white/60 leading-relaxed">
            © {new Date().getFullYear()} {SITE.legalName}. All Rights Reserved.
            <span aria-hidden="true" className="hidden sm:inline mx-2 text-white/30">
              |
            </span>
            <span className="block sm:inline">Powered by {SITE.legalName}</span>
          </p>
          <p className="text-[11px] font-medium text-white/60">
            Technology partner:{' '}
            <a
              href="https://www.pragyaanlabs.space/"
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-sm text-white/70 underline decoration-white/25 underline-offset-2 hover:text-white hover:decoration-white/60 transition-colors ${ring}`}
            >
              Pragyaan Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
