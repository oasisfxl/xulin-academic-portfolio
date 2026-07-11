"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";

export function HomeHero() {
  const { t } = useLanguage();
  const focusAreas = [
    t("hero.humanoid"),
    t("hero.imitation"),
    t("hero.policy"),
    t("hero.evaluation"),
  ];

  return (
    <section className="page-shell flex flex-col justify-center pb-3 pt-10 sm:pb-5 sm:pt-14">
      <motion.p
        className="text-sm uppercase text-antique/72"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {t("hero.field")}
      </motion.p>
      <div className="mt-3 overflow-hidden pb-2">
        <motion.h1
          className="max-w-5xl text-6xl font-medium leading-none text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: "72%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          Xulin Fu
        </motion.h1>
      </div>
      <motion.div
        className="mt-4 grid gap-5 border-t border-white/[0.08] pt-5 md:grid-cols-[minmax(0,1.18fr)_0.82fr] md:items-start"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="max-w-2xl text-balance text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
          {t("hero.tagline")}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/48 md:justify-end">
          {focusAreas.map((area, index) => (
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 8 }}
              key={area}
              transition={{
                delay: 0.28 + index * 0.045,
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {area}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
