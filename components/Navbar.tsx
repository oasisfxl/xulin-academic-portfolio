"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/publications", labelKey: "nav.publications" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/notes", labelKey: "nav.notes" },
  { href: "/about", labelKey: "nav.about" },
] as const;

const spring = {
  type: "spring",
  stiffness: 430,
  damping: 34,
  mass: 0.8,
} as const;

const languageLabels = {
  en: "中",
  zh: "EN",
} as const;

const languageAria = {
  en: "Switch to Chinese",
  zh: "Switch to English",
} as const;

const languageTitle = {
  en: "中文",
  zh: "English",
} as const;

export function Navbar() {
  const pathname = usePathname();
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-graphite-950/70 backdrop-blur-xl">
      <nav className="page-shell flex h-16 items-center justify-between">
        <Link
          className="text-sm font-medium text-white transition hover:text-mist"
          href="/"
        >
          Xulin Fu
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                className="relative isolate whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs text-white/58 transition hover:text-white sm:text-sm"
                href={item.href}
                key={item.href}
              >
                {active ? (
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.115] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_28px_rgba(170,183,207,0.16)]"
                    layoutId="liquid-nav-cursor"
                    transition={spring}
                  >
                    <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_55%)]" />
                  </motion.span>
                ) : null}
                <span className={active ? "text-white" : undefined}>
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
          <span className="mx-1 h-4 w-px bg-white/12" />
          <button
            aria-label={languageAria[language]}
            className="relative rounded-full px-3 py-1.5 text-xs text-white/62 transition hover:bg-white/[0.08] hover:text-white sm:text-sm"
            title={languageTitle[language]}
            type="button"
            onClick={toggleLanguage}
          >
            {languageLabels[language]}
          </button>
        </div>
      </nav>
    </header>
  );
}
