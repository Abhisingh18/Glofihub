# GlofiHub — Gateway to Infinite Possibilities

GlofiHub is a modern education & career platform that connects students and
professionals with study-abroad, MBBS, jobs, skills and digital growth services.
Built with **Next.js 16**, **React 19**, **Tailwind CSS v4** and an optional
**Postgre SQL** backend systems.

🔗 **Repo:** https://github.com/Abhisingh18/Glofihub

---

## ✨ Features

- **Premium animated UI** — themed hero, services, portfolios, achievements,
  parent reviews, founder & team, all with scroll-reveal animation.
- **Dedicated pages** — Home, `/services` (full service catalogue), `/about`
  (founder + team), `/admin` (login) and `/admin/dashboard`.
- **Get Started flow** — modal chooser → Student registration form or Admin login.
- **Student lead capture** — submissions are saved to the dashboard **and**
  forwarded to **WhatsApp + email**.
- **Admin dashboard** — view all student enquiries, stats, search & CSV export.
- **Floating contact dock** — one-tap WhatsApp & Call.
- **Watch Our Story** — in-page video player.
- **AI Chatbot** — themed assistant widget.
- **High-level SEO** — rich metadata, Open Graph/Twitter cards, JSON-LD,
  `sitemap.xml`, `robots.txt` and a PWA manifest.
- **Dual-mode storage/auth** — works out of the box with `localStorage` +
  demo login, or with **Supabase** for real cloud data & secure auth.

---

## 🧱 Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, lucide-react |
| Fonts | Sora + Plus Jakarta Sans (next/font) |
| Backend (optional) | Supabase (Postgres + Auth) |
| Email | Web3Forms (with `mailto` fallback) |
| Hosting | Vercel (recommended) |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build && npm start
```

### Environment variables (optional)
Copy `.env.local.example` to `.env.local` and fill in your values:

```
NEXT_PUBLIC_SITE_URL=https://glofihub.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
,,,

Without these the site still works (data saves to the browser's `localStorage`
and admin login uses demo credentials).

---

## 🔐 Admin

- Login page: `/admin`
- Demo credentials: `admin@glofihub.com` · `Glofihub@123`
- Dashboard: `/admin/dashboard`

> For real, cross-device data and secure auth, set up Supabase — see
> [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

---

## 📦 Deployment

Deploy to **Vercel** in a few clicks — full guide in
[`DEPLOY.md`](./DEPLOY.md).

---

## 📁 Project Structure

```
app/            # routes: /, /services, /about, /admin, sitemap, robots, manifest
components/     # UI components (Hero, Services, AllServices, Chatbot, etc.)
lib/            # site config, Supabase client, leads & admin-auth helpers
public/         # images, videos & static assets
```

---

## 📄 License

Proprietary © GlofiHub. All rights reserved.
