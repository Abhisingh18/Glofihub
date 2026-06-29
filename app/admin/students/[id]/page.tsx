import { notFound } from 'next/navigation';
import { getStudent, getStudentPayments, getStudentNotes, getCounsellors, getChatTranscript } from '@/lib/queries';
import { sql } from '@/lib/pg';
import { PageHeader, StatusBadge, Money } from '@/components/crm/widgets';
import { cn } from '@/lib/utils';
import { Card } from '@/components/crm/ui';
import { StatusChanger } from '@/components/crm/StatusChanger';
import { AssignControl } from '@/components/crm/AssignControl';
import { MinutesControl } from '@/components/crm/MinutesControl';
import { setStudentStatus } from '@/lib/actions/admin';
import { PAYMENT_TYPE_META, type ActivityLog } from '@/lib/database.types';
import { MapPin, Globe, GraduationCap, Calendar, StickyNote, CreditCard, Activity, MessagesSquare } from 'lucide-react';

export default async function AdminStudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  const [payments, notes, counsellors] = await Promise.all([
    getStudentPayments(id),
    getStudentNotes(id),
    getCounsellors(),
  ]);

  const logs = await sql<ActivityLog>(
    `select * from activity_logs where user_id = $1 order by created_at desc limit 15`,
    [student.user_id]
  );

  // Chat transcript between this student and their assigned counsellor (read-only).
  const transcript = student.counsellor_user_id
    ? await getChatTranscript(student.user_id, student.counsellor_user_id)
    : [];

  const fmt = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtTime = (ts: string) => new Date(ts).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <PageHeader
        title={student.full_name}
        subtitle={student.email}
        action={<StatusBadge status={student.status} />}
      />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Info */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-bold text-foreground mb-4">Profile</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info icon={Globe} label="Interest" value={student.country_interest} />
            <Info icon={MapPin} label="City" value={student.city} />
            <Info icon={GraduationCap} label="Education" value={student.education_level} />
            <Info icon={Calendar} label="Joined" value={new Date(student.created_at).toLocaleDateString()} />
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Manage</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground/55 mb-1.5">Status</p>
              <StatusChanger studentId={student.id} current={student.status} action={setStudentStatus} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/55 mb-1.5">Assigned counsellor</p>
              <AssignControl
                studentId={student.id}
                current={student.counsellor_id}
                counsellors={counsellors.map((c) => ({ id: c.id, full_name: c.full_name }))}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/55 mb-1.5">Talk time (minutes)</p>
              <MinutesControl studentId={student.id} current={student.chat_minutes ?? 0} />
            </div>
          </div>
        </Card>

        {/* Payments */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><CreditCard size={16} /> Payments</h3>
          {payments.length === 0 ? <p className="text-sm text-foreground/45">No payments yet.</p> : (
            <ul className="space-y-2.5">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">{PAYMENT_TYPE_META[p.payment_type].label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-foreground"><Money amount={Number(p.amount)} /></span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${p.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>{p.payment_status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Notes (admin read-only) */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><StickyNote size={16} /> Counsellor Notes</h3>
          {notes.length === 0 ? <p className="text-sm text-foreground/45">No notes.</p> : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="text-sm bg-muted/40 rounded-lg p-3">
                  <p className="text-foreground/80">{n.note}</p>
                  <p className="text-[10px] text-foreground/40 mt-1">{fmt(n.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Activity */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2"><Activity size={16} /> Activity</h3>
          {logs.length === 0 ? <p className="text-sm text-foreground/45">No activity.</p> : (
            <ul className="space-y-3">
              {logs.map((l) => (
                <li key={l.id} className="text-sm flex gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>
                    <span className="text-foreground/80">{l.activity}</span>
                    <span className="block text-[10px] text-foreground/40">{fmt(l.created_at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Chat transcript (read-only) */}
        <Card className="p-5 lg:col-span-3">
          <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
            <MessagesSquare size={16} /> Chat — {student.full_name} &amp; {student.counsellor_name ?? 'Counsellor'}
          </h3>
          <p className="text-[11px] text-foreground/45 mb-4">Read-only view of the in-app conversation.</p>
          {!student.counsellor_user_id ? (
            <p className="text-sm text-foreground/45">No counsellor assigned yet.</p>
          ) : transcript.length === 0 ? (
            <p className="text-sm text-foreground/45">No messages yet.</p>
          ) : (
            <div className="space-y-2.5 max-h-[28rem] overflow-y-auto pr-1">
              {transcript.map((m) => {
                const fromStudent = m.sender_id === student.user_id;
                return (
                  <div key={m.id} className={cn('flex', fromStudent ? 'justify-start' : 'justify-end')}>
                    <div className={cn('max-w-[70%] px-3.5 py-2 rounded-2xl text-sm',
                      fromStudent ? 'bg-muted text-foreground rounded-bl-sm' : 'bg-primary/10 text-foreground rounded-br-sm border border-primary/15')}>
                      <p className="text-[10px] font-semibold text-foreground/50 mb-0.5">
                        {fromStudent ? student.full_name : (student.counsellor_name ?? 'Counsellor')}
                      </p>
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5">{fmtTime(m.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="text-foreground/40 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] font-semibold text-foreground/45">{label}</p>
        <p className="text-foreground/80 font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}
