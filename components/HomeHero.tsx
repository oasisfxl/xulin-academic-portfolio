"use client";

import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section className="page-shell flex flex-col justify-center py-7 sm:py-8">
      <motion.p
        className="text-sm uppercase text-antique/72"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Embodied Intelligence / Robot Learning
      </motion.p>
      <motion.h1
        className="mt-4 max-w-5xl text-5xl font-medium leading-none text-white sm:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
      >
        Xulin Fu
      </motion.h1>
      <motion.div
        className="mt-5 grid gap-5 border-t border-white/[0.08] pt-5 md:grid-cols-[minmax(0,1.1fr)_0.9fr]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.58, ease: "easeOut" }}
      >
        <p className="max-w-2xl text-balance text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
          I build and analyze robot learning systems for deployable humanoid
          manipulation.
        </p>
        <div className="grid gap-3 text-sm text-white/52 sm:grid-cols-2 md:grid-cols-1">
          <p>Humanoid Manipulation</p>
          <p>Imitation Learning</p>
          <p>Policy Deployment</p>
          <p>Robot Evaluation</p>
        </div>
      </motion.div>
    </section>
  );
}
