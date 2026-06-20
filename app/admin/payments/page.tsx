import { createClient } from '@/lib/supabase/server';
import { PageHeader, StatCard, Money, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { PAYMENT_TYPE_META } from '@/lib/database.types';
import { IndianRupee, CalendarClock, Clock, CreditCard } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminPayments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments')
    .select(`*, student:students!payments_student_id_fkey ( user:users!students_user_id_fkey ( full_name, email ) )`)
    .order('created_at', { ascending: false });
  const payments = (data as any[]) ?? [];

  const paid = payments.filter((p) => p.payment_status === 'paid');
  const now = new Date();
  const todayRev = paid.filter((p) => new Date(p.created_at).toDateString() === now.toDateString())
    .reduce((n, p) => n + Number(p.amount), 0);
  const monthRev = paid.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((n, p) => n + Number(p.amount), 0);
  const pending = payments.filter((p) => p.payment_status === 'created').reduce((n, p) => n + Number(p.amount), 0);

  const fmt = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <PageHeader title="Payments" subtitle="Revenue & transactions" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Today's Revenue" value={<Money amount={todayRev} />} icon={IndianRupee} accent="from-emerald-500 to-green-600" />
        <StatCard label="This Month" value={<Money amount={monthRev} />} icon={CalendarClock} accent="from-primary to-blue-600" />
        <StatCard label="Pending" value={<Money amount={pending} />} icon={Clock} accent="from-rose-500 to-red-600" />
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" hint="Transactions will appear here." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-foreground/45 border-b border-foreground/10">
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{p.student?.user?.full_name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{PAYMENT_TYPE_META[p.payment_type as keyof typeof PAYMENT_TYPE_META].label}</td>
                    <td className="px-4 py-3 font-bold text-foreground"><Money amount={Number(p.amount)} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-600' : p.payment_status === 'failed' ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'}`}>{p.payment_status}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/60">{fmt(p.created_at)}</td>
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
