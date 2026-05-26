# Portfolio Agnaldo Korb

Portfolio profissional em Next.js App Router com area publica, admin protegido por Supabase Auth, banco PostgreSQL no Supabase, Drizzle ORM, Zod, TailwindCSS v4 e integracao com a GitHub REST API.

## Arquitetura

- `app/(public)`: rotas publicas com Server Components e cache/revalidate.
- `app/admin`: dashboard privado protegido por proxy/middleware e Supabase Auth.
- `actions`: Server Actions para login, logout, contato e manutencao do admin.
- `lib/supabase`: clientes Supabase SSR/browser sem expor service role key.
- `lib/github`: cliente isolado da GitHub REST API com cache e fallback de erro.
- `lib/portfolio`: agregacao de GitHub + curadoria manual do banco.
- `db`: schema Drizzle, cliente PostgreSQL e SQL inicial com RLS.
- `schemas`: validacoes Zod.
- `types`: contratos TypeScript da aplicacao.
- `components/public` e `components/admin`: componentes separados por contexto.

## Instalacao

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Crie um projeto no Supabase.
2. Copie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para `.env.local`.
3. Copie a `service_role key` para `SUPABASE_SERVICE_ROLE_KEY`. Ela e usada apenas no servidor para o CRUD admin protegido por login.
4. Copie a connection string PostgreSQL para `DATABASE_URL`.
5. Execute o conteudo de `db/supabase-schema.sql` no SQL Editor do Supabase.
6. Crie o usuario administrador em Authentication > Users.
7. Faca login em `/admin/login`.

Nunca use `service_role` no frontend. Este projeto usa a anon key no publico e usa `SUPABASE_SERVICE_ROLE_KEY` somente em arquivos `server-only`, depois de validar a sessao do admin.

## Drizzle ORM

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

O schema TypeScript esta em `db/schema.ts`. O SQL manual em `db/supabase-schema.sql` inclui RLS e seeds iniciais.

## GitHub API

A area publica busca automaticamente:

```text
https://api.github.com/users/Agnaldokorb/repos
```

Campos exibidos: nome, descricao, linguagem, stars, forks, GitHub, deploy e atualizacao. Configure `GITHUB_TOKEN` opcionalmente para maior limite de rate limit.

## Seguranca

- RLS habilitado em todas as tabelas publicas.
- Admin protegido por `proxy.ts`, a convencao atual do Next.js para middleware.
- Server Actions validam dados com Zod.
- Mensagens sao inseridas por visitantes, mas lidas apenas por usuarios autenticados.
- Service role key fica restrita ao servidor para o CRUD admin.
- GitHub fetch tem cache de 1 hora e tratamento de falha.

## Deploy Vercel

- Configure as variaveis de ambiente na Vercel.
- Use Supabase com URL publica e anon key.
- Execute o SQL de producao no Supabase antes do primeiro deploy.
- Configure `NEXT_PUBLIC_SITE_URL` com a URL final.
- Rode `npm run lint`, `npm test` e `npm run build` antes de promover.

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run format
```
