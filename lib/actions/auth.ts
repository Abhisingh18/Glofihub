'use server';

import bcrypt from 'bcryptjs';
import { sql, one } from '@/lib/pg';
import { setSession, clearSession } from '@/lib/session-cookie';
import { logActivity } from '@/lib/activity';
import { loginSchema, registerSchema } from '@/lib/validations';
import { clearHits, clientIp, isLimited, recordHit } from '@/lib/rate-limit';
import type { UserRole } from '@/lib/database.types';

type AuthResult = { ok: boolean; error?: string; role?: UserRole };

const BAD_CREDENTIALS = 'Invalid email or password.';
const TOO_MANY = 'Too many attempts. Please wait a few minutes and try again.';
const FAIL_WINDOW = 15 * 60 * 1000;

// Compared against when the e-mail is unknown, so the response time doesn't reveal whether an account exists.
const DUMMY_HASH = bcrypt.hashSync('glofihub-not-a-real-password', 10);

/** The user for these credentials, or null. Always runs one bcrypt comparison. */
async function verifyCredentials(email: string, password: string) {
  const user = await one<{ id: string; full_name: string; role: UserRole; password_hash: string }>(
    `select id, full_name, role, password_hash from users where lower(email) = lower($1)`,
    [email]
  );
  const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  return user && valid ? user : null;
}

/** Throttle keys for one sign-in attempt: per (IP + e-mail) and per IP overall. */
async function throttleKeys(scope: string, email: string) {
  const ip = await clientIp();
  return { byAccount: `${scope}:${ip}:${email.toLowerCase()}`, byIp: `${scope}-ip:${ip}` };
}

export async function signUp(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;

  const ipKey = `signup:${await clientIp()}`;
  if (isLimited(ipKey, 10, 60 * 60 * 1000)) return { ok: false, error: TOO_MANY };
  recordHit(ipKey, 60 * 60 * 1000);

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

/** Student / counsellor sign-in. Administrators have their own portal and cannot sign in here. */
export async function signIn(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { email, password } = parsed.data;

  const keys = await throttleKeys('login', email);
  if (isLimited(keys.byAccount, 8, FAIL_WINDOW) || isLimited(keys.byIp, 40, FAIL_WINDOW)) {
    return { ok: false, error: TOO_MANY };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    recordHit(keys.byAccount, FAIL_WINDOW);
    recordHit(keys.byIp, FAIL_WINDOW);
    return { ok: false, error: BAD_CREDENTIALS };
  }

  // Only reachable with a correct password, so this doesn't reveal which e-mails exist.
  if (user.role === 'super_admin') {
    return { ok: false, error: 'Administrators sign in through the Admin Portal.' };
  }

  if (user.role === 'counsellor') {
    const c = await one<{ active: boolean }>(`select active from counsellors where user_id = $1`, [user.id]);
    if (c && !c.active) return { ok: false, error: 'This account has been deactivated. Contact your administrator.' };
  }

  clearHits(keys.byAccount);
  await setSession({ sub: user.id, role: user.role, name: user.full_name });
  await logActivity(user.id, 'Signed in');
  return { ok: true, role: user.role };
}

/**
 * Admin Portal sign-in (/counselling/admin and the Admin tab on the admin host).
 * Only super_admin accounts succeed; every other outcome returns the same generic error.
 */
export async function adminSignIn(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { email, password } = parsed.data;

  const keys = await throttleKeys('admin-login', email);
  if (isLimited(keys.byAccount, 5, FAIL_WINDOW) || isLimited(keys.byIp, 20, FAIL_WINDOW)) {
    return { ok: false, error: TOO_MANY };
  }

  const user = await verifyCredentials(email, password);
  if (!user || user.role !== 'super_admin') {
    recordHit(keys.byAccount, FAIL_WINDOW);
    recordHit(keys.byIp, FAIL_WINDOW);
    return { ok: false, error: BAD_CREDENTIALS };
  }

  clearHits(keys.byAccount);
  await setSession({ sub: user.id, role: user.role, name: user.full_name });
  await logActivity(user.id, 'Admin signed in');
  return { ok: true, role: user.role };
}

export async function signOut(): Promise<void> {
  await clearSession();
}
