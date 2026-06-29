import { sql, one } from '@/lib/pg';
import { getCurrentUser } from '@/lib/auth';
import type { Message, Note, Payment, StudentStatus } from '@/lib/database.types';

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
  chat_minutes: number;
}

const STUDENT_SELECT = `
  select s.id, s.status, s.city, s.country_interest, s.education_level, s.created_at, s.user_id,
         s.assigned_counsellor_id as counsellor_id, s.chat_minutes,
         u.full_name, u.email,
         cu.full_name as counsellor_name
  from students s
  join users u on u.id = s.user_id
  left join counsellors c on c.id = s.assigned_counsellor_id
  left join users cu on cu.id = c.user_id
`;

/** Students visible to the current user (admin → all, counsellor → assigned). */
export async function getStudents(): Promise<StudentRow[]> {
  const me = await getCurrentUser();
  if (!me) return [];
  if (me.role === 'counsellor') {
    const c = await one<{ id: string }>(`select id from counsellors where user_id = $1`, [me.id]);
    if (!c) return [];
    return sql<StudentRow>(`${STUDENT_SELECT} where s.assigned_counsellor_id = $1 order by s.created_at desc`, [c.id]);
  }
  if (me.role !== 'super_admin') return [];
  return sql<StudentRow>(`${STUDENT_SELECT} order by s.created_at desc`);
}

export async function getStudent(id: string): Promise<StudentRow | null> {
  const me = await getCurrentUser();
  if (!me) return null;
  const row = await one<StudentRow>(`${STUDENT_SELECT} where s.id = $1`, [id]);
  if (!row) return null;
  // Access control
  if (me.role === 'super_admin') return row;
  if (me.role === 'counsellor') {
    const c = await one<{ id: string }>(`select id from counsellors where user_id = $1`, [me.id]);
    return c && row.counsellor_id === c.id ? row : null;
  }
  return row.user_id === me.id ? row : null;
}

export async function getStudentPayments(studentId: string): Promise<Payment[]> {
  return sql<Payment>(`select * from payments where student_id = $1 order by created_at desc`, [studentId]);
}

export async function getStudentNotes(studentId: string): Promise<Note[]> {
  return sql<Note>(`select * from notes where student_id = $1 order by created_at desc`, [studentId]);
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
  return sql<CounsellorRow>(
    `select c.id, c.user_id, c.department, c.active, u.full_name, u.email,
            (select count(*)::int from students s where s.assigned_counsellor_id = c.id) as student_count
     from counsellors c
     join users u on u.id = c.user_id
     order by c.created_at desc`
  );
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return sql<Message>(`select * from messages where conversation_id = $1 order by created_at asc`, [conversationId]);
}

export interface MyStudent {
  id: string;
  status: StudentStatus;
  city: string | null;
  country_interest: string | null;
  education_level: string | null;
  created_at: string;
  chat_minutes: number;
  chat_started_at: string | null;
  user: { full_name: string; email: string; phone: string | null };
  counsellor: { id: string; department: string | null; user_id: string; user: { full_name: string } } | null;
}

/** The current student's own record + assigned counsellor (no phone of counsellor). */
export async function getMyStudent(): Promise<MyStudent | null> {
  const me = await getCurrentUser();
  if (!me) return null;
  const r = await one<{
    id: string; status: StudentStatus; city: string | null; country_interest: string | null;
    education_level: string | null; created_at: string; chat_minutes: number; chat_started_at: string | null;
    u_full_name: string; u_email: string; u_phone: string | null;
    c_id: string | null; c_department: string | null; c_user_id: string | null; c_name: string | null;
  }>(
    `select s.id, s.status, s.city, s.country_interest, s.education_level, s.created_at,
            s.chat_minutes, s.chat_started_at,
            u.full_name as u_full_name, u.email as u_email, u.phone as u_phone,
            c.id as c_id, c.department as c_department, c.user_id as c_user_id, cu.full_name as c_name
     from students s
     join users u on u.id = s.user_id
     left join counsellors c on c.id = s.assigned_counsellor_id
     left join users cu on cu.id = c.user_id
     where s.user_id = $1`,
    [me.id]
  );
  if (!r) return null;
  return {
    id: r.id,
    status: r.status,
    city: r.city,
    country_interest: r.country_interest,
    education_level: r.education_level,
    created_at: r.created_at,
    chat_minutes: r.chat_minutes ?? 0,
    chat_started_at: r.chat_started_at,
    user: { full_name: r.u_full_name, email: r.u_email, phone: r.u_phone },
    counsellor: r.c_id
      ? { id: r.c_id, department: r.c_department, user_id: r.c_user_id!, user: { full_name: r.c_name ?? 'Counsellor' } }
      : null,
  };
}
