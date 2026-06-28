import { sql, one } from '@/lib/pg';
import { PageHeader, StatCard, Money } from '@/components/crm/widgets';
import { AdminCharts } from '@/components/crm/AdminCharts';
import { Users, UserCog, Flame, BadgeCheck, IndianRupee, Clock } from 'lucide-react';

const ACTIVE_LEAD = ['new_lead', 'contacted', 'interested', 'follow_up', 'active'];

function monthKey(d: string) {
  const dt = new Date(d);
  return dt.toLocaleString('en-US', { month: 'short' }) + ' ' + dt.getFullYear();
}

export default async function AdminDashboard() {
  const [students, payments, counsellorCount, perf] = await Promise.all([
    sql<{ status: string; created_at: string }>(`select status, created_at from students`),
    sql<{ amount: string; payment_status: string; created_at: string }>(`select amount, payment_status, created_at from payments`),
    one<{ count: string }>(`select count(*)::int as count from counsellors`),
    sql<{ name: string; students: number }>(
      `select split_part(u.full_name, ' ', 1) as name,
              (select count(*)::int from students s where s.assigned_counsellor_id = c.id) as students
       from counsellors c join users u on u.id = c.user_id order by students desc limit 8`
    ),
  ]);

  const totalStudents = students.length;
  const activeLeads = students.filter((s) => ACTIVE_LEAD.includes(s.status)).length;
  const paidStudents = students.filter((s) => ['paid', 'converted', 'active'].includes(s.status)).length;
  const revenue = payments.filter((p) => p.payment_status === 'paid').reduce((n, p) => n + Number(p.amount), 0);
  const pending = payments.filter((p) => p.payment_status === 'created').reduce((n, p) => n + Number(p.amount), 0);

  const leadsByMonth = new Map<string, number>();
  students.forEach((s) => leadsByMonth.set(monthKey(s.created_at), (leadsByMonth.get(monthKey(s.created_at)) ?? 0) + 1));
  const revByMonth = new Map<string, number>();
  payments.filter((p) => p.payment_status === 'paid').forEach((p) =>
    revByMonth.set(monthKey(p.created_at), (revByMonth.get(monthKey(p.created_at)) ?? 0) + Number(p.amount))
  );

  const leadsData = [...leadsByMonth.entries()].slice(-6).map(([month, leads]) => ({ month, leads }));
  const revenueData = [...revByMonth.entries()].slice(-6).map(([month, revenue]) => ({ month, revenue }));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your counselling pipeline" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Students" value={totalStudents} icon={Users} accent="from-primary to-blue-600" />
        <StatCard label="Counsellors" value={Number(counsellorCount?.count ?? 0)} icon={UserCog} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Active Leads" value={activeLeads} icon={Flame} accent="from-amber-500 to-orange-600" />
        <StatCard label="Paid Students" value={paidStudents} icon={BadgeCheck} accent="from-emerald-500 to-green-600" />
        <StatCard label="Total Revenue" value={<Money amount={revenue} />} icon={IndianRupee} accent="from-teal-500 to-emerald-600" />
        <StatCard label="Pending" value={<Money amount={pending} />} icon={Clock} accent="from-rose-500 to-red-600" />
      </div>

      <AdminCharts leadsData={leadsData} revenueData={revenueData} perfData={perf} />
    </>
  );
}
