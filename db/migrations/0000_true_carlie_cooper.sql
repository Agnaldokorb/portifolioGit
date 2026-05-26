CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('unread', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."technology_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "message_status" DEFAULT 'unread' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"headline" text NOT NULL,
	"bio" text NOT NULL,
	"location" text DEFAULT 'Brasil' NOT NULL,
	"email" text NOT NULL,
	"github_url" text NOT NULL,
	"linkedin_url" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_technologies" (
	"project_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	CONSTRAINT "project_technologies_project_id_technology_id_pk" PRIMARY KEY("project_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" integer,
	"github_name" text,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"language" text,
	"github_url" text,
	"deploy_url" text,
	"stars" integer DEFAULT 0 NOT NULL,
	"forks" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"is_manual" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"level" "technology_level" DEFAULT 'advanced' NOT NULL,
	"icon" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_auth_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_github_id_idx" ON "projects" USING btree ("github_id") WHERE "projects"."github_id" is not null;--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "settings_public_idx" ON "settings" USING btree ("is_public");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_name_idx" ON "technologies" USING btree ("name");--> statement-breakpoint
GRANT USAGE ON SCHEMA "public" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "profiles" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "projects" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "technologies" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "project_technologies" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT ON "settings" TO "anon", "authenticated";--> statement-breakpoint
GRANT INSERT ON "messages" TO "anon", "authenticated";--> statement-breakpoint
GRANT SELECT, UPDATE, DELETE ON "messages" TO "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "profiles" TO "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "projects" TO "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "technologies" TO "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "project_technologies" TO "authenticated";--> statement-breakpoint
GRANT INSERT, UPDATE, DELETE ON "settings" TO "authenticated";--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "technologies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "project_technologies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "public can read profile" ON "profiles" FOR SELECT USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can manage profile" ON "profiles" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "public can read visible projects" ON "projects" FOR SELECT USING (is_hidden = false);--> statement-breakpoint
CREATE POLICY "authenticated can manage projects" ON "projects" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "public can read visible technologies" ON "technologies" FOR SELECT USING (is_visible = true);--> statement-breakpoint
CREATE POLICY "authenticated can manage technologies" ON "technologies" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "public can read project technologies" ON "project_technologies" FOR SELECT USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can manage project technologies" ON "project_technologies" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon can create messages" ON "messages" FOR INSERT TO "anon" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can create messages" ON "messages" FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can read messages" ON "messages" FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can update messages" ON "messages" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can delete messages" ON "messages" FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "public can read public settings" ON "settings" FOR SELECT USING (is_public = true);--> statement-breakpoint
CREATE POLICY "authenticated can manage settings" ON "settings" FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
INSERT INTO "technologies" ("name", "category", "level", "icon")
VALUES
  ('Next.js', 'Frontend', 'advanced', 'nextjs'),
  ('React', 'Frontend', 'advanced', 'react'),
  ('TypeScript', 'Linguagem', 'advanced', 'typescript'),
  ('TailwindCSS', 'UI', 'advanced', 'tailwind'),
  ('Node.js', 'Backend', 'advanced', 'node'),
  ('Supabase', 'Banco e Auth', 'advanced', 'supabase'),
  ('PostgreSQL', 'Banco de dados', 'advanced', 'postgresql'),
  ('Drizzle ORM', 'ORM', 'intermediate', 'drizzle')
ON CONFLICT ("name") DO NOTHING;
