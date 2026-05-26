"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contactSchema } from "@/schemas/contact";

export type ContactActionState = {
  ok: boolean;
  message: string;
};

export async function sendContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase ainda nao foi configurado no ambiente.",
    };
  }

  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Failed to insert contact message", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return {
      ok: false,
      message:
        process.env.NODE_ENV === "development"
          ? `Erro Supabase: ${error.message}`
          : "Nao foi possivel enviar a mensagem. Tente novamente.",
    };
  }

  return {
    ok: true,
    message: "Mensagem enviada com sucesso.",
  };
}
