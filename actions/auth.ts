"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/schemas/auth";

export type LoginActionState = {
  message?: string;
};

export async function login(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Credenciais invalidas.",
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      message: "Supabase ainda nao foi configurado no ambiente.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      message: "E-mail ou senha invalidos.",
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
