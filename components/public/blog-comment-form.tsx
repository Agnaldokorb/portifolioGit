"use client";

import { useActionState } from "react";
import {
  type BlogCommentActionState,
  createBlogComment,
} from "@/actions/blog";

const initialState: BlogCommentActionState = {
  ok: false,
  message: "",
};

export function BlogCommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(
    createBlogComment,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-lg border bg-card p-5">
      <input type="hidden" name="postId" value={postId} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nome de usuario
          <input
            name="authorName"
            required
            minLength={2}
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          E-mail
          <input
            name="authorEmail"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-medium">
        Comentario
        <textarea
          name="content"
          required
          minLength={3}
          rows={5}
          className="rounded-md border bg-background px-3 py-2"
        />
      </label>
      {state.message ? (
        <p
          className={`mt-4 text-sm ${state.ok ? "text-primary" : "text-red-500"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar comentario"}
      </button>
    </form>
  );
}
