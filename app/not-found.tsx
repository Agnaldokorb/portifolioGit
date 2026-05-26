import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        404
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Pagina nao encontrada</h1>
      <p className="mt-4 text-muted">
        O conteudo que voce tentou acessar nao existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Voltar para a home
      </Link>
    </main>
  );
}
