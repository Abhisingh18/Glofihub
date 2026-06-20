import { createClient } from '@/lib/supabase/server';
import { PageHeader, StatCard, Money } from '@/components/crm/widgets';
import { AdminCharts } from '@/components/crm/AdminCharts';
import { Users, UserCog, Flame, BadgeCheck, IndianRupee, Clock } from 'lucide-react';
import type { Payment, Student } from '@/lib/database.types';

const ACTIVE_LEAD = ['new_lead', 'contacted', 'interested', 'follow_up', 'active'];

function monthKey(d: string) {
  const dt = new Date(d);
  return dt.toLocaleString('en-US', { month: 'short' }) + ' ' + dt.getFullYear();
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: students }, { count: counsellorCount }, { data: payments }] = await Promise.all([
    supabase.from('students').select('id, status, created_at'),
    supabase.from('counsellors').select('id', { count: 'exact', head: true }),
    supabase.from('payments').select('amount, payment_status, created_at'),
  ]);

  const studs = (students as Pick<Student, 'id' | 'status' | 'created_at'>[]) ?? [];
  const pays = (payments as Pick<Payment, 'amount' | 'payment_status' | 'created_at'>[]) ?? [];

  const totalStudents = studs.length;
  const activeLeads = studs.filter((s) => ACTIVE_LEAD.includes(s.status)).length;
  const paidStudents = studs.filter((s) => s.status === 'paid' || s.status === 'converted' || s.status === 'active').length;
  const revenue = pays.filter((p) => p.payment_status === 'paid').reduce((n, p) => n + Number(p.amount), 0);
  const pending = pays.filter((p) => p.payment_status === 'created').reduce((n, p) => n + Number(p.amount), 0);

  // Monthly aggregations (last 6 months order preserved by insertion)
  const leadsByMonth = new Map<string, number>();
  studs.forEach((s) => leadsByMonth.set(monthKey(s.created_at), (leadsByMonth.get(monthKey(s.created_at)) ?? 0) + 1));
  const revByMonth = new Map<string, number>();
  pays.filter((p) => p.payment_status === 'paid').forEach((p) =>
    revByMonth.set(monthKey(p.created_at), (revByMonth.get(monthKey(p.created_at)) ?? 0) + Number(p.amount))
  );

  const leadsData = [...leadsByMonth.entries()].slice(-6).map(([month, leads]) => ({ month, leads }));
  const revenueData = [...revByMonth.entries()].slice(-6).map(([month, revenue]) => ({ month, revenue }));

  // Counsellor performance (assigned students per counsellor)
  const { data: perfRows } = await supabase
    .from('counsellors')
    .select('id, user:users!counsellors_user_id_fkey(full_name), students:students(count)');
  const perfData = ((perfRows as unknown as { user: { full_name: string }; students: { count: number }[] }[]) ?? []).map((c) => ({
    name: c.user?.full_name?.split(' ')[0] ?? '—',
    students: c.students?.[0]?.count ?? 0,
  }));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your counselling pipeline" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Students" value={totalStudents} icon={Users} accent="from-primary to-blue-600" />
        <StatCard label="Counsellors" value={counsellorCount ?? 0} icon={UserCog} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Active Leads" value={activeLeads} icon={Flame} accent="from-amber-500 to-orange-600" />
        <StatCard label="Paid Students" value={paidStudents} icon={BadgeCheck} accent="from-emerald-500 to-green-600" />
        <StatCard label="Total Revenue" value={<Money amount={revenue} />} icon={IndianRupee} accent="from-teal-500 to-emerald-600" />
        <StatCard label="Pending" value={<Money amount={pending} />} icon={Clock} accent="from-rose-500 to-red-600" />
      </div>

      <AdminCharts leadsData={leadsData} revenueData={revenueData} perfData={perfData} />
    </>
  );
}
