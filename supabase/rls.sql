-- ============================================================================
-- GlofiHub CRM — Row Level Security
-- Run AFTER schema.sql.
-- ============================================================================

alter table public.users               enable row level security;
alter table public.counsellors         enable row level security;
alter table public.students            enable row level security;
alter table public.student_assignments enable row level security;
alter table public.conversations       enable row level security;
alter table public.messages            enable row level security;
alter table public.payments            enable row level security;
alter table public.notes               enable row level security;
alter table public.activity_logs       enable row level security;
alter table public.notifications       enable row level security;

-- ---------- users ----------
-- Self read; assigned counsellor can read their students' user rows; admin all.
drop policy if exists users_select on public.users;
create policy users_select on public.users for select using (
  id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.students s
    join public.counsellors c on c.id = s.assigned_counsellor_id
    where s.user_id = public.users.id and c.user_id = auth.uid()
  )
  or exists (
    select 1 from public.students s
    join public.counsellors c on c.id = s.assigned_counsellor_id
    where c.user_id = public.users.id and s.user_id = auth.uid()
  )
);
drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users for update using (id = auth.uid() or public.is_admin());
drop policy if exists users_admin_all on public.users;
create policy users_admin_all on public.users for all using (public.is_admin()) with check (public.is_admin());

-- ---------- counsellors ----------
drop policy if exists counsellors_select on public.counsellors;
create policy counsellors_select on public.counsellors for select using (
  active = true or user_id = auth.uid() or public.is_admin()
);
drop policy if exists counsellors_admin_all on public.counsellors;
create policy counsellors_admin_all on public.counsellors for all using (public.is_admin()) with check (public.is_admin());

-- ---------- students ----------
drop policy if exists students_select on public.students;
create policy students_select on public.students for select using (
  user_id = auth.uid()
  or public.is_admin()
  or assigned_counsellor_id = public.my_counsellor_id()
);
drop policy if exists students_update on public.students;
create policy students_update on public.students for update using (
  user_id = auth.uid()
  or public.is_admin()
  or assigned_counsellor_id = public.my_counsellor_id()
);
drop policy if exists students_admin_all on public.students;
create policy students_admin_all on public.students for all using (public.is_admin()) with check (public.is_admin());

-- ---------- student_assignments (admin manages; counsellor reads own) ----------
drop policy if exists assignments_select on public.student_assignments;
create policy assignments_select on public.student_assignments for select using (
  public.is_admin() or counsellor_id = public.my_counsellor_id()
);
drop policy if exists assignments_admin_all on public.student_assignments;
create policy assignments_admin_all on public.student_assignments for all using (public.is_admin()) with check (public.is_admin());

-- ---------- conversations (participants + admin) ----------
drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations for select using (
  user_a = auth.uid() or user_b = auth.uid() or public.is_admin()
);
drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations for insert with check (
  user_a = auth.uid() or user_b = auth.uid() or public.is_admin()
);

-- ---------- messages (participants only) ----------
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages for select using (
  sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin()
);
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
  )
);
-- Receiver can mark messages read.
drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages for update using (
  receiver_id = auth.uid() or public.is_admin()
);

-- ---------- payments (owner student + admin; counsellor read-only assigned) ----------
drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments for select using (
  student_id = public.my_student_id()
  or public.is_admin()
  or public.is_assigned_counsellor(student_id)
);
-- Inserts/updates happen server-side via service role (bypasses RLS).
drop policy if exists payments_admin_all on public.payments;
create policy payments_admin_all on public.payments for all using (public.is_admin()) with check (public.is_admin());

-- ---------- notes (admin + assigned counsellor ONLY — never the student) ----------
drop policy if exists notes_select on public.notes;
create policy notes_select on public.notes for select using (
  public.is_admin() or counsellor_id = public.my_counsellor_id()
);
drop policy if exists notes_insert on public.notes;
create policy notes_insert on public.notes for insert with check (
  counsellor_id = public.my_counsellor_id() or public.is_admin()
);
drop policy if exists notes_modify on public.notes;
create policy notes_modify on public.notes for all using (
  counsellor_id = public.my_counsellor_id() or public.is_admin()
) with check (
  counsellor_id = public.my_counsellor_id() or public.is_admin()
);

-- ---------- activity_logs (own + admin; inserts server-side) ----------
drop policy if exists activity_select on public.activity_logs;
create policy activity_select on public.activity_logs for select using (
  user_id = auth.uid() or public.is_admin()
);

-- ---------- notifications (own + admin) ----------
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications for select using (
  user_id = auth.uid() or public.is_admin()
);
drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications for update using (
  user_id = auth.uid()
);
