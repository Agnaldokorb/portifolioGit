import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail valido."),
  subject: z.string().trim().min(3, "Informe o assunto."),
  message: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(2000, "A mensagem deve ter no maximo 2000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;
