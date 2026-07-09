"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-graphite-950/78 backdrop-blur-xl">
      <nav className="page-shell flex h-16 items-center justify-between">
        <Link
          className="text-sm font-medium text-white transition hover:text-mist"
          href="/"
        >
          Xulin Fu
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/[0.07] bg-white/[0.025] p-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-white/54 transition hover:text-white sm:text-sm",
                  active && "bg-white/[0.08] text-white"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
