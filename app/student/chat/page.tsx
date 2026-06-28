import { requireRole } from '@/lib/auth';
import { getMyStudent, getMessages } from '@/lib/queries';
import { getOrCreateConversation } from '@/lib/actions/chat';
import { PageHeader, EmptyState } from '@/components/crm/widgets';
import { ChatBox } from '@/components/crm/ChatBox';
import { MessagesSquare } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function StudentChat() {
  const me = await requireRole('student');
  const student = (await getMyStudent()) as any;
  const counsellor = student?.counsellor;

  if (!counsellor) {
    return (
      <>
        <PageHeader title="Chat" />
        <EmptyState icon={MessagesSquare} title="No counsellor assigned yet" hint="Once a counsellor is assigned, you can chat here." />
      </>
    );
  }

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
        />
      )}
    </>
  );
}
