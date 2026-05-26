CREATE TYPE "public"."blog_comment_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "blog_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"content" text NOT NULL,
	"status" "blog_comment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_comments_post_idx" ON "blog_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_comments_status_idx" ON "blog_comments" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("is_published");--> statement-breakpoint
GRANT SELECT ON "blog_posts" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "blog_comments" TO "anon", "authenticated";--> statement-breakpoint
GRANT INSERT ON "blog_comments" TO "anon", "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "blog_posts" TO "authenticated";--> statement-breakpoint
GRANT UPDATE, DELETE ON "blog_comments" TO "authenticated";--> statement-breakpoint
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "blog_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "public can read published blog posts" ON "blog_posts" FOR SELECT USING (is_published = true);--> statement-breakpoint
CREATE POLICY "authenticated can manage blog posts" ON "blog_posts" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "public can read approved blog comments" ON "blog_comments" FOR SELECT USING (status = 'approved');--> statement-breakpoint
CREATE POLICY "public can create identified blog comments" ON "blog_comments" FOR INSERT TO "anon", "authenticated" WITH CHECK (length(trim(author_name)) >= 2 and author_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');--> statement-breakpoint
CREATE POLICY "authenticated can manage blog comments" ON "blog_comments" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
INSERT INTO "blog_posts" ("slug", "title", "excerpt", "content", "tags", "is_published", "published_at")
VALUES (
  'arquitetura-nextjs-supabase',
  'Como estruturar um portfolio full-stack moderno',
  'Uma visao pratica sobre Next.js, Supabase, validacao e organizacao de camadas em um portfolio profissional.',
  'Um portfolio profissional precisa ir alem de uma pagina estatica. A arquitetura deve separar interface, dados, validacoes e regras de acesso. Neste projeto, o App Router organiza as rotas publicas e privadas, o Supabase cuida de autenticacao e dados, e o Drizzle oferece uma modelagem tipada para evoluir o banco com seguranca.\n\nO ponto central e manter Server Components como padrao, usar Client Components apenas para interacao e proteger o painel administrativo com validacao de sessao. Comentarios e mensagens podem ser publicos para envio, mas precisam de regras explicitas de seguranca e moderacao no admin.',
  array['Next.js', 'Supabase', 'Arquitetura'],
  true,
  now()
)
ON CONFLICT ("slug") DO NOTHING;
