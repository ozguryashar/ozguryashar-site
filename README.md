# ozguryashar.site

Bilingual (TR/EN) Data & Business Intelligence portfolio and blog site for Özgür Yaşar.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase · next-intl · Vercel

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API (secret) |
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://ozguryashar.site` |

### 3. Set up the Supabase database

In your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor, run the contents of:

```
supabase/schema.sql
```

This creates the `posts`, `projects`, and `contact_submissions` tables with Row Level Security policies.

#### Create Storage buckets (Dashboard → Storage)

Create two **public** buckets:
- `blog-images` — for blog post cover images
- `project-images` — for project cover images

Then add RLS policies for each bucket (see commented section in `supabase/schema.sql`).

### 4. Add the first admin user

The admin panel (`/admin`) is protected by Supabase Auth. To create your admin account:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and a strong password
4. Use these credentials to log in at `/admin/login`

> No sign-up form is exposed — only users created in the Dashboard can access the admin panel.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000/tr](http://localhost:3000/tr) — the root `/` redirects to `/tr` automatically.

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Project Structure

```
src/
  app/
    [locale]/          # Public pages (TR/EN) — blog, projects, about, contact
    admin/
      (auth)/login/    # Login page (no auth check)
      (protected)/     # Dashboard, blog CRUD, projects CRUD, messages
    api/
      contact/         # Contact form submission
      admin/           # Admin CRUD API routes (auth required)
  components/
    layout/            # Header, Footer, LocaleSwitcher
    blog/              # BlogCard, BlogList, TableOfContents, ShareButtons
    projects/          # ProjectList, PowerBIEmbed, HomeFeaturedProjects
    contact/           # ContactForm
    admin/             # AdminSidebar, BlogEditor, ProjectEditor, tables
    shared/            # JsonLd, PowerBIEmbed
  lib/
    supabase/          # client.ts, server.ts, queries.ts, admin-queries.ts
    validations/       # Zod schemas
    utils/             # date.ts (formatDate, processContent for TOC)
  messages/
    tr.json            # Turkish translations
    en.json            # English translations
  types/
    index.ts           # Post, Project, ContactSubmission interfaces
supabase/
  schema.sql           # Full DB schema + RLS + storage setup
```

---

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local.example` in **Project Settings → Environment Variables**
4. Deploy — Vercel picks up `vercel.json` automatically

The `vercel.json` sets:
- Region: `iad1` (US East)
- `X-Robots-Tag: noindex` header on all `/admin/*` routes

---

## Features

- **Bilingual routing** — `/tr/*` and `/en/*` with locale switcher
- **Blog** — Markdown content, TOC, tags, search, pagination, share buttons
- **Projects** — Power BI embed (lazy iframe), industry filter, detail pages
- **Contact form** — react-hook-form + Zod validation, rate limiting (1 per email/hour)
- **Admin panel** — Protected by Supabase Auth + middleware; CRUD for posts/projects/messages
- **SEO** — generateMetadata on every page, JSON-LD (Person, WebSite, BlogPosting), sitemap, robots.txt
- **OG image** — Place `/public/og-default.png` (1200×630) for social sharing previews
