"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type ComingSoonModalProps = {
  open: boolean;
  projectTitle?: string;
  onClose: () => void;
};

export function ComingSoonModal({
  open,
  projectTitle,
  onClose,
}: ComingSoonModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/68 px-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-sm border border-white/12 bg-graphite-900/96 p-7 shadow-[0_32px_120px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 22, scale: 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 290, damping: 28, mass: 0.8 }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.button
              aria-label="Close dialog"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-xl text-white/45 transition-colors hover:bg-white/[0.07] hover:text-white"
              title="Close"
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={onClose}
            >
              ×
            </motion.button>
            <p className="text-xs uppercase text-mist/70">Coming soon</p>
            <h2 className="mt-3 pr-8 text-xl font-medium text-white">
              项目完善中，Coming soon.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {projectTitle ? `${projectTitle} ` : ""}
              目前只在首页展示摘要，完整详情页暂未开放。
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
