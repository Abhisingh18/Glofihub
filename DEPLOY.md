# Deploying GlofiHub to Vercel

This project is a standard Next.js 16 app — Vercel auto-detects everything.

## 1. Push to GitHub
The repo is already at https://github.com/Abhisingh18/Glofihub — just push your latest commits.

## 2. Import into Vercel
1. Go to https://vercel.com → **Add New… → Project**.
2. Import the **Glofihub** GitHub repo.
3. Framework preset: **Next.js** (auto-detected). Build command, output dir — leave default.
4. Click **Deploy**.

## 3. Set Environment Variables
In Vercel → Project → **Settings → Environment Variables**, add (for Production + Preview):

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://glofihub.com` (or the `*.vercel.app` URL) |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Settings → API (optional — falls back to localStorage) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API (optional) |

After adding/changing env vars, **redeploy** so they take effect.

> Without the Supabase vars the site still works — student leads save to the
> browser's localStorage and admin login uses the demo credentials. With them,
> data syncs across devices (see `SUPABASE_SETUP.md`).

## 4. Custom domain (optional)
Vercel → Project → **Settings → Domains** → add `glofihub.com`, then point your
DNS as instructed. Update `NEXT_PUBLIC_SITE_URL` to match and redeploy.

## SEO — what's already wired up
- Rich metadata, Open Graph & Twitter cards (`app/layout.tsx`, `lib/site.ts`)
- JSON-LD structured data (EducationalOrganization + WebSite)
- `app/sitemap.ts` → `/sitemap.xml`
- `app/robots.ts` → `/robots.txt` (admin pages disallowed)
- `app/manifest.ts` → installable PWA manifest
- Per-page titles via the `%s | GlofiHub` template

### After going live
1. Add the site to **Google Search Console** and submit `https://YOUR-DOMAIN/sitemap.xml`.
2. (Optional) Paste your verification code into `metadata.verification.google` in `app/layout.tsx`.
3. Replace the social URLs in `lib/site.ts` with your real profiles.
4. For best link previews, add a real 1200×630 OG image and point `SITE.ogImage` to it.

## Local production check
```bash
npm run build && npm start
```
