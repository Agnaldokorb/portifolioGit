import Link from "next/link";
import { logout } from "@/actions/auth";

const links = [
  { href: "/admin", label: "Resumo" },
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/monitoramento", label: "Monitoramento" },
  { href: "/admin/tecnologias", label: "Tecnologias" },
  { href: "/admin/perfil", label: "Perfil" },
  { href: "/admin/mensagens", label: "Mensagens" },
];

export function AdminNav() {
  return (
    <aside className="border-b bg-card md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="p-4">
        <Link href="/admin" className="font-semibold">
          Admin Agnaldo
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 text-sm md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-muted transition hover:bg-background hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md px-3 py-2 text-left text-muted transition hover:bg-background hover:text-primary"
          >
            Sair
          </button>
        </form>
      </nav>
    </aside>
  );
}
