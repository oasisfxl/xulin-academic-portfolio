"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { FolderLink } from "@/components/react-bits/FolderLink";
import { OptionWheel } from "@/components/react-bits/OptionWheel";
import { SplitText } from "@/components/react-bits/SplitText";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function HomeHero() {
  const { language, t } = useLanguage();
  const focusAreas = useMemo(
    () => [
      t("hero.embodied"),
      t("hero.robotLearning"),
      t("hero.humanoid"),
      t("hero.imitation"),
      t("hero.vla"),
      t("hero.diffusion"),
    ],
    [t]
  );

  return (
    <section className="home-hero relative flex min-h-[calc(88svh-4rem)] items-center overflow-hidden border-b border-white/[0.08] py-12 sm:min-h-[600px] sm:py-14">
      <div className="page-shell grid items-center gap-5 lg:grid-cols-[minmax(0,0.57fr)_minmax(360px,0.43fr)] lg:gap-3">
        <div className="relative z-10">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium uppercase text-antique/82 sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.field")}
          </motion.p>
          <div className="mt-5 overflow-hidden pb-2">
            <SplitText
              className="max-w-4xl text-6xl font-medium leading-none text-white sm:text-8xl lg:text-[6.1rem]"
              delay={76}
              duration={0.86}
              splitType="words"
              tag="h1"
              text="Xulin Fu"
            />
          </div>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 max-w-2xl text-balance text-lg leading-8 text-white/68 sm:text-xl sm:leading-9"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.3, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.tagline")}
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid max-w-xl grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2"
            initial={{ opacity: 0, y: 14 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <FolderLink
              color="#8795aa"
              href="/projects"
              label={t("hero.explore")}
              meta={language === "zh" ? "项目档案" : "Project archive"}
            />
            <FolderLink
              color="#9d9aaf"
              href="/notes"
              label={t("hero.readNotes")}
              meta={language === "zh" ? "工作笔记" : "Working notes"}
            />
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative -mx-5 h-[250px] min-w-0 sm:mx-0 sm:h-[420px] lg:h-[500px]"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ delay: 0.22, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pointer-events-none absolute left-7 top-5 z-10 text-xs font-medium uppercase text-white/48 sm:left-[72px] sm:top-8 sm:text-sm">
            {t("hero.focus")}
          </span>
          <OptionWheel
            activeColor="#f2f3f6"
            blur={0.85}
            className="h-full w-full"
            curve={0.88}
            defaultSelected={2}
            fade={0.18}
            fontSize={language === "zh" ? 2.25 : 2.05}
            inset={72}
            items={focusAreas}
            minOpacity={0.1}
            smoothing={210}
            spacing={1.42}
            textColor="#6e737d"
            tilt={7}
          />
          <span className="pointer-events-none absolute inset-x-[12%] bottom-[10%] h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
        </motion.div>
      </div>
      <motion.span
        animate={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-mist/50 via-white/10 to-transparent"
        initial={{ scaleX: 0 }}
        transition={{ delay: 0.38, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  );
}
