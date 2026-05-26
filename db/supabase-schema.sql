create extension if not exists "pgcrypto";

do $$ begin
  create type public.technology_level as enum ('iniciante', 'intermediario', 'avancado', 'especialista');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.message_status as enum ('nao_lida', 'lida', 'arquivada');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.blog_comment_status as enum ('pendente', 'aprovado', 'rejeitado');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  headline text not null,
  bio text not null,
  location text not null default 'Brasil',
  email text not null,
  github_url text not null,
  linkedin_url text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  github_id integer unique,
  github_name text,
  slug text not null unique,
  title text not null,
  description text not null,
  language text,
  github_url text,
  deploy_url text,
  stars integer not null default 0,
  forks integer not null default 0,
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  is_manual boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  level public.technology_level not null default 'avancado',
  icon text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  primary key (project_id, technology_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status public.message_status not null default 'nao_lida',
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  content text not null,
  status public.blog_comment_status not null default 'pendente',
  created_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts(is_published);
create index if not exists blog_comments_post_idx on public.blog_comments(post_id);
create index if not exists blog_comments_status_idx on public.blog_comments(status);

grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.technologies to anon, authenticated;
grant select on public.project_technologies to anon, authenticated;
grant select on public.settings to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant select on public.blog_comments to anon, authenticated;

grant insert on public.messages to anon, authenticated;
grant insert on public.blog_comments to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

grant insert, update, delete on public.profiles to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.technologies to authenticated;
grant insert, update, delete on public.project_technologies to authenticated;
grant insert, update, delete on public.settings to authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant update, delete on public.blog_comments to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_comments enable row level security;

drop policy if exists "public can read profile" on public.profiles;
create policy "public can read profile" on public.profiles
  for select using (true);

drop policy if exists "authenticated can manage profile" on public.profiles;
create policy "authenticated can manage profile" on public.profiles
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read visible projects" on public.projects;
create policy "public can read visible projects" on public.projects
  for select using (is_hidden = false);

drop policy if exists "authenticated can manage projects" on public.projects;
create policy "authenticated can manage projects" on public.projects
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read visible technologies" on public.technologies;
create policy "public can read visible technologies" on public.technologies
  for select using (is_visible = true);

drop policy if exists "authenticated can manage technologies" on public.technologies;
create policy "authenticated can manage technologies" on public.technologies
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read project technologies" on public.project_technologies;
create policy "public can read project technologies" on public.project_technologies
  for select using (true);

drop policy if exists "authenticated can manage project technologies" on public.project_technologies;
create policy "authenticated can manage project technologies" on public.project_technologies
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "visitors can create messages" on public.messages;
drop policy if exists "anon can create messages" on public.messages;
drop policy if exists "authenticated can create messages" on public.messages;

create policy "anon can create messages" on public.messages
  for insert to anon
  with check (true);

create policy "authenticated can create messages" on public.messages
  for insert to authenticated
  with check (true);

drop policy if exists "authenticated can read messages" on public.messages;
create policy "authenticated can read messages" on public.messages
  for select to authenticated
  using (true);

drop policy if exists "authenticated can update messages" on public.messages;
create policy "authenticated can update messages" on public.messages
  for update to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated can delete messages" on public.messages;
create policy "authenticated can delete messages" on public.messages
  for delete to authenticated
  using (true);

drop policy if exists "public can read public settings" on public.settings;
create policy "public can read public settings" on public.settings
  for select using (is_public = true);

drop policy if exists "authenticated can manage settings" on public.settings;
create policy "authenticated can manage settings" on public.settings
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read published blog posts" on public.blog_posts;
create policy "public can read published blog posts" on public.blog_posts
  for select using (is_published = true);

drop policy if exists "authenticated can manage blog posts" on public.blog_posts;
create policy "authenticated can manage blog posts" on public.blog_posts
  for all to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read approved blog comments" on public.blog_comments;
create policy "public can read approved blog comments" on public.blog_comments
  for select using (status = 'aprovado');

drop policy if exists "public can create identified blog comments" on public.blog_comments;
create policy "public can create identified blog comments" on public.blog_comments
  for insert to anon, authenticated
  with check (
    length(trim(author_name)) >= 2
    and author_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

drop policy if exists "authenticated can manage blog comments" on public.blog_comments;
create policy "authenticated can manage blog comments" on public.blog_comments
  for all to authenticated
  using (true)
  with check (true);

insert into public.blog_posts (slug, title, excerpt, content, tags, is_published, published_at)
values (
  'arquitetura-nextjs-supabase',
  'Como estruturar um portfolio full-stack moderno',
  'Uma visao pratica sobre Next.js, Supabase, validacao e organizacao de camadas em um portfolio profissional.',
  'Um portfolio profissional precisa ir alem de uma pagina estatica. A arquitetura deve separar interface, dados, validacoes e regras de acesso. Neste projeto, o App Router organiza as rotas publicas e privadas, o Supabase cuida de autenticacao e dados, e o Drizzle oferece uma modelagem tipada para evoluir o banco com seguranca.\n\nO ponto central e manter Server Components como padrao, usar Client Components apenas para interacao e proteger o painel administrativo com validacao de sessao. Comentarios e mensagens podem ser publicos para envio, mas precisam de regras explicitas de seguranca e moderacao no admin.',
  array['Next.js', 'Supabase', 'Arquitetura'],
  true,
  now()
)
on conflict (slug) do nothing;

insert into public.technologies (name, category, level, icon)
values
  ('Next.js', 'Frontend', 'avancado', 'nextjs'),
  ('React', 'Frontend', 'avancado', 'react'),
  ('TypeScript', 'Linguagem', 'avancado', 'typescript'),
  ('TailwindCSS', 'UI', 'avancado', 'tailwind'),
  ('Node.js', 'Backend', 'avancado', 'node'),
  ('Supabase', 'Banco e Auth', 'avancado', 'supabase'),
  ('PostgreSQL', 'Banco de dados', 'avancado', 'postgresql'),
  ('Drizzle ORM', 'ORM', 'intermediario', 'drizzle')
on conflict (name) do nothing;
