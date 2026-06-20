'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { profileSchema } from '@/lib/validations';

type Result = { ok: boolean; error?: string };

export async function updateMyProfile(input: unknown): Promise<Result> {
  const me = await requireRole('student');
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { full_name, phone, city, country_interest, education_level } = parsed.data;

  const supabase = await createClient();
  const { error: e1 } = await supabase.from('users').update({ full_name, phone }).eq('id', me.id);
  if (e1) return { ok: false, error: e1.message };

  const { error: e2 } = await supabase
    .from('students')
    .update({ city, country_interest, education_level })
    .eq('user_id', me.id);
  if (e2) return { ok: false, error: e2.message };

  revalidatePath('/student/profile');
  revalidatePath('/student/dashboard');
  return { ok: true };
}
