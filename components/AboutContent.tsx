"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SplitText } from "@/components/react-bits/SplitText";
import { motion } from "framer-motion";

export function AboutEyebrow() {
  const { t } = useLanguage();

  return <p className="text-sm uppercase text-antique/72">{t("about.eyebrow")}</p>;
}

export function AboutHeading() {
  return (
    <div className="mt-5 overflow-hidden pb-2">
      <SplitText
        className="text-5xl font-medium leading-[1.05] text-white sm:text-7xl"
        delay={72}
        duration={0.78}
        splitType="words"
        tag="h1"
        text="Xulin Fu"
      />
    </div>
  );
}

export function AboutContent() {
  const { t } = useLanguage();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-9 text-lg leading-9 text-white/66"
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: 0.14, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xl leading-10 text-white/78">{t("about.bodyA")}</p>
      <p>{t("about.bodyB")}</p>
      <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/[0.09] bg-white/[0.09] text-sm sm:grid-cols-2">
        <a className="bg-[#101012] p-5 text-white/58 transition hover:bg-[#161619] hover:text-white" href="https://github.com/oasisfxl" rel="noreferrer" target="_blank">
          <span className="block text-xs uppercase text-white/28">GitHub</span>
          <span className="mt-2 block">github.com/oasisfxl ↗</span>
        </a>
        <a className="bg-[#101012] p-5 text-white/58 transition hover:bg-[#161619] hover:text-white" href="mailto:xulinfu2002@gmail.com">
          <span className="block text-xs uppercase text-white/28">Email</span>
          <span className="mt-2 block">xulinfu2002@gmail.com ↗</span>
        </a>
        <p className="bg-[#101012] p-5 text-white/58">
          <span className="block text-xs uppercase text-white/28">Focus</span>
          <span className="mt-2 block">{t("about.focus")}</span>
        </p>
        <p className="bg-[#101012] p-5 text-white/58">
          <span className="block text-xs uppercase text-white/28">Systems</span>
          <span className="mt-2 block">{t("about.systems")}</span>
        </p>
      </div>
    </motion.div>
  );
}
