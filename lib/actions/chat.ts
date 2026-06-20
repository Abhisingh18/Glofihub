'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';
import { notify } from '@/lib/activity';
import { messageSchema } from '@/lib/validations';

/**
 * Find or create the single conversation between two users.
 * Pair is normalised (sorted) so (a,b) and (b,a) map to one row.
 */
export async function getOrCreateConversation(userId1: string, userId2: string): Promise<string | null> {
  const [user_a, user_b] = [userId1, userId2].sort();
  const db = createAdminClient();
  const { data: existing } = await db
    .from('conversations')
    .select('id')
    .eq('user_a', user_a)
    .eq('user_b', user_b)
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await db
    .from('conversations')
    .insert({ user_a, user_b })
    .select('id')
    .single();
  if (error) return null;
  return data.id;
}

export async function sendMessage(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const me = await requireUser();
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid message' };

  const supabase = await createClient();
  const { error } = await supabase.from('messages').insert({
    conversation_id: parsed.data.conversation_id,
    sender_id: me.id,
    receiver_id: parsed.data.receiver_id,
    message: parsed.data.message,
  });
  if (error) return { ok: false, error: error.message };

  await notify(parsed.data.receiver_id, 'message', `New message from ${me.full_name}`, parsed.data.message.slice(0, 80));
  return { ok: true };
}
