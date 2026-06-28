import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE, createToken, verifyToken, type SessionPayload } from '@/lib/session';

/** Sign a session JWT and store it in an httpOnly cookie. */
export async function setSession(payload: SessionPayload) {
  const token = await createToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/** Read & verify the current session, or null. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
