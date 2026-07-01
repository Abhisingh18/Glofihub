import { Code2, ArrowUpRight } from 'lucide-react';

/** Slim strip crediting the tech partner (Pragyaan Labs) with a contact CTA. */
export function TechPartnerStrip() {
  return (
    <a
      href="https://www.pragyaanlabs.space/"
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden bg-gradient-to-r from-primary via-primary to-blue-950 text-white"
      aria-label="Pragyaan Labs — technical partner"
    >
      <span aria-hidden className="pointer-events-none absolute -top-8 -right-6 w-40 h-40 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="w-7 h-7 rounded-lg bg-white/15 ring-1 ring-white/20 flex items-center justify-center shrink-0">
            <Code2 size={15} />
          </span>
          Entire tech built &amp; managed by{' '}
          <span className="font-display font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Pragyaan Labs
          </span>
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 group-hover:text-white transition-colors">
          Need any technical work done? Contact us
          <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}
