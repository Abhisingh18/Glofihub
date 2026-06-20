'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logActivity } from '@/lib/activity';
import { noteSchema, statusSchema } from '@/lib/validations';

type Result = { ok: boolean; error?: string };

export async function addNote(input: unknown): Promise<Result> {
  const me = await requireRole('counsellor');
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: c } = await supabase.from('counsellors').select('id').eq('user_id', me.id).single();
  if (!c) return { ok: false, error: 'Counsellor profile missing' };

  const { error } = await supabase.from('notes').insert({
    student_id: parsed.data.student_id,
    counsellor_id: c.id,
    note: parsed.data.note,
  });
  if (error) return { ok: false, error: error.message };
  await logActivity(me.id, 'Added private note', { student_id: parsed.data.student_id });
  revalidatePath(`/counsellor/students/${parsed.data.student_id}`);
  return { ok: true };
}

export async function counsellorSetStatus(input: unknown): Promise<Result> {
  const me = await requireRole('counsellor');
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };

  // RLS ensures a counsellor can only update their assigned students.
  const supabase = await createClient();
  const { error } = await supabase
    .from('students')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.student_id);
  if (error) return { ok: false, error: error.message };

  await logActivity(me.id, 'Updated student status', parsed.data);
  revalidatePath(`/counsellor/students/${parsed.data.student_id}`);
  revalidatePath('/counsellor/students');
  return { ok: true };
}

// Used by both admin & counsellor detail views — returns the activity for a student's user.
export async function getStudentActivity(userId: string) {
  await requireRole('counsellor').catch(() => requireRole('super_admin'));
  const db = createAdminClient();
  const { data } = await db
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return data ?? [];
}
