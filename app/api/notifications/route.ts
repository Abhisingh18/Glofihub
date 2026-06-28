import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/pg';
import type { Notification } from '@/lib/database.types';

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ items: [] });
  const items = await sql<Notification>(
    `select * from notifications where user_id = $1 order by created_at desc limit 20`,
    [me.id]
  );
  return NextResponse.json({ items });
}

export async function POST() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  await sql(`update notifications set read = true where user_id = $1 and read = false`, [me.id]);
  return NextResponse.json({ ok: true });
}
