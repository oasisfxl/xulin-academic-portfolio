"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";

type PageIntroProps = {
  descriptionKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
  eyebrowKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
  titleKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
};

export function PageIntro({
  descriptionKey,
  eyebrowKey,
  titleKey,
}: PageIntroProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl">
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-sm uppercase text-antique/72"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {t(eyebrowKey)}
      </motion.p>
      <div className="mt-5 overflow-hidden pb-2">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-medium text-white sm:text-7xl"
          initial={{ opacity: 0, y: "76%" }}
          transition={{ delay: 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t(titleKey)}
        </motion.h1>
      </div>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-lg leading-8 text-white/58"
        initial={{ opacity: 0, y: 14 }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {t(descriptionKey)}
      </motion.p>
    </div>
  );
}
