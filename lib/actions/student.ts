'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/pg';
import { requireRole } from '@/lib/auth';
import { profileSchema } from '@/lib/validations';

type Result = { ok: boolean; error?: string };

export async function updateMyProfile(input: unknown): Promise<Result> {
  const me = await requireRole('student');
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { full_name, phone, city, country_interest, education_level } = parsed.data;

  await sql(`update users set full_name = $2, phone = $3 where id = $1`, [me.id, full_name, phone ?? null]);
  await sql(
    `update students set city = $2, country_interest = $3, education_level = $4 where user_id = $1`,
    [me.id, city ?? null, country_interest ?? null, education_level ?? null]
  );
  revalidatePath('/student/profile');
  revalidatePath('/student/dashboard');
  return { ok: true };
}
