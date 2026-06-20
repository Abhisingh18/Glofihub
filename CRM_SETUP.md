# GlofiHub CRM — Setup Guide

The authenticated CRM (admin / counsellor / student) is built on top of the
landing page. Follow these steps to make it live.

## 1. Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...           # Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...      # Supabase → Settings → API (anon public)
SUPABASE_SERVICE_ROLE_KEY=...          # Supabase → Settings → API (service_role — SECRET)
RAZORPAY_KEY_ID=...                    # Razorpay → Settings → API Keys
RAZORPAY_KEY_SECRET=...                # Razorpay → Settings → API Keys (SECRET)
```

On Vercel, add the same keys in **Project → Settings → Environment Variables**.

## 2. Database

In Supabase → **SQL Editor**, run in order:

1. `supabase/schema.sql`  — tables, enums, triggers, realtime.
2. `supabase/rls.sql`     — row-level security policies.

This also creates a trigger so every new auth user gets a `users` row (and a
`students`/`counsellors` row based on their role).

## 3. Create the first admin

Supabase → **Authentication → Users → Add user**:
- Email + password of your choice.
- Auto-confirm the user.

Then promote them to admin (SQL Editor):
```sql
update public.users set role = 'super_admin'
where email = 'admin@glofihub.com';
```

Now `/login` with those credentials → lands on `/admin/dashboard`.

## 4. Roles & how it works

| Role | How created | Lands on |
| --- | --- | --- |
| **Student** | Self sign-up at `/register` | `/student/dashboard` |
| **Counsellor** | Admin → Counsellors → Add Counsellor | `/counsellor/dashboard` |
| **Super Admin** | Created in Supabase + SQL above | `/admin/dashboard` |

RBAC is enforced in 3 layers: `middleware.ts` (routes), server actions/route
handlers (actions), and Postgres **RLS** (data).

## 5. Realtime chat

Chat uses Supabase Realtime (already enabled for `messages` & `notifications`
in `schema.sql`). No phone numbers are ever exposed between students and
counsellors — all communication is in-app.

## 6. Razorpay payments

- Use **test keys** first (Razorpay test mode).
- Order is created server-side (`/api/payments/order`), checkout opens on the
  client, and the signature is verified server-side (`/api/payments/verify`)
  before the payment is marked **paid** and the student status updated.
- Until Razorpay keys are set, the Pay button returns a friendly "not
  configured" message — the rest of the CRM works fine.

## 7. Auth email (optional)

Supabase → Authentication → Providers → Email: turn **off** "Confirm email" for
instant student sign-in during testing, or keep it on for production.

## Folder map

```
app/(auth)/            login, register, forgot-password
app/admin/             admin dashboard, students, counsellors, assignments,
                       payments, analytics, settings
app/counsellor/        dashboard, students, messages
app/student/           dashboard, chat, payments, profile
app/api/payments/      order, verify  (Razorpay)
components/crm/         shared CRM UI (shell, chat, charts, tables, forms)
lib/                    auth, queries, validations, actions/, supabase/
supabase/              schema.sql, rls.sql
middleware.ts          route-level RBAC
```
