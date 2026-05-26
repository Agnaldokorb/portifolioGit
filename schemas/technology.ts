import { z } from "zod";

export const technologySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Informe o nome da tecnologia."),
  category: z.string().trim().min(1, "Informe a categoria."),
  level: z.enum(["iniciante", "intermediario", "avancado", "especialista"]),
  icon: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
      "Use uma URL de imagem começando com http:// ou https://.",
    ),
  isVisible: z.coerce.boolean().default(false),
});

export type TechnologyInput = z.infer<typeof technologySchema>;
