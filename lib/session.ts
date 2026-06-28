import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@/lib/database.types';

export const SESSION_COOKIE = 'glofihub_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;        // user id
  role: UserRole;
  name: string;
}

function secret() {
  const s = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
  return new TextEncoder().encode(s);
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub: String(payload.sub),
      role: payload.role as UserRole,
      name: (payload.name as string) ?? '',
    };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE;
