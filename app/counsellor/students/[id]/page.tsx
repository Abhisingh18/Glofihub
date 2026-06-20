import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getStudent, getStudentPayments, getStudentNotes, getMessages } from '@/lib/queries';
import { getOrCreateConversation } from '@/lib/actions/chat';
import { counsellorSetStatus } from '@/lib/actions/counsellor';
import { PageHeader, StatusBadge, Money } from '@/components/crm/widgets';
import { Card } from '@/components/crm/ui';
import { StatusChanger } from '@/components/crm/StatusChanger';
import { NotesPanel } from '@/components/crm/NotesPanel';
import { ChatBox } from '@/components/crm/ChatBox';
import { PAYMENT_TYPE_META } from '@/lib/database.types';
import { MapPin, Globe, GraduationCap } from 'lucide-react';

export default async function CounsellorStudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = (await getCurrentUser())!;
  const student = await getStudent(id);
  if (!student) notFound();

  const [payments, notes] = await Promise.all([getStudentPayments(id), getStudentNotes(id)]);
  const conversationId = await getOrCreateConversation(me.id, student.user_id);
  const messages = conversationId ? await getMessages(conversationId) : [];

  return (
    <>
      <PageHeader title={student.full_name} subtitle={student.email} action={<StatusBadge status={student.status} />} />

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left column: info, status, notes, payments */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Profile</h3>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-foreground/70"><Globe size={15} className="text-foreground/40" /> {student.country_interest || '—'}</p>
              <p className="flex items-center gap-2 text-foreground/70"><MapPin size={15} className="text-foreground/40" /> {student.city || '—'}</p>
              <p className="flex items-center gap-2 text-foreground/70"><GraduationCap size={15} className="text-foreground/40" /> {student.education_level || '—'}</p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-foreground/55 mb-1.5">Update status</p>
              <StatusChanger studentId={student.id} current={student.status} action={counsellorSetStatus} />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Payments</h3>
            {payments.length === 0 ? <p className="text-sm text-foreground/45">No payments yet.</p> : (
              <ul className="space-y-2">
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

          <Card className="p-5">
            <NotesPanel studentId={student.id} notes={notes} />
          </Card>
        </div>

        {/* Right column: chat */}
        <div>
          {conversationId ? (
            <ChatBox
              conversationId={conversationId}
              me={{ id: me.id, name: me.full_name }}
              other={{ id: student.user_id, name: student.full_name }}
              initial={messages}
            />
          ) : (
            <Card className="p-10 text-center text-sm text-foreground/50">Unable to open chat.</Card>
          )}
        </div>
      </div>
    </>
  );
}
