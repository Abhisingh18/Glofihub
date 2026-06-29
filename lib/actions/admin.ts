'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { sql, one } from '@/lib/pg';
import { requireRole } from '@/lib/auth';
import { logActivity, notify } from '@/lib/activity';
import { counsellorSchema, assignSchema, statusSchema, minutesSchema } from '@/lib/validations';
import { getOrCreateConversation } from '@/lib/actions/chat';

type Result = { ok: boolean; error?: string };

export async function createCounsellor(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = counsellorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { full_name, email, phone, department, password } = parsed.data;

  const existing = await one(`select id from users where lower(email) = lower($1)`, [email]);
  if (existing) return { ok: false, error: 'A user with this email already exists.' };

  const hash = await bcrypt.hash(password, 10);
  const user = await one<{ id: string }>(
    `insert into users (full_name, email, password_hash, role, phone)
     values ($1, lower($2), $3, 'counsellor', $4) returning id`,
    [full_name, email, hash, phone ?? null]
  );
  if (!user) return { ok: false, error: 'Could not create counsellor.' };

  await sql(`insert into counsellors (user_id, department) values ($1, $2)`, [user.id, department]);
  await logActivity(admin.id, 'Created counsellor', { email });
  await notify(user.id, 'welcome', 'Welcome to GlofiHub', 'Your counsellor account is ready.');
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function setCounsellorActive(counsellorId: string, active: boolean): Promise<Result> {
  const admin = await requireRole('super_admin');
  await sql(`update counsellors set active = $2 where id = $1`, [counsellorId, active]);
  await logActivity(admin.id, active ? 'Activated counsellor' : 'Deactivated counsellor', { counsellorId });
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function deleteCounsellor(counsellorId: string): Promise<Result> {
  const admin = await requireRole('super_admin');
  const c = await one<{ user_id: string }>(`select user_id from counsellors where id = $1`, [counsellorId]);
  if (!c) return { ok: false, error: 'Counsellor not found' };
  // Cascade removes the counsellor row and unassigns students (ON DELETE SET NULL).
  await sql(`delete from users where id = $1`, [c.user_id]);
  await logActivity(admin.id, 'Deleted counsellor', { counsellorId });
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function assignStudent(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = assignSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const { student_id, counsellor_id } = parsed.data;

  await sql(`update students set assigned_counsellor_id = $2 where id = $1`, [student_id, counsellor_id]);
  await sql(
    `insert into student_assignments (student_id, counsellor_id, assigned_by) values ($1, $2, $3)`,
    [student_id, counsellor_id, admin.id]
  );

  const s = await one<{ user_id: string }>(`select user_id from students where id = $1`, [student_id]);
  const c = await one<{ user_id: string }>(`select user_id from counsellors where id = $1`, [counsellor_id]);
  if (s && c) {
    await getOrCreateConversation(s.user_id, c.user_id);
    await notify(s.user_id, 'assigned', 'Counsellor assigned', 'A counsellor has been assigned to you. Start chatting now.');
    await notify(c.user_id, 'assigned', 'New student assigned', 'You have a new student. Say hello!');
  }
  await logActivity(admin.id, 'Assigned student to counsellor', { student_id, counsellor_id });
  revalidatePath('/admin/assignments');
  revalidatePath('/admin/students');
  return { ok: true };
}

/** Admin grants a student N minutes of talk time (resets their clock). */
export async function setStudentMinutes(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = minutesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid minutes' };
  const { student_id, minutes } = parsed.data;

  // Reset the clock so the new allowance starts when the student next opens chat.
  await sql(`update students set chat_minutes = $2, chat_started_at = null where id = $1`, [student_id, minutes]);

  const s = await one<{ user_id: string }>(`select user_id from students where id = $1`, [student_id]);
  if (s) await notify(s.user_id, 'minutes', 'Talk time updated', `You now have ${minutes} minute(s) to chat with your counsellor.`);
  await logActivity(admin.id, 'Set student talk minutes', { student_id, minutes });
  revalidatePath('/admin/students');
  return { ok: true };
}

export async function setStudentStatus(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  await sql(`update students set status = $2 where id = $1`, [parsed.data.student_id, parsed.data.status]);
  await logActivity(admin.id, 'Changed student status', { ...parsed.data });
  revalidatePath('/admin/students');
  return { ok: true };
}
