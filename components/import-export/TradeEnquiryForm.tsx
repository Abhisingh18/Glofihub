'use client';

import { LeadForm, type ExtraField } from '@/components/site/LeadForm';

// Business-specific questions. LeadForm appends the answers to the lead's message as "Label: value" lines,
// so they show up in the admin Leads inbox. (Names must not clash with LeadForm's core fields.)
const EXTRA_FIELDS: ExtraField[] = [
  { name: 'direction', label: 'Import or export', type: 'select', options: ['Import', 'Export', 'Both'], required: true },
  { name: 'products', label: 'Product(s)', type: 'text', required: true, placeholder: 'What would you like to import or export?' },
  { name: 'quantity', label: 'Approx. quantity', type: 'text', placeholder: 'An estimate is fine' },
  { name: 'route', label: 'Origin / destination country', type: 'text', placeholder: 'Where from, and where to' },
  { name: 'company', label: 'Company name', type: 'text' },
  { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'When do you need this?' },
];

/** Trade enquiry form for /import-export/enquiry: the shared LeadForm, saved to the CRM as "Import-Export". */
export function TradeEnquiryForm() {
  return (
    <LeadForm
      id="trade-enquiry-form"
      requirement="Import-Export"
      source="import-export-enquiry"
      title="Tell us about your trade requirement"
      extraFields={EXTRA_FIELDS}
      messageLabel="Additional details"
      successText="Thank you — we have received your trade enquiry."
      whatsappText="Hi GlofiHub! I have an import-export enquiry."
    />
  );
}
