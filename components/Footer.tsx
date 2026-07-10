"use client";

import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-white/[0.08]">
      <div className="page-shell flex flex-col gap-5 py-10 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.copyright")}</p>
        <div className="flex gap-5">
          <a
            className="transition hover:text-white"
            href="mailto:xulinfu2002@gmail.com"
          >
            {t("footer.email")}
          </a>
          <a
            className="transition hover:text-white"
            href="https://github.com/oasisfxl"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Link className="transition hover:text-white" href="/projects">
            {t("footer.projects")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
