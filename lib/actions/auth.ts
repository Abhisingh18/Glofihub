'use server';

import bcrypt from 'bcryptjs';
import { sql, one } from '@/lib/pg';
import { setSession, clearSession } from '@/lib/session-cookie';
import { logActivity } from '@/lib/activity';
import { loginSchema, registerSchema } from '@/lib/validations';
import type { UserRole } from '@/lib/database.types';

type AuthResult = { ok: boolean; error?: string; role?: UserRole };

export async function signUp(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;

  const existing = await one<{ id: string }>(`select id from users where lower(email) = lower($1)`, [v.email]);
  if (existing) return { ok: false, error: 'An account with this email already exists.' };

  const hash = await bcrypt.hash(v.password, 10);
  const user = await one<{ id: string; full_name: string }>(
    `insert into users (full_name, email, password_hash, role, phone)
     values ($1, lower($2), $3, 'student', $4)
     returning id, full_name`,
    [v.full_name, v.email, hash, v.phone]
  );
  if (!user) return { ok: false, error: 'Could not create account.' };

  await sql(
    `insert into students (user_id, city, country_interest, education_level)
     values ($1, $2, $3, $4)`,
    [user.id, v.city ?? null, v.country_interest ?? null, v.education_level ?? null]
  );

  await setSession({ sub: user.id, role: 'student', name: user.full_name });
  await logActivity(user.id, 'Student registered', { email: v.email });
  return { ok: true, role: 'student' };
}

export async function signIn(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { email, password } = parsed.data;

  const user = await one<{ id: string; full_name: string; role: UserRole; password_hash: string }>(
    `select id, full_name, role, password_hash from users where lower(email) = lower($1)`,
    [email]
  );
  if (!user) return { ok: false, error: 'Invalid email or password.' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, error: 'Invalid email or password.' };

  await setSession({ sub: user.id, role: user.role, name: user.full_name });
  await logActivity(user.id, 'Signed in');
  return { ok: true, role: user.role };
}

export async function signOut(): Promise<void> {
  await clearSession();
}
