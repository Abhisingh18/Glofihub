// Server-only module — only import from Server Components / Route Handlers.
import { createAdminClient } from '@/lib/supabase/admin';

/** Record an audit-trail entry. Uses service role (bypasses RLS). */
export async function logActivity(
  userId: string | null,
  activity: string,
  meta?: Record<string, unknown>
) {
  try {
    const admin = createAdminClient();
    await admin.from('activity_logs').insert({ user_id: userId, activity, meta: meta ?? null });
  } catch {
    /* logging must never break the main flow */
  }
}

/** Push a notification to a user. */
export async function notify(
  userId: string,
  type: string,
  title: string,
  body?: string
) {
  try {
    const admin = createAdminClient();
    await admin.from('notifications').insert({ user_id: userId, type, title, body: body ?? null });
  } catch {
    /* non-blocking */
  }
}
