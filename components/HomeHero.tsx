"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SplitText } from "@/components/react-bits/SplitText";
import { motion } from "framer-motion";
import Link from "next/link";

export function HomeHero() {
  const { t } = useLanguage();
  const focusAreas = [
    t("hero.humanoid"),
    t("hero.imitation"),
    t("hero.policy"),
    t("hero.evaluation"),
  ];

  return (
    <section className="home-hero relative flex min-h-[calc(70svh-4rem)] items-center border-b border-white/[0.08] py-14 sm:min-h-[560px] sm:py-16 lg:min-h-[580px]">
      <div className="page-shell grid gap-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-end">
        <div>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase text-antique/78"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.field")}
          </motion.p>
          <div className="mt-5 overflow-hidden pb-2">
            <SplitText
              className="max-w-5xl text-6xl font-medium leading-none text-white sm:text-8xl lg:text-[6.5rem]"
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
            transition={{ delay: 0.18, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("hero.tagline")}
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm"
            initial={{ opacity: 0, y: 14 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link className="group inline-flex items-center gap-2 text-white transition hover:text-mist" href="/projects">
              {t("hero.explore")}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
            <Link className="group inline-flex items-center gap-2 text-white/52 transition hover:text-white" href="/notes">
              {t("hero.readNotes")}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.1] pt-5 lg:mb-2"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.26, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 text-xs uppercase text-white/34">{t("hero.focus")}</p>
          <div>
            {focusAreas.map((area, index) => (
              <motion.p
                animate={{ opacity: 1, x: 0 }}
                className="border-b border-white/[0.07] py-3 text-sm text-white/62"
                initial={{ opacity: 0, x: -10 }}
                key={area}
                transition={{
                  delay: 0.34 + index * 0.055,
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="mr-3 text-white/24">0{index + 1}</span>
                {area}
              </motion.p>
            ))}
          </div>
        </motion.aside>
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
