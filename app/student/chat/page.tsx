import { requireRole } from '@/lib/auth';
import { getMyStudent, getMessages } from '@/lib/queries';
import { getOrCreateConversation } from '@/lib/actions/chat';
import { sql } from '@/lib/pg';
import { PageHeader, EmptyState } from '@/components/crm/widgets';
import { ChatBox } from '@/components/crm/ChatBox';
import { MessagesSquare } from 'lucide-react';

export default async function StudentChat() {
  const me = await requireRole('student');
  const student = await getMyStudent();
  const counsellor = student?.counsellor;

  if (!counsellor || !student) {
    return (
      <>
        <PageHeader title="Chat" />
        <EmptyState icon={MessagesSquare} title="No counsellor assigned yet" hint="Once a counsellor is assigned, you can chat here." />
      </>
    );
  }

  // Start the talk-time clock the first time the student opens chat (if minutes granted).
  let startedAt = student.chat_started_at;
  if (student.chat_minutes > 0 && !startedAt) {
    const row = await sql<{ chat_started_at: string }>(
      `update students set chat_started_at = now() where id = $1 returning chat_started_at`,
      [student.id]
    );
    startedAt = row[0]?.chat_started_at ?? null;
  }
  const expiresAt = startedAt && student.chat_minutes > 0
    ? new Date(new Date(startedAt).getTime() + student.chat_minutes * 60_000).toISOString()
    : null;

  const conversationId = await getOrCreateConversation(me.id, counsellor.user_id);
  const messages = conversationId ? await getMessages(conversationId) : [];

  return (
    <>
      <PageHeader title="Chat" subtitle="Secure messaging with your counsellor" />
      {conversationId && (
        <ChatBox
          conversationId={conversationId}
          me={{ id: me.id, name: me.full_name }}
          other={{ id: counsellor.user_id, name: counsellor.user?.full_name ?? 'Counsellor' }}
          initial={messages}
          expiresAt={expiresAt}
          studentName={me.full_name}
        />
      )}
    </>
  );
}
