'use server';

import { sql, one } from '@/lib/pg';
import { requireUser } from '@/lib/auth';
import { notify } from '@/lib/activity';
import { messageSchema } from '@/lib/validations';

export async function sendMessage(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const me = await requireUser();
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid message' };
  const { conversation_id, receiver_id, message } = parsed.data;

  // The sender must be in this conversation, and the receiver must be the other participant.
  const conv = await one<{ user_a: string; user_b: string }>(
    `select user_a, user_b from conversations where id = $1 and ($2 = user_a or $2 = user_b)`,
    [conversation_id, me.id]
  );
  if (!conv) return { ok: false, error: 'Not allowed' };
  const other = conv.user_a === me.id ? conv.user_b : conv.user_a;
  if (receiver_id.toLowerCase() !== other) return { ok: false, error: 'Not allowed' };

  // Talk time: admin-granted minutes whose clock starts when the student first chats.
  // Enforced here (not only in the UI) so it can't be bypassed from the browser.
  if (me.role === 'student') {
    const s = await one<{ chat_minutes: number; chat_started_at: string | Date | null }>(
      `select chat_minutes, chat_started_at from students where user_id = $1`,
      [me.id]
    );
    if (s && s.chat_minutes > 0) {
      if (!s.chat_started_at) {
        await sql(
          `update students set chat_started_at = now() where user_id = $1 and chat_started_at is null`,
          [me.id]
        );
      } else if (Date.now() > new Date(s.chat_started_at).getTime() + s.chat_minutes * 60_000) {
        return { ok: false, error: 'Your talk time is over.' };
      }
    }
  }

  await sql(
    `insert into messages (conversation_id, sender_id, receiver_id, message)
     values ($1, $2, $3, $4)`,
    [conversation_id, me.id, other, message]
  );
  await notify(other, 'message', `New message from ${me.full_name}`, message.slice(0, 80));
  return { ok: true };
}
