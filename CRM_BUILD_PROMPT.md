# GlofiHub CRM & Counselling Management Platform — Build Prompt

> Paste everything below this line into your coding agent (Cursor / Claude Code / GPT-5).

---

You are building the **authenticated CRM application** on top of an existing,
finished GlofiHub marketing website. Build **production-ready code, not
pseudocode**. Work incrementally, follow the existing conventions, and verify
each phase compiles before moving on.

## 0. NON-NEGOTIABLE CONSTRAINTS

**DO NOT touch, redesign, or refactor the existing landing page or any of its
parts:** `app/page.tsx`, `app/about`, `app/services`, and these components —
`Navbar`, `Hero`, `About`, `Services`, `AllServices`, `Portfolio`,
`ParentReviews`, `Videos`, `Achievements`, `Contact`, `Footer`, `Chatbot`,
`FloatingContact`, `GetStartedModal`, `StudentForm`, `ScrollReveal`,
`ThemeProvider`. Do not change `app/globals.css` theme tokens, the SEO setup
(`app/layout.tsx` metadata, `app/sitemap.ts`, `app/robots.ts`,
`app/manifest.ts`, `lib/site.ts`), or the fonts.

**Build ONLY the post-login app.** Everything new lives under new route groups
and new folders. If a name would collide, prefix new files clearly.

**Scope = Phase 1 only.** Build: auth + roles, profiles, assignments, admin /
counsellor / student dashboards, in-app chat, notes, payments (Razorpay),
notifications, activity logs. **DO NOT build** University, Visa, Flight, or
Enrollment modules — those are Phase 2/3.

## 1. EXISTING CODEBASE CONTEXT (reuse, don't recreate)

- **Stack already in place:** Next.js 16 (App Router, Turbopack), React 19,
  TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`), `lucide-react`,
  `@supabase/supabase-js` v2.
- **Supabase client already exists** at `lib/supabase.ts` — it exports
  `supabase` (client or null) and `isSupabaseConfigured`. **Reuse it.** Create a
  server-side client helper too (for route handlers / middleware) if needed.
- **Existing (to be SUPERSEDED):** `app/admin/page.tsx` (demo login),
  `app/admin/dashboard/page.tsx`, `lib/adminAuth.ts` (hardcoded admin),
  `lib/leads.ts` (localStorage/Supabase `leads` table). Replace the demo admin
  auth with real Supabase Auth + RBAC. Keep the public `StudentForm` lead capture
  working, but migrate admin viewing into the new RBAC admin dashboard. Migrate
  any existing `leads` data into `students` where sensible, or keep `leads` as the
  public top-of-funnel and create a `student` on signup.
- **Theme tokens to reuse** (already defined): CSS vars `--primary` (#0A2F6B),
  `--accent` (#2563EB), `--background`, `--foreground`, `--card`, `--muted`;
  fonts `--font-display` (Sora) and `--font-jakarta`. Match the existing visual
  language: `font-display` headings, mixed-case, green→emerald→teal gradient
  accents, rounded-2xl/3xl cards, `bg-card border border-foreground/10`.
- **Env vars already used:** `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

## 2. ADD THESE DEPENDENCIES

`react-hook-form`, `zod`, `@hookform/resolvers`, `razorpay`,
`@supabase/ssr` (for cookie-based auth in App Router middleware/server).
Set up **shadcn/ui** (Tailwind v4 compatible setup) for the dashboard UI
primitives only — do not restyle the landing page with it.

New env vars (add to `.env.local.example` and document):
```
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never NEXT_PUBLIC
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=              # server-only
NEXT_PUBLIC_RAZORPAY_KEY_ID=     # public key id for checkout
```

## 3. ROLES & RBAC

Three roles: `super_admin`, `counsellor`, `student`. Use Supabase Auth
(email/password). Store `role` on the `users` table (mirrored from
`auth.users`). Enforce RBAC in **three layers**: middleware (route gate),
server route handlers (action gate), and Postgres **RLS** (data gate).

## 4. ROUTES

```
/login
/register            # self-serve student signup; admin/counsellor created by admin
/forgot-password
/admin/...           # super_admin only
/counsellor/...      # counsellor only
/student/...         # student only
```
Add `middleware.ts`: unauthenticated → `/login`; authenticated but wrong role →
that user's own dashboard. After login redirect by role:
admin → `/admin/dashboard`, counsellor → `/counsellor/dashboard`,
student → `/student/dashboard`. Use route groups, e.g. `app/(crm)/...`, so the
landing-page routes stay untouched.

## 5. DATABASE SCHEMA (generate full SQL + types)

Tables (Postgres / Supabase). Use `uuid` PKs (`gen_random_uuid()`), `timestamptz`
defaults, and FKs. Generate a single migration SQL file.

```
users               id, full_name, email, role, phone, profile_image, created_at
students            id, user_id→users, city, country_interest, education_level,
                    status, assigned_counsellor_id→counsellors, created_at
counsellors         id, user_id→users, department, active, created_at
student_assignments id, student_id, counsellor_id, assigned_by, assigned_at
conversations       id, student_id, counsellor_id, created_at    # 1:1 thread
messages            id, conversation_id, sender_id, receiver_id, message,
                    read_status, created_at
payments            id, student_id, amount, payment_status,
                    razorpay_order_id, razorpay_payment_id, payment_type, created_at
notes               id, student_id, counsellor_id, note, created_at
activity_logs       id, user_id, activity, meta jsonb, created_at
notifications       id, user_id, type, title, body, read, created_at
```

Student `status` enum (with colored badges in UI):
`new_lead, contacted, interested, follow_up, paid, active, converted, closed`.
Payment `payment_type`: `registration_fee, counselling_fee, premium_package`.
`payment_status`: `created, paid, failed`.

## 6. RLS POLICIES (generate, this is critical)

- **students**: a student row is readable/updatable by its own `user_id`; by the
  assigned counsellor; by any super_admin.
- **counsellors**: self read; super_admin full.
- **messages/conversations**: only the two participants (sender/receiver) of a
  conversation, plus super_admin.
- **notes**: only the assigned counsellor + super_admin. **Never the student.**
- **payments**: the owning student + super_admin (counsellor read-only for
  assigned students).
- **activity_logs / notifications**: own user + super_admin.
- Admin-only writes (create counsellor, assign) go through server routes using
  the **service role key**, never the anon client.

## 7. PHONE-NUMBER PRIVACY (hard requirement)

The chat and all profile views must **never** expose phone numbers across roles:
- Student must never see counsellor phone; counsellor must never see student
  phone. Only super_admin sees phones.
- Enforce by (a) never selecting `phone` in cross-role queries, and (b) a
  Postgres view / column-masking or RLS that excludes `phone` for non-admin,
  non-owner reads. All counselling communication happens **in-app only** —
  **no WhatsApp, no `tel:` / `wa.me` links anywhere in the CRM.**

## 8. ADMIN DASHBOARD (`/admin`)

Sidebar: Dashboard · Students · Counsellors · Payments · Assignments ·
Analytics · Settings.

Stat cards: Total Students · Total Counsellors · Active Leads · Paid Students ·
Total Revenue · Pending Payments.

Charts: Monthly Leads · Monthly Revenue · Counsellor Performance.

Admin can: create / edit / deactivate / delete counsellor; assign & reassign
students to any counsellor; view all students (search, filter by status); open a
student profile (activity, payment history, assigned counsellor, chat history,
status); change status (colored badges); track counsellor performance (assigned
students, active students, messages sent, revenue generated). Full audit trail
from `activity_logs`.

## 9. COUNSELLOR DASHBOARD (`/counsellor`)

Sees **only assigned students** (enforced by RLS, not just UI). Features:
assigned-students list, student details, add private notes, update student
status, view payment status (read-only), in-app chat with assigned students,
activity history. Stat cards for their own numbers.

## 10. STUDENT DASHBOARD (`/student`)

Student can: update profile, view assigned counsellor (name/department only — no
phone), chat with assigned counsellor, make payment (Razorpay), view payment
history + invoice, view notifications, view counselling status. Cannot see notes.

## 11. IN-APP CHAT (Supabase Realtime)

Real-time messaging with: unread count, seen/read status, typing indicator,
message timestamps, and notification on new message. Allowed pairs only:
Student ↔ assigned Counsellor, Admin ↔ Counsellor, Admin ↔ Student. Use one
`conversations` row per pair; subscribe to `messages` via Realtime channels;
mark `read_status` on view. No phone numbers exposed.

## 12. PAYMENTS (Razorpay)

Server route `POST /api/payments/order` creates a Razorpay order (service-side
secret). Client opens Razorpay Checkout with `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
Server route `POST /api/payments/verify` verifies the signature
(`razorpay_order_id|razorpay_payment_id` HMAC with secret), then writes the
`payments` row + updates student `status` to `paid` + logs activity +
notification. Payment types: registration, counselling, premium. Generate a
simple invoice view. Admin revenue analytics: today / monthly revenue, pending.

## 13. NOTES · NOTIFICATIONS · ACTIVITY

- **Notes:** counsellor-private (admin + assigned counsellor only).
- **Notifications center:** New Student Registered, New Payment Received, New
  Message, Student Assigned, Status Updated. Realtime unread badge.
- **Activity logs:** record student registered, counsellor assigned, message
  sent, payment completed, status changed — with timestamp + actor.

## 14. QUALITY BAR

- Validate every form/input with **Zod** + **React Hook Form**.
- Secure all API route handlers (auth check + role check + Zod parse).
- Loading states, empty states, and error handling on every data view.
- Responsive + dark-mode ready, reusing existing theme tokens. SaaS-grade polish.
- Strong TypeScript types generated from the Supabase schema (`lib/database.types.ts`).

## 15. DELIVERABLES (produce all of these)

1. Complete new folder structure (route groups, components, lib, api).
2. Supabase schema migration SQL (all tables + enums + indexes).
3. RLS policies SQL (every table, per the rules above).
4. Auth flow (login/register/forgot) + `middleware.ts` + server/client Supabase
   helpers using `@supabase/ssr`.
5. Admin, Counsellor, Student dashboard pages + shared layout/sidebar.
6. `lib/database.types.ts` (generated types) and Zod schemas.
7. API route handlers (assignments, counsellor CRUD, payments order/verify,
   messages, status changes) — all RBAC-guarded.
8. Realtime chat implementation.
9. Razorpay integration (order + verify + invoice).
10. `CRM_SETUP.md` — env vars, SQL run order, Razorpay setup, and Vercel
    deployment instructions. Update `.env.local.example`.

## 16. PHASE 1 ROADMAP (build in this order, verify each step)

- **Step 1 — Auth & roles:** Supabase Auth, `users` table + role, login/register/
  forgot, middleware, role-based redirect, RLS baseline.
- **Step 2 — Profiles & assignment:** student profile, counsellor CRUD (admin),
  assign/reassign, admin dashboard shell + stat cards.
- **Step 3 — Chat, notes, notifications:** Realtime chat, private notes,
  notification center, activity logs.
- **Step 4 — Payments & analytics:** Razorpay order/verify, invoices, revenue
  dashboard, reports.

Begin with Step 1. After each step, confirm `npm run build` passes and the
landing page is completely unaffected.
