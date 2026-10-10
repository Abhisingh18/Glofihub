import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Activity, Calendar, Clock, IndianRupee, Mail, MessageCircle, Phone, StickyNote, Users } from 'lucide-react';
import { one, sql } from '@/lib/pg';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { ResetPasswordControl } from '@/components/crm/ResetPasswordControl';
import type { ActivityLog, StudentStatus } from '@/lib/database.types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const fmt = (ts: string) =>
  new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Staff member detail (admin only): profile, workload and a full activity trail. */
export default async function AdminStaffDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const staff = await one<{
    id: string; user_id: string; department: string | null; active: boolean; created_at: string;
    full_name: string; email: string; phone: string | null;
  }>(
    `select c.id, c.user_id, c.department, c.active, c.created_at, u.full_name, u.email, u.phone
     from counsellors c join users u on u.id = c.user_id
     where c.id = $1`,
    [id]
  );
  if (!staff) notFound();

  const [students, msgRow, noteRow, revRow, lastLogin, logs, notes] = await Promise.all([
    sql<{ id: string; status: StudentStatus; country_interest: string | null; city: string | null; full_name: string; email: string }>(
      `select s.id, s.status, s.country_interest, s.city, u.full_name, u.email
       from students s join users u on u.id = s.user_id
       where s.assigned_counsellor_id = $1 order by s.created_at desc`,
      [staff.id]
    ),
    one<{ count: number }>(`select count(*)::int as count from messages where sender_id = $1`, [staff.user_id]),
    one<{ count: number }>(`select count(*)::int as count from notes where counsellor_id = $1`, [staff.id]),
    one<{ total: string }>(
      `select coalesce(sum(p.amount), 0)::text as total
       from payments p join students s on s.id = p.student_id
       where s.assigned_counsellor_id = $1 and p.payment_status = 'paid'`,
      [staff.id]
    ),
    one<{ at: string | null }>(
      `select max(created_at) as at from activity_logs where user_id = $1 and activity = 'Signed in'`,
      [staff.user_id]
    ),
    sql<ActivityLog>(`select * from activity_logs where user_id = $1 order by created_at desc limit 50`, [staff.user_id]),
    sql<{ id: string; note: string; created_at: string; student_name: string }>(
      `select n.id, n.note, n.created_at, u.full_name as student_name
       from notes n join students s on s.id = n.student_id join users u on u.id = s.user_id
       where n.counsellor_id = $1 order by n.created_at desc limit 10`,
      [staff.id]
    ),
  ]);

  return (
    <>
      <PageHeader
        title={staff.full_name}
        subtitle={staff.department || 'Staff member'}
        action={
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${staff.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-foreground/10 text-foreground/50'}`}>
            {staff.active ? 'Active' : 'Inactive'}
          </span>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned Students" value={students.length} icon={Users} accent="from-primary to-blue-600" />
        <StatCard label="Messages Sent" value={msgRow?.count ?? 0} icon={MessageCircle} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Notes Written" value={noteRow?.count ?? 0} icon={StickyNote} accent="from-amber-500 to-orange-600" />
        <StatCard label="Revenue (assigned)" value={<Money amount={Number(revRow?.total ?? 0)} />} icon={IndianRupee} accent="from-emerald-500 to-green-600" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-bold text-foreground">Profile</h3>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2.5 text-foreground/75"><Mail size={16} className="text-foreground/40" aria-hidden /> {staff.email}</p>
            <p className="flex items-center gap-2.5 text-foreground/75"><Phone size={16} className="text-foreground/40" aria-hidden /> {staff.phone || '—'}</p>
            <p className="flex items-center gap-2.5 text-foreground/75"><Calendar size={16} className="text-foreground/40" aria-hidden /> Joined {new Date(staff.created_at).toLocaleDateString()}</p>
            <p className="flex items-center gap-2.5 text-foreground/75"><Clock size={16} className="text-foreground/40" aria-hidden /> Last sign-in {lastLogin?.at ? fmt(lastLogin.at) : 'never'}</p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-foreground">Manage</h3>
          <ResetPasswordControl userId={staff.user_id} />
          <p className="mt-4 text-[11px] text-foreground/45">
            Activate, deactivate or delete this account from the <Link href="/admin/counsellors" className="font-semibold text-primary hover:underline">Staff</Link> list.
          </p>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-foreground"><Users size={16} aria-hidden /> Assigned students</h3>
          {students.length === 0 ? (
            <p className="text-sm text-foreground/45">No students assigned yet.</p>
          ) : (
            <ul className="divide-y divide-foreground/5">
              {students.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/students/${s.id}`} className="flex items-center justify-between gap-3 rounded-lg px-1 py-2.5 hover:bg-muted/40">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{s.full_name}</span>
                      <span className="block truncate text-[11px] text-foreground/50">{s.country_interest || '—'}{s.city ? ` · ${s.city}` : ''}</span>
                    </span>
                    <StatusBadge status={s.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-foreground"><StickyNote size={16} aria-hidden /> Recent notes</h3>
          {notes.length === 0 ? (
            <p className="text-sm text-foreground/45">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-[11px] font-semibold text-foreground/55">About {n.student_name}</p>
                  <p className="mt-0.5 whitespace-pre-wrap text-foreground/80">{n.note}</p>
                  <p className="mt-1 text-[10px] text-foreground/40">{fmt(n.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 lg:col-span-3">
          <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-foreground"><Activity size={16} aria-hidden /> Activity</h3>
          {logs.length === 0 ? (
            <EmptyState icon={Activity} title="No activity recorded yet" />
          ) : (
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {logs.map((l) => (
                <li key={l.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>
                    <span className="text-foreground/80">{l.activity}</span>
                    <span className="block text-[10px] text-foreground/40">{fmt(l.created_at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
