// Server-only — only import from Server Components / Actions / Route Handlers.
import { sql } from '@/lib/pg';

/** Record an audit-trail entry. */
export async function logActivity(
  userId: string | null,
  activity: string,
  meta?: Record<string, unknown>
) {
  try {
    await sql(
      `insert into activity_logs (user_id, activity, meta) values ($1, $2, $3)`,
      [userId, activity, meta ? JSON.stringify(meta) : null]
    );
  } catch {
    /* logging must never break the main flow */
  }
}

/** Push a notification to a user. */
export async function notify(userId: string, type: string, title: string, body?: string) {
  try {
    await sql(
      `insert into notifications (user_id, type, title, body) values ($1, $2, $3, $4)`,
      [userId, type, title, body ?? null]
    );
  } catch {
    /* non-blocking */
  }
}
