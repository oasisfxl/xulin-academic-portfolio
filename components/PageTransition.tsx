"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.main
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { filter: "blur(4px)", opacity: 0, y: -8 }
        }
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { filter: "blur(7px)", opacity: 0, y: 16 }
        }
        key={pathname}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
