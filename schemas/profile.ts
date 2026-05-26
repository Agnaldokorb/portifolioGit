import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  headline: z.string().trim().min(3, "Informe o titulo profissional."),
  bio: z.string().trim().min(20, "Informe uma bio mais completa."),
  location: z.string().trim().min(2, "Informe a localizacao."),
  email: z.string().trim().email("Informe um e-mail valido."),
  githubUrl: z.string().trim().url("Informe uma URL valida do GitHub."),
  linkedinUrl: z
    .string()
    .trim()
    .url("Informe uma URL valida do LinkedIn.")
    .optional()
    .or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
