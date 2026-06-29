/**
 * Plain PostgreSQL schema for the GlofiHub CRM (no Supabase).
 * Idempotent — safe to run multiple times. Executed by /api/setup.
 */
export const SCHEMA_SQL = `
create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('super_admin', 'counsellor', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type student_status as enum (
    'new_lead','contacted','interested','follow_up','paid','active','converted','closed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_type as enum ('registration_fee','counselling_fee','premium_package');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('created','paid','failed');
exception when duplicate_object then null; end $$;

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null default '',
  email         text not null unique,
  password_hash text not null,
  role          user_role not null default 'student',
  phone         text,
  profile_image text,
  created_at    timestamptz not null default now()
);

create table if not exists counsellors (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references users(id) on delete cascade,
  department text default 'General Counselling',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references users(id) on delete cascade,
  city                   text,
  country_interest       text,
  education_level        text,
  status                 student_status not null default 'new_lead',
  assigned_counsellor_id uuid references counsellors(id) on delete set null,
  created_at             timestamptz not null default now()
);

create table if not exists student_assignments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references students(id) on delete cascade,
  counsellor_id uuid not null references counsellors(id) on delete cascade,
  assigned_by   uuid references users(id) on delete set null,
  assigned_at   timestamptz not null default now()
);

create table if not exists conversations (
  id         uuid primary key default gen_random_uuid(),
  user_a     uuid not null references users(id) on delete cascade,
  user_b     uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b)
);

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references users(id) on delete cascade,
  receiver_id     uuid not null references users(id) on delete cascade,
  message         text not null,
  read_status     boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists payments (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references students(id) on delete cascade,
  amount              numeric(12,2) not null,
  payment_status      payment_status not null default 'created',
  razorpay_order_id   text,
  razorpay_payment_id text,
  payment_type        payment_type not null default 'counselling_fee',
  created_at          timestamptz not null default now()
);

create table if not exists notes (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references students(id) on delete cascade,
  counsellor_id uuid not null references counsellors(id) on delete cascade,
  note          text not null,
  created_at    timestamptz not null default now()
);

create table if not exists activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete set null,
  activity   text not null,
  meta       jsonb,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- Talk-time allowance (admin-controlled). chat_started_at marks when the clock began.
alter table students add column if not exists chat_minutes int not null default 0;
alter table students add column if not exists chat_started_at timestamptz;

create index if not exists idx_students_counsellor on students(assigned_counsellor_id);
create index if not exists idx_students_status on students(status);
create index if not exists idx_messages_conversation on messages(conversation_id, created_at);
create index if not exists idx_payments_student on payments(student_id);
create index if not exists idx_notes_student on notes(student_id);
create index if not exists idx_notifications_user on notifications(user_id, read);
create index if not exists idx_activity_user on activity_logs(user_id, created_at);
`;
