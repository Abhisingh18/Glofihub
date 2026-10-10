import { Ship } from 'lucide-react';
import { Accent, CtaBand, SiteHero } from '@/components/site/kit';
import { TRADE_ENQUIRY, TRADE_HOME, TRADE_SERVICES, tradeWhatsAppHref } from '@/components/import-export/TradeContent';
import { TradeChecklist } from '@/components/import-export/TradeChecklist';
import { TradeJumpNav } from '@/components/import-export/TradeJumpNav';
import { tradeMetadata } from '@/components/import-export/TradeMetadata';
import { TradeServiceSection } from '@/components/import-export/TradeServiceSection';

export const metadata = tradeMetadata({
  title: 'Services',
  description:
    'Import, export, trade documentation and logistics support: the planned scope of GlofiHub Import-Export, which is launching soon.',
  path: '/import-export/services',
});

// GlofiHub Import-Export — services. Four anchored sections (#import, #export, #documentation, #logistics) with generic
// planned scope, plus a "Before you enquire" checklist. The home-page cards link here with those anchors.
export default function ImportExportServicesPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={Ship}
        eyebrow="GlofiHub Import-Export"
        badge="Launching soon"
        title={<Accent>Services</Accent>}
        lead="Import, export, trade documentation and logistics support: the planned scope of GlofiHub Import-Export, which may change as we launch."
        ctas={[
          { label: 'Send a trade enquiry', href: TRADE_ENQUIRY },
          { label: 'How it works', href: `${TRADE_HOME}#process`, variant: 'outline' },
        ]}
      >
        <TradeJumpNav />
      </SiteHero>

      {TRADE_SERVICES.map((service, i) => (
        <TradeServiceSection
          key={service.id}
          service={service}
          index={i}
          total={TRADE_SERVICES.length}
          tone={i % 2 === 0 ? 'muted' : 'plain'}
        />
      ))}

      <TradeChecklist />

      <CtaBand
        title="Ready to share your requirement?"
        text="Tell us what you want to import or export and we will review your enquiry."
        ctas={[
          { label: 'Send a trade enquiry', href: TRADE_ENQUIRY },
          { label: 'Chat on WhatsApp', href: tradeWhatsAppHref(), variant: 'outline', external: true },
        ]}
      />
    </main>
  );
}
