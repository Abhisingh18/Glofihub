import { createClient } from '@/lib/supabase/server';
import type { Message, Note, Payment, StudentStatus } from '@/lib/database.types';

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  return (data as Message[]) ?? [];
}

export interface StudentRow {
  id: string;
  status: StudentStatus;
  city: string | null;
  country_interest: string | null;
  education_level: string | null;
  created_at: string;
  user_id: string;
  full_name: string;
  email: string;
  counsellor_id: string | null;
  counsellor_name: string | null;
}

const STUDENT_SELECT = `
  id, status, city, country_interest, education_level, created_at, user_id, assigned_counsellor_id,
  user:users!students_user_id_fkey ( full_name, email ),
  counsellor:counsellors!students_assigned_counsellor_id_fkey (
    id, user:users!counsellors_user_id_fkey ( full_name )
  )
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function normaliseStudent(s: any): StudentRow {
  return {
    id: s.id,
    status: s.status,
    city: s.city,
    country_interest: s.country_interest,
    education_level: s.education_level,
    created_at: s.created_at,
    user_id: s.user_id,
    full_name: s.user?.full_name ?? '—',
    email: s.user?.email ?? '',
    counsellor_id: s.counsellor?.id ?? null,
    counsellor_name: s.counsellor?.user?.full_name ?? null,
  };
}

/** All students visible to the current user (admin → all, counsellor → assigned). */
export async function getStudents(): Promise<StudentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('students').select(STUDENT_SELECT).order('created_at', { ascending: false });
  return ((data as any[]) ?? []).map(normaliseStudent);
}

export async function getStudent(id: string): Promise<StudentRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('students').select(STUDENT_SELECT).eq('id', id).maybeSingle();
  return data ? normaliseStudent(data) : null;
}

export async function getStudentPayments(studentId: string): Promise<Payment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  return (data as Payment[]) ?? [];
}

export async function getStudentNotes(studentId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notes').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  return (data as Note[]) ?? [];
}

export interface CounsellorRow {
  id: string;
  user_id: string;
  department: string | null;
  active: boolean;
  full_name: string;
  email: string;
  student_count: number;
}

export async function getCounsellors(): Promise<CounsellorRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('counsellors')
    .select(`id, user_id, department, active, user:users!counsellors_user_id_fkey ( full_name, email ), students:students(count)`)
    .order('created_at', { ascending: false });
  return ((data as any[]) ?? []).map((c) => ({
    id: c.id,
    user_id: c.user_id,
    department: c.department,
    active: c.active,
    full_name: c.user?.full_name ?? '—',
    email: c.user?.email ?? '',
    student_count: c.students?.[0]?.count ?? 0,
  }));
}

/** The current student's own row + counsellor (name/department only — no phone). */
export async function getMyStudent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('students')
    .select(`
      id, status, city, country_interest, education_level, created_at, user_id, assigned_counsellor_id,
      user:users!students_user_id_fkey ( full_name, email, phone ),
      counsellor:counsellors!students_assigned_counsellor_id_fkey (
        id, department, user_id, user:users!counsellors_user_id_fkey ( full_name )
      )
    `)
    .eq('user_id', user.id)
    .maybeSingle();
  return data as any;
}
