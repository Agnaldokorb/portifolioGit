ALTER TYPE "public"."technology_level" RENAME VALUE 'beginner' TO 'iniciante';--> statement-breakpoint
ALTER TYPE "public"."technology_level" RENAME VALUE 'intermediate' TO 'intermediario';--> statement-breakpoint
ALTER TYPE "public"."technology_level" RENAME VALUE 'advanced' TO 'avancado';--> statement-breakpoint
ALTER TYPE "public"."technology_level" RENAME VALUE 'expert' TO 'especialista';--> statement-breakpoint
ALTER TYPE "public"."message_status" RENAME VALUE 'unread' TO 'nao_lida';--> statement-breakpoint
ALTER TYPE "public"."message_status" RENAME VALUE 'read' TO 'lida';--> statement-breakpoint
ALTER TYPE "public"."message_status" RENAME VALUE 'archived' TO 'arquivada';--> statement-breakpoint
ALTER TYPE "public"."blog_comment_status" RENAME VALUE 'pending' TO 'pendente';--> statement-breakpoint
ALTER TYPE "public"."blog_comment_status" RENAME VALUE 'approved' TO 'aprovado';--> statement-breakpoint
ALTER TYPE "public"."blog_comment_status" RENAME VALUE 'rejected' TO 'rejeitado';--> statement-breakpoint
DROP POLICY IF EXISTS "public can read approved blog comments" ON "blog_comments";--> statement-breakpoint
CREATE POLICY "public can read approved blog comments" ON "blog_comments" FOR SELECT USING (status = 'aprovado');
