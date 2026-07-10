"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function AboutEyebrow() {
  const { t } = useLanguage();

  return <p className="text-sm uppercase text-antique/72">{t("about.eyebrow")}</p>;
}

export function AboutContent() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 text-lg leading-9 text-white/64">
      <p>{t("about.bodyA")}</p>
      <p>{t("about.bodyB")}</p>
      <div className="grid gap-4 border-t border-white/[0.08] pt-8 text-base text-white/58 sm:grid-cols-2">
        <p>GitHub: github.com/oasisfxl</p>
        <p>Email: xulinfu2002@gmail.com</p>
        <p>{t("about.focus")}</p>
        <p>{t("about.systems")}</p>
      </div>
    </div>
  );
}
