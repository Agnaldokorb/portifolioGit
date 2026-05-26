import { Code2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/tecnologias", label: "Tecnologias" },
  { href: "/experiencia", label: "Experiencia" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Agnaldo Korb
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Agnaldokorb"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub de Agnaldo Korb"
            className="inline-flex size-10 items-center justify-center rounded-md border bg-card transition hover:border-primary hover:text-primary"
          >
            <Code2 className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
