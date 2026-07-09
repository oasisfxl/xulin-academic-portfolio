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
          className="fixed inset-0 z-50 grid place-items-center bg-black/56 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm border border-white/12 bg-graphite-900/96 p-6 shadow-soft-glow"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase text-mist/70">Coming soon</p>
            <h2 className="mt-3 text-xl font-medium text-white">
              项目完善中，Coming soon.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {projectTitle ? `${projectTitle} ` : ""}
              目前只在首页展示摘要，完整详情页暂未开放。
            </p>
            <button
              className="mt-6 w-full border border-white/14 px-4 py-3 text-sm text-white/82 transition hover:border-mist/55 hover:bg-white/[0.04] hover:text-white"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
