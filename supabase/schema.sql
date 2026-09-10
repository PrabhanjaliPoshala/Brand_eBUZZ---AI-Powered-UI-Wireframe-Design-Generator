-- Supabase schema for Automated Web Design Assistant
-- Uses the public anon key from the client with RLS enabled on every table.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'user' check (role in ('user', 'designer', 'admin')),
  avatar text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  domain text not null default 'general',
  devices text[] not null default array['desktop']::text[],
  requirement text not null default '',
  brand_preset jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'generated', 'exported')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  name text not null,
  slug text not null,
  elements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wireframes (
  id uuid primary key default uuid_generate_v4(),
  project_id text not null references public.projects(id) on delete cascade,
  elements jsonb not null default '[]'::jsonb,
  device text not null default 'desktop',
  mode text not null default 'wireframe',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.versions (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  version_number integer not null,
  title text not null,
  description text not null default '',
  elements jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  section_id text,
  section_title text,
  content text not null,
  resolved boolean not null default false,
  parent_id text references public.comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  project_id text references public.projects(id) on delete set null,
  event_type text not null,
  project_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  action text not null,
  project_name text,
  status text not null default 'success',
  details text,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists pages_project_id_idx on public.pages(project_id);
create index if not exists versions_project_id_idx on public.versions(project_id);
create index if not exists comments_project_id_idx on public.comments(project_id);
create index if not exists analytics_project_id_idx on public.analytics(project_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.wireframes enable row level security;
alter table public.versions enable row level security;
alter table public.comments enable row level security;
alter table public.analytics enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create policy "profiles read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own or admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());
create policy "profiles insert own" on public.profiles
  for insert with check (id = auth.uid());

create policy "projects read own or admin" on public.projects
  for select using (user_id = auth.uid() or public.is_admin());
create policy "projects insert own" on public.projects
  for insert with check (user_id = auth.uid());
create policy "projects update own or admin" on public.projects
  for update using (user_id = auth.uid() or public.is_admin());
create policy "projects delete own or admin" on public.projects
  for delete using (user_id = auth.uid() or public.is_admin());

create policy "pages access through project" on public.pages
  for all using (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())));
create policy "wireframes access through project" on public.wireframes
  for all using (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())));
create policy "versions access through project" on public.versions
  for all using (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())));
create policy "comments access through project" on public.comments
  for all using (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.projects p where p.id = project_id and (p.user_id = auth.uid() or public.is_admin())));

create policy "analytics own or admin" on public.analytics
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "audit logs admin only" on public.audit_logs
  for select using (public.is_admin());

-- Keep profile rows synchronized for new Supabase Auth users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
