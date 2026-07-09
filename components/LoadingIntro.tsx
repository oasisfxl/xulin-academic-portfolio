"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-label="Loading Xulin Fu portfolio"
          className="fixed inset-0 z-[80] grid place-items-center bg-graphite-950"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.46, ease: "easeOut" }}
        >
          <motion.div
            className="relative grid h-24 w-24 place-items-center border border-white/12 bg-white/[0.025] shadow-[0_0_70px_rgba(170,183,207,0.18)]"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="text-5xl font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
            >
              F
            </motion.span>
            <motion.span
              className="absolute left-0 top-0 h-px bg-mist"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.24, duration: 0.72, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute bottom-0 right-0 h-px bg-antique/80"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.38, duration: 0.62, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
