// Server-only. Best-effort in-memory rate limiting for sign-in and sign-up.
// It is per server instance (serverless instances don't share memory), so it blocks casual
// brute-forcing, not a distributed attack — pair it with a WAF / Vercel firewall rule for that.
import { headers } from 'next/headers';

declare global {
  // eslint-disable-next-line no-var
  var __authRateLimit: Map<string, number[]> | undefined;
}

const store: Map<string, number[]> = (globalThis.__authRateLimit ??= new Map());
const MAX_KEYS = 5000;

/** The caller's IP (first x-forwarded-for entry), or 'unknown'. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || 'unknown';
}

/** True when `key` already has `max` or more recorded hits inside the window. */
export function isLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length === 0) store.delete(key);
  else store.set(key, recent);
  return recent.length >= max;
}

/** Record one hit (e.g. a failed sign-in) for `key`. */
export function recordHit(key: string, windowMs: number): void {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  store.set(key, recent);

  // Keep memory bounded.
  if (store.size > MAX_KEYS) {
    for (const [k, times] of store) {
      if (!times.some((t) => now - t < windowMs)) store.delete(k);
    }
    if (store.size > MAX_KEYS) store.clear();
  }
}

/** Forget all hits for `key` (after a successful sign-in). */
export function clearHits(key: string): void {
  store.delete(key);
}
