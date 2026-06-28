'use server';

import { sql, one } from '@/lib/pg';
import { requireUser } from '@/lib/auth';
import { notify } from '@/lib/activity';
import { messageSchema } from '@/lib/validations';

/** Find or create the single conversation between two users (normalised pair). */
export async function getOrCreateConversation(userId1: string, userId2: string): Promise<string | null> {
  const [user_a, user_b] = [userId1, userId2].sort();
  const existing = await one<{ id: string }>(
    `select id from conversations where user_a = $1 and user_b = $2`,
    [user_a, user_b]
  );
  if (existing) return existing.id;
  const created = await one<{ id: string }>(
    `insert into conversations (user_a, user_b) values ($1, $2)
     on conflict (user_a, user_b) do update set user_a = excluded.user_a
     returning id`,
    [user_a, user_b]
  );
  return created?.id ?? null;
}

export async function sendMessage(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const me = await requireUser();
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid message' };
  const { conversation_id, receiver_id, message } = parsed.data;

  // Ensure the sender belongs to this conversation.
  const conv = await one<{ id: string }>(
    `select id from conversations where id = $1 and ($2 = user_a or $2 = user_b)`,
    [conversation_id, me.id]
  );
  if (!conv) return { ok: false, error: 'Not allowed' };

  await sql(
    `insert into messages (conversation_id, sender_id, receiver_id, message)
     values ($1, $2, $3, $4)`,
    [conversation_id, me.id, receiver_id, message]
  );
  await notify(receiver_id, 'message', `New message from ${me.full_name}`, message.slice(0, 80));
  return { ok: true };
}
