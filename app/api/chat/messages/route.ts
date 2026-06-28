import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sql, one } from '@/lib/pg';
import type { Message } from '@/lib/database.types';

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ items: [] }, { status: 401 });

  const conversationId = new URL(req.url).searchParams.get('conversationId');
  if (!conversationId) return NextResponse.json({ items: [] });

  // Participant check.
  const conv = await one(
    `select id from conversations where id = $1 and ($2 = user_a or $2 = user_b)`,
    [conversationId, me.id]
  );
  if (!conv) return NextResponse.json({ items: [] }, { status: 403 });

  // Mark incoming messages as read.
  await sql(
    `update messages set read_status = true where conversation_id = $1 and receiver_id = $2 and read_status = false`,
    [conversationId, me.id]
  );

  const items = await sql<Message>(
    `select * from messages where conversation_id = $1 order by created_at asc`,
    [conversationId]
  );
  return NextResponse.json({ items });
}
