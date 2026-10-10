import { Ship } from 'lucide-react';
import { Accent, CtaBand, SiteHero } from '@/components/site/kit';
import { TRADE_ENQUIRY, TRADE_SERVICES_PAGE, tradeWhatsAppHref } from '@/components/import-export/TradeContent';
import { TradeAudience } from '@/components/import-export/TradeAudience';
import { TradeCrossLinks } from '@/components/import-export/TradeCrossLinks';
import { TradeDirectionCards } from '@/components/import-export/TradeDirectionCards';
import { TradeHeroRoute } from '@/components/import-export/TradeHeroRoute';
import { tradeMetadata } from '@/components/import-export/TradeMetadata';
import { TradeProcess } from '@/components/import-export/TradeProcess';
import { TradeServiceAreas } from '@/components/import-export/TradeServiceAreas';

export const metadata = tradeMetadata({
  absoluteTitle: 'GlofiHub Import-Export — Global Trade Support',
  description:
    'Connecting businesses with international markets through import and export services. GlofiHub Import-Export is launching soon: send a trade enquiry.',
  path: '/import-export',
});

// GlofiHub Import-Export — home. The business is launching soon, so every section describes generic PLANNED scope
// (no products, prices, shipments, partners, certifications, timelines or guarantees). Navbar and footer come from
// the site layout; `#process` is the target of the navbar's "How it works" link.
export default function ImportExportHomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        id="import-export-home"
        icon={Ship}
        eyebrow="GlofiHub Import-Export"
        badge="Launching soon"
        title={
          <>
            Global trade support for <Accent>growing businesses</Accent>
          </>
        }
        lead="Connecting businesses with international markets through import and export services."
        ctas={[
          { label: 'Send a trade enquiry', href: TRADE_ENQUIRY },
          { label: 'Our services', href: TRADE_SERVICES_PAGE, variant: 'outline' },
        ]}
      >
        <TradeHeroRoute />
        <p className="mt-6 text-xs font-medium leading-relaxed text-foreground/65 md:text-sm">
          Import-Export is launching soon. You can already send us an enquiry.
        </p>
      </SiteHero>

      <TradeDirectionCards />
      <TradeServiceAreas />
      <TradeProcess />
      <TradeAudience />
      <TradeCrossLinks />

      <CtaBand
        title="Have a trade requirement in mind?"
        text="GlofiHub Import-Export is launching soon. Share what you want to import or export and our team will review your enquiry."
        ctas={[
          { label: 'Send a trade enquiry', href: TRADE_ENQUIRY },
          { label: 'Chat on WhatsApp', href: tradeWhatsAppHref(), variant: 'outline', external: true },
        ]}
      />
    </main>
  );
}
