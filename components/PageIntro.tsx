"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SplitText } from "@/components/react-bits/SplitText";
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
    <div className="grid gap-8 border-b border-white/[0.1] pb-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-end">
      <div>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase text-antique/78"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {t(eyebrowKey)}
        </motion.p>
        <div className="mt-5 overflow-hidden pb-2">
          <SplitText
            className="text-5xl font-medium leading-[1.05] text-white sm:text-7xl"
            delay={t(titleKey).match(/[\u3400-\u9fff]/) ? 48 : 72}
            duration={0.76}
            splitType={t(titleKey).match(/[\u3400-\u9fff]/) ? "chars" : "words"}
            tag="h1"
            text={t(titleKey)}
          />
        </div>
      </div>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl text-base leading-8 text-white/58 lg:pb-2"
        initial={{ opacity: 0, y: 14 }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {t(descriptionKey)}
      </motion.p>
    </div>
  );
}
