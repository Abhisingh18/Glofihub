import { requireRole } from '@/lib/auth';
import { sql, one } from '@/lib/pg';
import { getStudents } from '@/lib/queries';
import { PageHeader, StatCard, Money, StatusBadge, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import Link from 'next/link';
import { Users, Flame, MessageCircle, IndianRupee } from 'lucide-react';

const ACTIVE = ['contacted', 'interested', 'follow_up', 'active'];

export default async function CounsellorDashboard() {
  const me = await requireRole('counsellor');
  const students = await getStudents(); // scoped → only assigned

  const msgRow = await one<{ count: string }>(
    `select count(*)::int as count from messages where sender_id = $1`, [me.id]
  );
  const msgCount = Number(msgRow?.count ?? 0);

  const studentIds = students.map((s) => s.id);
  let revenue = 0;
  if (studentIds.length) {
    const pays = await sql<{ amount: string }>(
      `select amount from payments where payment_status = 'paid' and student_id = any($1::uuid[])`,
      [studentIds]
    );
    revenue = pays.reduce((n, p) => n + Number(p.amount), 0);
  }
  const active = students.filter((s) => ACTIVE.includes(s.status)).length;

  return (
    <>
      <PageHeader title={`Welcome, ${me.full_name.split(' ')[0] || 'Counsellor'}`} subtitle="Your students at a glance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Assigned Students" value={students.length} icon={Users} accent="from-primary to-blue-600" />
        <StatCard label="Active Students" value={active} icon={Flame} accent="from-amber-500 to-orange-600" />
        <StatCard label="Messages Sent" value={msgCount ?? 0} icon={MessageCircle} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Revenue Generated" value={<Money amount={revenue} />} icon={IndianRupee} accent="from-emerald-500 to-green-600" />
      </div>

      <Card className="p-5">
        <h3 className="font-display font-bold text-foreground mb-4">My Students</h3>
        {students.length === 0 ? (
          <EmptyState icon={Users} title="No students assigned yet" hint="The admin will assign students to you." />
        ) : (
          <div className="space-y-2">
            {students.slice(0, 8).map((s) => (
              <Link key={s.id} href={`/counsellor/students/${s.id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                    {s.full_name[0]?.toUpperCase() ?? '?'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{s.full_name}</p>
                    <p className="text-[11px] text-foreground/50 truncate">{s.country_interest || '—'}</p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
