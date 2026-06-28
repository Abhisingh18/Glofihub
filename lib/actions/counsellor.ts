'use server';

import { revalidatePath } from 'next/cache';
import { sql, one } from '@/lib/pg';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { noteSchema, statusSchema } from '@/lib/validations';
import type { ActivityLog } from '@/lib/database.types';

type Result = { ok: boolean; error?: string };

/** Confirm the current counsellor is assigned to a student; returns counsellor id or null. */
async function assertAssigned(userId: string, studentId: string): Promise<string | null> {
  const row = await one<{ id: string }>(
    `select c.id from counsellors c
     join students s on s.assigned_counsellor_id = c.id
     where c.user_id = $1 and s.id = $2`,
    [userId, studentId]
  );
  return row?.id ?? null;
}

export async function addNote(input: unknown): Promise<Result> {
  const me = await requireRole('counsellor');
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const counsellorId = await assertAssigned(me.id, parsed.data.student_id);
  if (!counsellorId) return { ok: false, error: 'Not your student' };

  await sql(
    `insert into notes (student_id, counsellor_id, note) values ($1, $2, $3)`,
    [parsed.data.student_id, counsellorId, parsed.data.note]
  );
  await logActivity(me.id, 'Added private note', { student_id: parsed.data.student_id });
  revalidatePath(`/counsellor/students/${parsed.data.student_id}`);
  return { ok: true };
}

export async function counsellorSetStatus(input: unknown): Promise<Result> {
  const me = await requireRole('counsellor');
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };

  const counsellorId = await assertAssigned(me.id, parsed.data.student_id);
  if (!counsellorId) return { ok: false, error: 'Not your student' };

  await sql(`update students set status = $2 where id = $1`, [parsed.data.student_id, parsed.data.status]);
  await logActivity(me.id, 'Updated student status', { ...parsed.data });
  revalidatePath(`/counsellor/students/${parsed.data.student_id}`);
  revalidatePath('/counsellor/students');
  return { ok: true };
}

export async function getStudentActivity(userId: string): Promise<ActivityLog[]> {
  return sql<ActivityLog>(
    `select * from activity_logs where user_id = $1 order by created_at desc limit 20`,
    [userId]
  );
}
