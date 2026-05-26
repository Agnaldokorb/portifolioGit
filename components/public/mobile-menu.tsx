"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MobileMenuLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  links: MobileMenuLink[];
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex size-10 items-center justify-center rounded-md border bg-card text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-md border bg-background shadow-xl shadow-black/10"
        >
          <div className="flex flex-col p-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
