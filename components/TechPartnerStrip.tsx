import { ArrowUpRight, Sparkles } from 'lucide-react';

/** "Tech partner" ribbon + card crediting Pragyaan Labs, with logo & contact CTA. */
export function TechPartnerStrip() {
  return (
    <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-950 text-white shadow-xl shadow-primary/20">
          {/* Ambient glows */}
          <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-violet-500/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Corner ribbon */}
          <div aria-hidden className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
            <span className="absolute top-[22px] right-[-34px] rotate-45 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold tracking-wider py-1 w-40 text-center shadow-md">
              TECH PARTNER
            </span>
          </div>

          <div className="relative p-6 md:p-9 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Logo card */}
            <div className="shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3 ring-1 ring-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pragyaan-mark-violet.png"
                  alt="Pragyaan Labs"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Copy */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wide mb-3">
                <Sparkles size={12} className="text-violet-200" /> Built &amp; Managed By
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                Pragyaan Labs
              </h3>
              <p className="mt-2 text-sm md:text-base text-white/75 font-medium max-w-xl">
                The entire technology of GlofiHub — website, CRM, database &amp; more — is
                designed and maintained by Pragyaan Labs. Need any technical work done for
                your business? Let&apos;s build it together.
              </p>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <a
                href="https://www.pragyaanlabs.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-primary font-semibold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                Contact Us
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <p className="mt-2 text-[11px] text-white/55 font-medium">pragyaanlabs.space</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
