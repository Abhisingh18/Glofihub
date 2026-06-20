-- ============================================================================
-- GlofiHub CRM — Database Schema
-- Run this in Supabase → SQL Editor (run schema.sql first, then rls.sql).
-- ============================================================================

-- ---------- Enums ----------
do $$ begin
  create type public.user_role as enum ('super_admin', 'counsellor', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.student_status as enum (
    'new_lead', 'contacted', 'interested', 'follow_up', 'paid', 'active', 'converted', 'closed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_type as enum ('registration_fee', 'counselling_fee', 'premium_package');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('created', 'paid', 'failed');
exception when duplicate_object then null; end $$;

-- ---------- users (mirrors auth.users) ----------
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null default '',
  email         text not null,
  role          public.user_role not null default 'student',
  phone         text,
  profile_image text,
  created_at    timestamptz not null default now()
);

-- ---------- counsellors ----------
create table if not exists public.counsellors (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.users(id) on delete cascade,
  department text default 'General Counselling',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- students ----------
create table if not exists public.students (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references public.users(id) on delete cascade,
  city                  text,
  country_interest      text,
  education_level       text,
  status                public.student_status not null default 'new_lead',
  assigned_counsellor_id uuid references public.counsellors(id) on delete set null,
  created_at            timestamptz not null default now()
);

-- ---------- student_assignments (audit of who assigned whom) ----------
create table if not exists public.student_assignments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  counsellor_id uuid not null references public.counsellors(id) on delete cascade,
  assigned_by   uuid references public.users(id) on delete set null,
  assigned_at   timestamptz not null default now()
);

-- ---------- conversations (one thread per pair) ----------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_a     uuid not null references public.users(id) on delete cascade,
  user_b     uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b)
);

-- ---------- messages ----------
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.users(id) on delete cascade,
  receiver_id     uuid not null references public.users(id) on delete cascade,
  message         text not null,
  read_status     boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ---------- payments ----------
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  student_id         uuid not null references public.students(id) on delete cascade,
  amount             numeric(12,2) not null,
  payment_status     public.payment_status not null default 'created',
  razorpay_order_id  text,
  razorpay_payment_id text,
  payment_type       public.payment_type not null default 'counselling_fee',
  created_at         timestamptz not null default now()
);

-- ---------- notes (counsellor-private) ----------
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  counsellor_id uuid not null references public.counsellors(id) on delete cascade,
  note          text not null,
  created_at    timestamptz not null default now()
);

-- ---------- activity_logs ----------
create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.users(id) on delete set null,
  activity   text not null,
  meta       jsonb,
  created_at timestamptz not null default now()
);

-- ---------- notifications ----------
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists idx_students_counsellor on public.students(assigned_counsellor_id);
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);
create index if not exists idx_payments_student on public.payments(student_id);
create index if not exists idx_notes_student on public.notes(student_id);
create index if not exists idx_notifications_user on public.notifications(user_id, read);
create index if not exists idx_activity_user on public.activity_logs(user_id, created_at);

-- ============================================================================
-- Helper functions (SECURITY DEFINER bypasses RLS to avoid recursion)
-- ============================================================================
create or replace function public.current_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'super_admin');
$$;

-- Is the current user the counsellor assigned to the given student?
create or replace function public.is_assigned_counsellor(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.students s
    join public.counsellors c on c.id = s.assigned_counsellor_id
    where s.id = p_student and c.user_id = auth.uid()
  );
$$;

-- My counsellor row id (null if not a counsellor)
create or replace function public.my_counsellor_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.counsellors where user_id = auth.uid();
$$;

-- My student row id (null if not a student)
create or replace function public.my_student_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.students where user_id = auth.uid();
$$;

-- ============================================================================
-- Auth trigger — create a public.users row (+ student/counsellor) on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role public.user_role;
begin
  v_role := coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student');

  insert into public.users (id, email, full_name, role, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    v_role,
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;

  if v_role = 'student' then
    insert into public.students (user_id, city, country_interest, education_level)
    values (
      new.id,
      new.raw_user_meta_data ->> 'city',
      new.raw_user_meta_data ->> 'country_interest',
      new.raw_user_meta_data ->> 'education_level'
    ) on conflict (user_id) do nothing;
  elsif v_role = 'counsellor' then
    insert into public.counsellors (user_id, department)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'department', 'General Counselling'))
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Realtime — broadcast message & notification inserts
-- ============================================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
