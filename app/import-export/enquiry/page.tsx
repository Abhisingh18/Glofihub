import { Send } from 'lucide-react';
import { Accent, SiteHero } from '@/components/site/kit';
import { TradeEnquiryForm } from '@/components/import-export/TradeEnquiryForm';
import { TradeEnquirySidebar } from '@/components/import-export/TradeEnquirySidebar';
import { tradeMetadata } from '@/components/import-export/TradeMetadata';

export const metadata = tradeMetadata({
  title: 'Trade enquiry',
  description:
    'Send a trade enquiry to GlofiHub Import-Export: tell us what you want to import or export and how you would like us to contact you.',
  path: '/import-export/enquiry',
});

// GlofiHub Import-Export — enquiry. The form saves to the CRM as requirement "Import-Export"
// (source "import-export-enquiry"); the side column explains what happens next and shows direct contact details.
export default function ImportExportEnquiryPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHero
        icon={Send}
        eyebrow="GlofiHub Import-Export"
        badge="Launching soon"
        title={
          <>
            Trade <Accent>enquiry</Accent>
          </>
        }
        lead="Tell us what you want to import or export. We will review your enquiry and get in touch using the contact method you prefer."
      />

      {/* Pulled up slightly so the form is visible sooner under the hero. */}
      <section aria-label="Trade enquiry form" className="relative -mt-6 px-4 pb-20 sm:px-6 md:-mt-12 md:pb-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <TradeEnquiryForm />
          </div>
          <div className="lg:col-span-5">
            <TradeEnquirySidebar />
          </div>
        </div>
      </section>
    </main>
  );
}
