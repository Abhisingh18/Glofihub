import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Bell, MessageCircle, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { DIVISIONS } from '@/lib/divisions';
import { SITE } from '@/lib/site';

// "Launching soon" pages for divisions that don't have their own site section yet.
// Only slugs from lib/divisions.ts with status 'soon' exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return DIVISIONS.filter((d) => d.status === 'soon').map((d) => ({ division: d.slug }));
}

type Props = { params: Promise<{ division: string }> };

const findSoon = (slug: string) => DIVISIONS.find((d) => d.slug === slug && d.status === 'soon');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { division } = await params;
  const d = findSoon(division);
  if (!d) return {};
  return {
    // `absolute` so the root "%s | GlofiHub" template doesn't repeat the brand ("GlofiHub Academy | GlofiHub").
    title: { absolute: `${d.name} — Launching Soon` },
    description: d.description,
    alternates: { canonical: `/${d.slug}` },
    // Placeholder page — keep it out of search until the division has real content.
    robots: { index: false, follow: true },
  };
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const FOCUS_RING_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2F6B]';

export default async function DivisionPage({ params }: Props) {
  const { division } = await params;
  const d = findSoon(division);
  if (!d) notFound();

  const Icon = d.icon;
  const others = DIVISIONS.filter((o) => o.slug !== d.slug);

  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hi GlofiHub! 👋 I'm interested in ${d.name}. Please share more details.`
  )}`;
  const notifyLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hi GlofiHub! 👋 Please let me know when ${d.name} launches — I'd like to be the first to know.`
  )}`;
  // Contact-form prefill (the home page Contact component reads ?requirement= & ?message= and #contact).
  const keepPostedLink = `/?requirement=${d.slug}&message=${encodeURIComponent(`Please keep me posted about ${d.name}`)}#contact`;
  // Blueprint category list — shown as planned scope. Falls back to the card highlights.
  const planned = d.categories && d.categories.length > 0 ? d.categories : d.highlights;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute top-0 left-1/4 w-[40%] h-[45%] bg-primary/10 rounded-full blur-[120px] animate-aurora" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 w-[40%] h-[45%] bg-emerald-500/10 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '3s' }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.2]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,47,107,0.10) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 40%, black, transparent)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-hero-rise">
          {/* Icon with soft glow */}
          <div className="relative mx-auto mb-7 h-20 w-20 animate-float-soft">
            <span aria-hidden className={`absolute inset-0 rounded-3xl opacity-40 blur-xl ${d.iconBg}`} />
            <span className={`relative flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl ring-1 ring-white/20 ${d.iconBg}`}>
              <Icon size={36} className="text-white" aria-hidden />
            </span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-amber-700 dark:text-amber-400 mb-5">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500/70 opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            Launching soon
          </span>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">{d.name}</h1>
          <p className="mt-3 text-sm md:text-base font-semibold text-primary dark:text-accent tracking-wide">{d.tagline}</p>
          <p className="mt-5 text-base md:text-lg text-foreground/65 font-medium leading-relaxed">{d.description}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm tracking-wide shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl transition-all motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
            >
              <MessageCircle size={16} aria-hidden /> Enquire on WhatsApp
            </a>
            <Link
              href="/#businesses"
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card border border-foreground/15 text-foreground font-semibold text-sm hover:border-primary/40 transition-all ${FOCUS_RING}`}
            >
              <ArrowLeft size={16} aria-hidden /> All businesses
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── What's planned ───────────── */}
      <section aria-labelledby="planned-heading" className="relative bg-muted/30 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-12" data-reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
              <Sparkles size={14} className="text-primary dark:text-accent" aria-hidden />
              <span className="text-xs font-semibold text-primary dark:text-accent tracking-wide">Planned scope</span>
            </div>
            <h2 id="planned-heading" className="font-display text-2xl md:text-4xl font-extrabold tracking-tight leading-[1.1]">
              What&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 animate-gradient-text">
                planned
              </span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-foreground/60 leading-relaxed">
              The areas {d.name} is being set up to cover. Details will follow as we get closer to launch.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {planned.map((label, i) => (
              <li key={label} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
                <div className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border border-foreground/10 bg-card px-4 py-4 shadow-md shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <span aria-hidden className={`h-9 w-1 shrink-0 rounded-full opacity-80 transition-opacity group-hover:opacity-100 ${d.iconBg}`} />
                  <div className="min-w-0">
                    <span aria-hidden className="block font-display text-[10px] font-bold tracking-widest text-foreground/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-semibold leading-snug text-foreground">{label}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-xs leading-relaxed text-foreground/50" data-reveal>
            This is our planned scope and may change before launch — none of it is open for booking yet.
          </p>
        </div>
      </section>

      {/* ───────────── Be the first to know ───────────── */}
      <section aria-labelledby="notify-heading" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div
          data-reveal
          className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2F6B] to-blue-700 p-7 sm:p-10 md:p-12 text-white shadow-xl shadow-primary/20 ring-1 ring-white/10"
        >
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl animate-aurora" />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-xl">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Bell size={22} className="text-white" aria-hidden />
              </span>
              <h2 id="notify-heading" className="font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                Be the first to know
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-white/75">
                Share your details and our team will keep you posted as {d.name} gets ready to launch.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
              <Link
                href={keepPostedLink}
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-[#0A2F6B] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING_ON_DARK}`}
              >
                Keep me posted <ArrowRight size={16} aria-hidden />
              </Link>
              <a
                href={notifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-white/10 ${FOCUS_RING_ON_DARK}`}
              >
                <MessageCircle size={16} aria-hidden /> Notify me on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Explore our other businesses ───────────── */}
      {others.length > 0 && (
        <section aria-labelledby="others-heading" className="bg-muted/30 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
              <div>
                <h2 id="others-heading" className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                  Explore our other businesses
                </h2>
                <p className="mt-2 text-sm md:text-base text-foreground/60">One group, many possibilities — see what else GlofiHub offers.</p>
              </div>
              <Link
                href="/#businesses"
                className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full text-sm font-semibold text-primary dark:text-accent hover:underline sm:self-auto ${FOCUS_RING}`}
              >
                View all <ArrowRight size={15} aria-hidden />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o, i) => {
                const OIcon = o.icon;
                const oSoon = o.status === 'soon';
                return (
                  <div key={o.slug} data-reveal data-reveal-d={`${(i % 5) + 1}`} className="flex">
                    <Link
                      href={o.href}
                      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
                    >
                      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity group-hover:opacity-100 ${o.iconBg}`} />
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 ${o.iconBg}`}
                        >
                          <OIcon size={22} className="text-white" aria-hidden />
                        </span>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            oSoon
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {oSoon ? 'Launching soon' : 'Live'}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{o.name}</h3>
                      <p className="mt-1 text-xs font-semibold tracking-wide text-primary dark:text-accent">{o.tagline}</p>
                      <p className="mt-3 text-[13px] leading-relaxed text-foreground/65">{o.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[13px] font-semibold text-primary dark:text-accent">
                        {o.cta}
                        <ArrowRight
                          size={14}
                          aria-hidden
                          className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                        />
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingContact />
    </main>
  );
}
