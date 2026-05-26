"use client";

import { useActionState } from "react";
import { login, type LoginActionState } from "@/actions/auth";

const initialState: LoginActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border bg-card p-6"
      >
        <h1 className="text-2xl font-semibold">Entrar no admin</h1>
        <p className="mt-2 text-sm text-muted">
          Use um usuario criado no Supabase Auth.
        </p>
        <label className="mt-6 grid gap-2 text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium">
          Senha
          <input
            name="password"
            type="password"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        {state.message ? (
          <p className="mt-4 text-sm text-red-500" role="status">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
