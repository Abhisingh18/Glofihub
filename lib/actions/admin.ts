'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { logActivity, notify } from '@/lib/activity';
import { counsellorSchema, assignSchema, statusSchema } from '@/lib/validations';
import { getOrCreateConversation } from '@/lib/actions/chat';

type Result = { ok: boolean; error?: string };

export async function createCounsellor(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = counsellorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { full_name, email, phone, department, password } = parsed.data;

  const db = createAdminClient();
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, role: 'counsellor', department },
  });
  if (error) return { ok: false, error: error.message };

  await logActivity(admin.id, 'Created counsellor', { email, counsellor: full_name });
  if (data.user) await notify(data.user.id, 'welcome', 'Welcome to GlofiHub', 'Your counsellor account is ready.');
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function setCounsellorActive(counsellorId: string, active: boolean): Promise<Result> {
  const admin = await requireRole('super_admin');
  const db = createAdminClient();
  const { error } = await db.from('counsellors').update({ active }).eq('id', counsellorId);
  if (error) return { ok: false, error: error.message };
  await logActivity(admin.id, active ? 'Activated counsellor' : 'Deactivated counsellor', { counsellorId });
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function deleteCounsellor(counsellorId: string): Promise<Result> {
  const admin = await requireRole('super_admin');
  const db = createAdminClient();
  const { data: c } = await db.from('counsellors').select('user_id').eq('id', counsellorId).single();
  if (!c) return { ok: false, error: 'Counsellor not found' };
  // Deleting the auth user cascades to public.users → counsellors.
  const { error } = await db.auth.admin.deleteUser(c.user_id);
  if (error) return { ok: false, error: error.message };
  await logActivity(admin.id, 'Deleted counsellor', { counsellorId });
  revalidatePath('/admin/counsellors');
  return { ok: true };
}

export async function assignStudent(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = assignSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const { student_id, counsellor_id } = parsed.data;

  const db = createAdminClient();
  const { error } = await db.from('students').update({ assigned_counsellor_id: counsellor_id }).eq('id', student_id);
  if (error) return { ok: false, error: error.message };

  await db.from('student_assignments').insert({ student_id, counsellor_id, assigned_by: admin.id });

  // Look up the two user ids to open a conversation + notify.
  const { data: s } = await db.from('students').select('user_id').eq('id', student_id).single();
  const { data: c } = await db.from('counsellors').select('user_id').eq('id', counsellor_id).single();
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

export async function setStudentStatus(input: unknown): Promise<Result> {
  const user = await requireRole('super_admin');
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const db = createAdminClient();
  const { error } = await db.from('students').update({ status: parsed.data.status }).eq('id', parsed.data.student_id);
  if (error) return { ok: false, error: error.message };
  await logActivity(user.id, 'Changed student status', parsed.data);
  revalidatePath('/admin/students');
  return { ok: true };
}
