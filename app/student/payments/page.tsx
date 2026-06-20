import { getMyStudent, getStudentPayments } from '@/lib/queries';
import { PageHeader, Money } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { PaymentButtons } from '@/components/crm/PaymentButtons';
import { PAYMENT_TYPE_META } from '@/lib/database.types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function StudentPayments() {
  const student = (await getMyStudent()) as any;
  const payments = student ? await getStudentPayments(student.id) : [];
  const fmt = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <PageHeader title="Payments" subtitle="Pay securely and view your history" />

      <div className="mb-8">
        <h3 className="font-display font-bold text-foreground mb-4">Make a Payment</h3>
        <PaymentButtons />
      </div>

      <h3 className="font-display font-bold text-foreground mb-4">Payment History</h3>
      {payments.length === 0 ? (
        <Card className="p-8 text-center text-sm text-foreground/50">No payments yet.</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-foreground/45 border-b border-foreground/10">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 text-foreground/70">{PAYMENT_TYPE_META[p.payment_type].label}</td>
                    <td className="px-4 py-3 font-bold text-foreground"><Money amount={Number(p.amount)} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-600' : p.payment_status === 'failed' ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'}`}>{p.payment_status}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/60">{fmt(p.created_at)}</td>
                    <td className="px-4 py-3 text-foreground/40 text-[11px]">{p.razorpay_payment_id || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
