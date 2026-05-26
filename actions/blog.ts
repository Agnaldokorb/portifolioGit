"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { blogCommentSchema } from "@/schemas/blog";

export type BlogCommentActionState = {
  ok: boolean;
  message: string;
};

export async function createBlogComment(
  _previousState: BlogCommentActionState,
  formData: FormData,
): Promise<BlogCommentActionState> {
  const parsed = blogCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Comentario invalido.",
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase ainda nao foi configurado.",
    };
  }

  const { error } = await supabase.from("blog_comments").insert({
    post_id: parsed.data.postId,
    author_name: parsed.data.authorName,
    author_email: parsed.data.authorEmail,
    content: parsed.data.content,
  });

  if (error) {
    return {
      ok: false,
      message:
        process.env.NODE_ENV === "development"
          ? `Erro Supabase: ${error.message}`
          : "Nao foi possivel publicar o comentario.",
    };
  }

  revalidatePath("/blog");

  return {
    ok: true,
    message: "Comentario enviado para moderacao.",
  };
}
