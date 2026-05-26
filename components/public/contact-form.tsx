"use client";

import { Send } from "lucide-react";
import { useActionState } from "react";
import {
  type ContactActionState,
  sendContactMessage,
} from "@/actions/contact";

const initialState: ContactActionState = {
  ok: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-lg border bg-card p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nome
          <input
            name="name"
            required
            minLength={2}
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-medium">
        Assunto
        <input
          name="subject"
          required
          minLength={3}
          className="rounded-md border bg-background px-3 py-2"
        />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-medium">
        Mensagem
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          className="resize-y rounded-md border bg-background px-3 py-2"
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
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        <Send className="size-4" />
        {pending ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
