'use client';

import { CreditCard, Clock } from 'lucide-react';
import { Card } from '@/components/crm/ui';
import { Money } from '@/components/crm/widgets';
import { PAYMENT_TYPE_META, type PaymentType } from '@/lib/database.types';

const ORDER: PaymentType[] = ['registration_fee', 'counselling_fee', 'premium_package'];

/** Payments are not enabled yet (Razorpay to be added later). */
export function PaymentButtons() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {ORDER.map((type) => {
        const meta = PAYMENT_TYPE_META[type];
        return (
          <Card key={type} className="p-5 flex flex-col">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md mb-3">
              <CreditCard size={20} />
            </span>
            <p className="font-display font-bold text-foreground">{meta.label}</p>
            <p className="font-display text-2xl font-extrabold text-foreground mt-1"><Money amount={meta.amount} /></p>
            <button
              disabled
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-muted text-foreground/50 font-semibold text-sm cursor-not-allowed"
            >
              <Clock size={15} /> Coming Soon
            </button>
          </Card>
        );
      })}
      <p className="sm:col-span-3 text-xs text-foreground/50 font-medium text-center">
        Online payments will be enabled shortly. Your counsellor can guide you on fees meanwhile.
      </p>
    </div>
  );
}
