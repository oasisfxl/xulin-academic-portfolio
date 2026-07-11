"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingIntro() {
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const skipIntro =
      shouldReduceMotion ||
      window.sessionStorage.getItem("xulin-intro-seen") === "true";

    const timer = window.setTimeout(() => {
      if (!skipIntro) {
        window.sessionStorage.setItem("xulin-intro-seen", "true");
      }
      setVisible(false);
    }, skipIntro ? 0 : 980);

    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-label="Loading Xulin Fu portfolio"
          className="fixed inset-0 z-[80] grid place-items-center bg-[#070707]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative grid h-28 w-28 place-items-center"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="text-7xl font-medium text-white"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              F
            </motion.span>
            <motion.span
              className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 bg-mist/80"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 112, opacity: [0, 1, 0] }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="absolute bottom-2 left-1/2 h-px -translate-x-1/2 bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: 44 }}
              transition={{ delay: 0.24, duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
