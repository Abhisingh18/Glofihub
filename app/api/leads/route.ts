import { NextResponse } from 'next/server';
import { sql } from '@/lib/pg';
import { logActivity, notify } from '@/lib/activity';
import { leadSchema } from '@/lib/validations';

/**
 * Public lead-capture endpoint — the website contact form posts here.
 * No auth (it is a public form). Defences: body-size cap, honeypot, per-IP rate limit,
 * strict zod validation and parameterised SQL.
 *
 * Privacy: never log phone / email / message.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // the Postgres driver needs Node (ws), not the edge runtime

const MAX_BODY_BYTES = 10 * 1024; // ~10 KB is plenty for a contact form
const RATE_LIMIT = 5; // requests …
const RATE_WINDOW_MS = 10 * 60 * 1000; // … per 10 minutes, per IP
const RATE_MAX_KEYS = 5000; // cap memory use of the in-memory limiter

declare global {
  // eslint-disable-next-line no-var
  var __leadRateLimit: Map<string, number[]> | undefined;
}

// Best-effort limiter: in-memory, so it is per server instance (fine for blocking casual spam).
const hits: Map<string, number[]> = (global.__leadRateLimit ??= new Map());

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Records a hit; returns true when the IP is over its limit. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > RATE_MAX_KEYS) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
    if (hits.size > RATE_MAX_KEYS) hits.clear();
  }
  return false;
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  // 1) Read the body with a hard size cap.
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return fail('Your request is too large.', 413);

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return fail('Invalid request.', 400);
  }
  if (raw.length > MAX_BODY_BYTES) return fail('Your request is too large.', 413);

  // 2) Parse JSON safely.
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail('Invalid request.', 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Invalid request.', 400);

  // 3) Honeypot: real visitors never fill `website`. Pretend success, save nothing.
  if ((body as Record<string, unknown>).website) return NextResponse.json({ ok: true });

  // 4) Validate.
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? 'Please check the form and try again.', 400);
  }
  const lead = parsed.data;

  // 5) Rate limit (counted only for well-formed submissions, so fixing typos is never penalised).
  if (isRateLimited(clientIp(req))) {
    return fail('Too many requests. Please wait a few minutes or message us on WhatsApp.', 429);
  }

  // 6) Save.
  try {
    await sql(
      `insert into leads
         (name, phone, email, location, requirement, contact_method, message,
          source, page, landing_page, referrer,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.location ?? null,
        lead.requirement,
        lead.contact_method,
        lead.message ?? null,
        lead.source ?? null,
        lead.page ?? null,
        lead.landing_page ?? null,
        lead.referrer ?? null,
        lead.utm_source ?? null,
        lead.utm_medium ?? null,
        lead.utm_campaign ?? null,
        lead.utm_term ?? null,
        lead.utm_content ?? null,
      ]
    );
  } catch (err) {
    // Expected until the leads table exists (/api/setup). Log the reason only — never lead data.
    console.error('[leads] insert failed:', err instanceof Error ? err.message : 'unknown error');
    return fail('Could not save your request. Please try WhatsApp instead.', 500);
  }

  // 7) Best-effort side effects — the lead is already saved, so none of this may fail the request.
  try {
    const admins = await sql<{ id: string }>(`select id from users where role = 'super_admin'`);
    await Promise.all(admins.map((a) => notify(a.id, 'lead', 'New lead', `${lead.name} — ${lead.requirement}`)));
  } catch {
    /* non-blocking */
  }
  await logActivity(null, 'New website lead', { requirement: lead.requirement, source: lead.source });

  return NextResponse.json({ ok: true });
}
