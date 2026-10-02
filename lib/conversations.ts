import { one } from '@/lib/pg';

/**
 * Find or create the single conversation between two users (normalised pair).
 * Server-only helper — deliberately NOT in a 'use server' file, so it isn't
 * exposed as a callable endpoint.
 */
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
