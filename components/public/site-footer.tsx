import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Agnaldo Korb. Todos os direitos
          reservados.
        </p>
        <div className="flex gap-4">
          <Link href="/admin/login" className="hover:text-primary">
            Admin
          </Link>
          <a
            href="https://github.com/Agnaldokorb"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
