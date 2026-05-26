import { z } from "zod";

export const blogPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Informe o titulo."),
  excerpt: z.string().trim().min(10, "Informe um resumo."),
  content: z.string().trim().min(20, "Informe o conteudo do artigo."),
  coverImage: z.string().trim().url().optional().or(z.literal("")),
  tags: z.string().trim().optional(),
  isPublished: z.coerce.boolean().default(false),
});

export const blogCommentSchema = z.object({
  postId: z.string().uuid(),
  authorName: z
    .string()
    .trim()
    .min(2, "Informe seu nome de usuario.")
    .max(80),
  authorEmail: z.string().trim().email("Informe um e-mail valido."),
  content: z
    .string()
    .trim()
    .min(3, "Escreva um comentario.")
    .max(1200, "Comentario muito longo."),
});

export const blogCommentStatusSchema = z.enum([
  "pendente",
  "aprovado",
  "rejeitado",
]);
