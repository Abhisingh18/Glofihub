'use server';

import { revalidatePath } from 'next/cache';
import { one } from '@/lib/pg';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { leadStatusSchema } from '@/lib/validations';

type Result = { ok: boolean; error?: string };

/** Admin moves a website lead through the pipeline (new → contacted → qualified → converted / closed). */
export async function setLeadStatus(input: unknown): Promise<Result> {
  const admin = await requireRole('super_admin');
  const parsed = leadStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const { id, status } = parsed.data;

  let updated: { id: string } | null;
  try {
    updated = await one<{ id: string }>(`update leads set status = $2 where id = $1 returning id`, [id, status]);
  } catch {
    return { ok: false, error: 'Could not update the lead. Has the leads table been created yet?' };
  }
  if (!updated) return { ok: false, error: 'Lead not found' };

  await logActivity(admin.id, 'Changed lead status', { id, status });
  revalidatePath('/admin/leads');
  return { ok: true };
}
