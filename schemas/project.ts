import { z } from "zod";

export const projectPreferenceSchema = z.object({
  githubId: z.coerce.number().int().positive(),
  githubName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  language: z.string().optional().nullable(),
  githubUrl: z.string().url(),
  deployUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
  isHidden: z.coerce.boolean().default(false),
});

export const manualProjectSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(1, "Informe a descricao do projeto."),
  language: z.string().trim().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  deployUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
  isHidden: z.coerce.boolean().default(false),
});

export const projectUpdateSchema = manualProjectSchema.extend({
  id: z.string().uuid(),
});
