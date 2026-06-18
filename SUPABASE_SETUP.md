# Supabase Setup — Cloud Student Data + Admin Login

The site works without this (it falls back to per-browser localStorage + demo
login). Follow these steps once to enable **cross-device data** and **secure admin auth**.

## 1. Create a project
1. Go to https://supabase.com → sign in → **New Project** (free tier is fine).
2. Wait for it to provision.

## 2. Add the keys
1. Project Settings → **API**.
2. Copy **Project URL** and the **anon public** key.
3. In the `glofihub` folder, create a file named `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

4. Restart the dev server (`npm run dev`).

## 3. Create the table + security rules
Supabase Dashboard → **SQL Editor** → run:

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  city text,
  age text,
  service text,
  preference text,
  message text,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Students (anonymous) can submit the form
create policy "anon can insert" on public.leads
  for insert to anon with check (true);

-- Only logged-in admins can read / delete
create policy "admin can read" on public.leads
  for select to authenticated using (true);
create policy "admin can delete" on public.leads
  for delete to authenticated using (true);
```

## 4. Create the admin user
Dashboard → **Authentication → Users → Add user** → enter the admin email &
password you want (e.g. `admin@glofihub.com`). Use these on the `/admin` login.

> Optional: Authentication → Providers → Email → turn **off** "Confirm email"
> so the admin can log in immediately.

## Done
- Student form submissions now save to the cloud `leads` table.
- `/admin` login uses real Supabase Auth.
- `/admin/dashboard` shows all students from any device.
