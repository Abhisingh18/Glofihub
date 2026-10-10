import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { SITE } from '@/lib/site';
import { SITES, type SiteSlug } from '@/lib/sites';
import { DIVISIONS, PRIMARY_DIVISIONS } from '@/lib/divisions';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

const SOCIAL = [
  { label: 'Facebook', href: SITE.social.facebook, icon: Facebook },
  { label: 'Instagram', href: SITE.social.instagram, icon: Instagram },
  { label: 'YouTube', href: SITE.social.youtube, icon: Youtube },
  { label: 'LinkedIn', href: SITE.social.linkedin, icon: Linkedin },
];

const linkClass = `inline-flex rounded text-sm font-medium text-white/70 hover:text-white transition-colors ${FOCUS}`;

/** Footer shared by the five GlofiHub business websites (content comes from lib/sites.ts). */
export function SiteFooter({ slug }: { slug: SiteSlug }) {
  const cfg = SITES[slug];
  const division = DIVISIONS.find((d) => d.slug === slug);
  const Icon = division?.icon;
  const others = PRIMARY_DIVISIONS.filter((d) => d.slug !== slug);

  return (
    <footer className="bg-gradient-to-br from-[#0A2F6B] via-[#0A2F6B] to-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href={cfg.home} className={`inline-flex items-center gap-3 rounded-xl ${FOCUS}`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                {Icon ? <Icon size={22} aria-hidden /> : null}
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                GlofiHub <span className="font-medium text-white/70">{cfg.subtitle}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-white/65">{cfg.blurb}</p>
            <div className="mt-5 flex gap-3">
              {SOCIAL.map(({ label, href, icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GlofiHub on ${label}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#0A2F6B] ${FOCUS}`}
                >
                  <SocialIcon size={17} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* This site */}
          <nav aria-label={`${cfg.subtitle} links`} className="lg:col-span-2">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide">{cfg.subtitle}</h3>
            <ul className="space-y-3">
              {cfg.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {cfg.footerExtra && (
              <>
                <h3 className="mb-4 mt-8 font-display text-sm font-bold tracking-wide">{cfg.footerExtra.title}</h3>
                <ul className="space-y-3">
                  {cfg.footerExtra.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>

          {/* Rest of the group */}
          <nav aria-label="More from GlofiHub" className="lg:col-span-2">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide">More from GlofiHub</h3>
            <ul className="space-y-3">
              {others.map((d) => (
                <li key={d.slug}>
                  <Link href={d.href} className={linkClass}>
                    {d.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className={linkClass}>
                  GlofiHub group
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  About us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide">Office &amp; Contact</h3>
            <address className="space-y-4 not-italic">
              <p className="flex items-start gap-3 text-sm font-medium leading-relaxed text-white/70">
                <MapPin size={17} aria-hidden className="mt-0.5 shrink-0 text-emerald-300" />
                Dwarkapuri Road No. 2, Hanuman Nagar, Kankarbagh, Patna, Bihar – 800020
              </p>
              <a href={`tel:${SITE.phone}`} className={`flex items-center gap-3 rounded text-sm font-medium text-white/70 hover:text-white ${FOCUS}`}>
                <Phone size={17} aria-hidden className="shrink-0 text-emerald-300" /> {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className={`flex items-center gap-3 rounded text-sm font-medium text-white/70 hover:text-white ${FOCUS}`}>
                <Mail size={17} aria-hidden className="shrink-0 text-emerald-300" /> {SITE.email}
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs font-medium text-white/55 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All Rights Reserved.
          </p>
          <p>
            Part of the{' '}
            <Link href="/" className={`rounded underline-offset-2 hover:text-white hover:underline ${FOCUS}`}>
              GlofiHub ecosystem
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
