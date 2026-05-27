import { GitFork  } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/public/mobile-menu";

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
            rel="noreferrer noopener"
            aria-label="GitHub de Agnaldo Korb"
            className="p-2 inline-flex size items-center justify-center rounded-md border bg-card transition hover:border-primary hover:text-primary"
          >
            <GitFork className="size-4" /> GitHub
          </a>
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
