"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";

export function HomeFeaturedHeader() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mb-4 border-b border-white/[0.08] pb-5"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-medium text-white">
        {t("homeProjects.title")}
      </h2>
    </motion.div>
  );
}
