import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

/**
 * Drops a stale session cookie (user was deleted or deactivated) and sends the
 * visitor to /login. Without this, /login and the dashboard bounce between each
 * other until the cookie expires.
 */
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
