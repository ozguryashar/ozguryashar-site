-- ═══════════════════════════════════════════════════════════════════════════
-- ozguryashar.site  –  Supabase Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── POSTS ───────────────────────────────────────────────────────────────────
create table if not exists posts (
  id                 uuid primary key default uuid_generate_v4(),
  title              text        not null,
  slug               text        not null unique,
  content            text        not null default '',
  excerpt            text        not null default '',
  cover_image_url    text,
  tags               text[]      not null default '{}',
  status             text        not null default 'draft' check (status in ('draft','published')),
  published_at       timestamptz,
  read_time_minutes  int         not null default 1,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger posts_updated_at
  before update on posts
  for each row execute procedure update_updated_at();

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
create table if not exists projects (
  id               uuid primary key default uuid_generate_v4(),
  title            text    not null,
  slug             text    not null unique,
  description      text    not null default '',
  cover_image_url  text,
  embed_url        text,
  tags             text[]  not null default '{}',
  industry         text    not null default '',
  is_featured      boolean not null default false,
  is_visible       boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at();

-- ─── CONTACT SUBMISSIONS ─────────────────────────────────────────────────────
create table if not exists contact_submissions (
  id         uuid primary key default uuid_generate_v4(),
  name       text    not null,
  company    text,
  email      text    not null,
  message    text    not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table posts               enable row level security;
alter table projects            enable row level security;
alter table contact_submissions enable row level security;

-- Public can read published posts
create policy "public read published posts"
  on posts for select
  using (status = 'published');

-- Authenticated (admin) can do everything on posts
create policy "admin full access posts"
  on posts for all
  to authenticated
  using (true) with check (true);

-- Public can read visible projects
create policy "public read visible projects"
  on projects for select
  using (is_visible = true);

-- Authenticated can do everything on projects
create policy "admin full access projects"
  on projects for all
  to authenticated
  using (true) with check (true);

-- Anon can insert contact submissions (contact form)
create policy "anon insert contact"
  on contact_submissions for insert
  to anon
  with check (true);

-- Authenticated can read & update contact submissions
create policy "admin read contact"
  on contact_submissions for select
  to authenticated
  using (true);

create policy "admin update contact"
  on contact_submissions for update
  to authenticated
  using (true) with check (true);

create policy "admin delete contact"
  on contact_submissions for delete
  to authenticated
  using (true);

-- ─── STORAGE ─────────────────────────────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage (or via CLI)
-- insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);
-- insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);

-- Storage RLS (authenticated upload, public read)
-- create policy "public read blog images"   on storage.objects for select using (bucket_id = 'blog-images');
-- create policy "admin upload blog images"  on storage.objects for insert to authenticated with check (bucket_id = 'blog-images');
-- create policy "admin delete blog images"  on storage.objects for delete to authenticated using (bucket_id = 'blog-images');
-- create policy "public read project images"  on storage.objects for select using (bucket_id = 'project-images');
-- create policy "admin upload project images" on storage.objects for insert to authenticated with check (bucket_id = 'project-images');
-- create policy "admin delete project images" on storage.objects for delete to authenticated using (bucket_id = 'project-images');

-- ─── SAMPLE DATA (optional) ──────────────────────────────────────────────────
-- insert into posts (title, slug, excerpt, status) values
--   ('İlk Yazı', 'ilk-yazi', 'Bu bir örnek yazı.', 'published');
