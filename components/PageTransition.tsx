"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="relative z-10"
      initial={shouldReduceMotion ? false : { opacity: 0.965 }}
      key={pathname}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.main>
  );
}
