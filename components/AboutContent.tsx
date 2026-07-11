"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";

export function AboutEyebrow() {
  const { t } = useLanguage();

  return <p className="text-sm uppercase text-antique/72">{t("about.eyebrow")}</p>;
}

export function AboutHeading() {
  return (
    <div className="mt-5 overflow-hidden pb-2">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-medium text-white sm:text-7xl"
        initial={{ opacity: 0, y: "76%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Xulin Fu
      </motion.h1>
    </div>
  );
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
