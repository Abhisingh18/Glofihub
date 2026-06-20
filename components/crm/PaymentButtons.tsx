'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '@/components/crm/ui';
import { Money } from '@/components/crm/widgets';
import { PAYMENT_TYPE_META, type PaymentType } from '@/lib/database.types';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { Razorpay?: any }
}

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const ORDER: PaymentType[] = ['registration_fee', 'counselling_fee', 'premium_package'];

export function PaymentButtons() {
  const router = useRouter();
  const [busy, setBusy] = useState<PaymentType | null>(null);
  const [error, setError] = useState('');

  const pay = async (type: PaymentType) => {
    setError('');
    setBusy(type);
    try {
      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!ok) throw new Error('Could not load payment gateway.');

      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_type: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment.');

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'GlofiHub',
        description: PAYMENT_TYPE_META[type].label,
        order_id: data.orderId,
        prefill: { name: data.name, email: data.email },
        theme: { color: '#0A2F6B' },
        handler: async (resp: any) => {
          const v = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resp),
          });
          if (v.ok) router.refresh();
          else setError('Payment verification failed. Contact support if charged.');
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  };

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
            <ul className="mt-3 space-y-1.5 text-xs text-foreground/60 flex-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Secure Razorpay checkout</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Instant confirmation</li>
            </ul>
            <Button onClick={() => pay(type)} loading={busy === type} className="mt-4 w-full">
              {busy === type ? 'Processing…' : 'Pay Now'}
            </Button>
          </Card>
        );
      })}
      {error && <p className="sm:col-span-3 text-sm text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function PaymentLoadingNote() {
  return <Loader2 className="animate-spin" />;
}
