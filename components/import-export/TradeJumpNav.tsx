import Link from 'next/link';
import { TRADE_FOCUS, TRADE_SERVICES } from './TradeContent';

/** Pill links to the four anchored service sections (rendered inside the services-page hero). */
export function TradeJumpNav() {
  return (
    <nav aria-label="Jump to a service" className="mt-9">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {TRADE_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.id}>
              <Link
                href={`#${service.id}`}
                className={`inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-4 py-2 text-[13px] font-semibold text-foreground/75 shadow-sm transition-colors hover:border-primary/40 hover:text-foreground motion-reduce:transition-none ${TRADE_FOCUS}`}
              >
                <span aria-hidden className={`flex h-6 w-6 items-center justify-center rounded-full ${service.soft}`}>
                  <Icon size={13} />
                </span>
                {service.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
