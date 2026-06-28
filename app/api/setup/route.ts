import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql, one, isDbConfigured } from '@/lib/pg';
import { SCHEMA_SQL } from '@/lib/schema';

/**
 * One-time setup. Visit:
 *   /api/setup?secret=YOUR_ADMIN_SETUP_SECRET
 * Requires env: DATABASE_URL, ADMIN_SETUP_SECRET, SETUP_ADMIN_EMAIL, SETUP_ADMIN_PASSWORD.
 * Idempotent — safe to run again (won't duplicate the admin).
 */
async function handler(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not set.' }, { status: 503 });
  }

  const secret = new URL(req.url).searchParams.get('secret');
  const expected = process.env.ADMIN_SETUP_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing setup secret.' }, { status: 401 });
  }

  // 1) Create tables (idempotent).
  await sql(SCHEMA_SQL);

  // 2) Create the first admin if none exists.
  const email = process.env.SETUP_ADMIN_EMAIL;
  const password = process.env.SETUP_ADMIN_PASSWORD;
  let adminMsg = 'Admin already present — skipped.';

  const existingAdmin = await one<{ id: string }>(`select id from users where role = 'super_admin' limit 1`);
  if (!existingAdmin) {
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Set SETUP_ADMIN_EMAIL and SETUP_ADMIN_PASSWORD to create the first admin.' },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(password, 10);
    await sql(
      `insert into users (full_name, email, password_hash, role)
       values ('Administrator', lower($1), $2, 'super_admin')
       on conflict (email) do update set role = 'super_admin', password_hash = excluded.password_hash`,
      [email, hash]
    );
    adminMsg = `Admin created: ${email}`;
  }

  return NextResponse.json({ ok: true, schema: 'ready', admin: adminMsg });
}

export const GET = handler;
export const POST = handler;
