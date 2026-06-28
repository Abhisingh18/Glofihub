# GlofiHub CRM — Setup Guide (PostgreSQL)

The CRM (admin / counsellor / student) runs on **plain PostgreSQL** with custom
auth — no Supabase. It works locally and on Vercel.

## 1. Get a PostgreSQL database (free)

Easiest: **Neon** (https://neon.tech) — free, serverless, perfect for Vercel.
1. Sign up → New Project.
2. Copy the **connection string** (looks like
   `postgres://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`).

(Any Postgres works too — Railway, Render, Supabase's Postgres, or local.)

## 2. Environment variables

Copy `.env.local.example` → `.env.local` (locally) or add these in
**Vercel → Settings → Environment Variables**:

```
DATABASE_URL=postgres://...            # from step 1
JWT_SECRET=<long-random-string>        # e.g. openssl rand -base64 32
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_SETUP_SECRET=<any-secret>        # used once to bootstrap
SETUP_ADMIN_EMAIL=admin@glofihub.com
SETUP_ADMIN_PASSWORD=<your-admin-password>
```

## 3. Create tables + first admin — one click

Start the app (`npm run dev`, or after deploying), then open **once**:

```
http://localhost:3000/api/setup?secret=YOUR_ADMIN_SETUP_SECRET
```
(or `https://your-domain.com/api/setup?secret=...` on production)

This will:
- create all CRM tables (idempotent — safe to re-run), and
- create your first admin from `SETUP_ADMIN_EMAIL` / `SETUP_ADMIN_PASSWORD`.

You should see `{ "ok": true, "schema": "ready", "admin": "Admin created: ..." }`.

> The raw SQL also lives in `lib/schema.ts` if you prefer to run it manually.

## 4. Log in

- Go to `/login` → **Admin** tab → use `SETUP_ADMIN_EMAIL` + `SETUP_ADMIN_PASSWORD`.
- That's your admin credential. 🎉

## 5. Roles

| Role | Created how | Lands on |
| --- | --- | --- |
| **Student (User)** | Self sign-up at `/register` | `/student/dashboard` |
| **Counsellor (Staff)** | Admin → Counsellors → Add Counsellor | `/counsellor/dashboard` |
| **Super Admin** | `/api/setup` (step 3) | `/admin/dashboard` |

Admin has access to everything.

## How it works (no Supabase)

- **DB:** `pg` (node-postgres) via `DATABASE_URL` (`lib/pg.ts`).
- **Auth:** email + bcrypt-hashed password, signed **JWT in an httpOnly cookie**
  (`lib/session.ts`, `lib/actions/auth.ts`). Route protection in `middleware.ts`.
- **Security:** role checks in middleware + every server action/query.
- **Chat & notifications:** in-app, via polling (no phone numbers shared).
- **Payments:** Razorpay not enabled yet (UI shows "coming soon").

## Folder map

```
app/(auth)/      login, register, forgot-password
app/admin/       dashboard, students, counsellors, assignments, payments, analytics, settings
app/counsellor/  dashboard, students, messages
app/student/     dashboard, chat, payments, profile
app/api/         setup, chat/messages, notifications
lib/             pg, schema, session, auth, queries, validations, actions/
middleware.ts    route-level RBAC (JWT)
```
