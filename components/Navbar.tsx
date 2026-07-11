"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/publications", labelKey: "nav.publications" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/notes", labelKey: "nav.notes" },
  { href: "/about", labelKey: "nav.about" },
] as const;

const spring = {
  type: "spring",
  stiffness: 430,
  damping: 34,
  mass: 0.8,
} as const;

const languageLabels = {
  en: "中",
  zh: "EN",
} as const;

const languageAria = {
  en: "Switch to Chinese",
  zh: "Switch to English",
} as const;

const languageTitle = {
  en: "中文",
  zh: "English",
} as const;

export function Navbar() {
  const pathname = usePathname();
  const { language, t, toggleLanguage } = useLanguage();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [cursor, setCursor] = useState({ x: 0, width: 0, visible: false });
  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  const measureCursor = useCallback((index = activeIndex) => {
    const track = trackRef.current;
    const activeItem = itemRefs.current[index];
    if (!track || !activeItem || index < 0) {
      setCursor((current) => ({ ...current, visible: false }));
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    setCursor({
      x: itemRect.left - trackRect.left,
      width: itemRect.width,
      visible: true,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    const firstFrame = window.requestAnimationFrame(() => {
      measureCursor();
      window.requestAnimationFrame(() => measureCursor());
    });
    const observer = new ResizeObserver(() => measureCursor());
    if (trackRef.current) observer.observe(trackRef.current);
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });
    const handleResize = () => measureCursor();
    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex, language, measureCursor]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-graphite-950/70 backdrop-blur-xl">
      <nav className="page-shell flex h-16 items-center justify-between">
        <Link
          className="hidden text-sm font-medium text-white transition hover:text-mist sm:block"
          href="/"
        >
          Xulin Fu
        </Link>
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:gap-1">
          <div className="relative flex items-center gap-0.5 sm:gap-1" ref={trackRef}>
            <motion.span
              animate={{ opacity: cursor.visible ? 1 : 0, x: cursor.x, width: cursor.width }}
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full border border-white/10 bg-white/[0.105] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_30px_rgba(0,0,0,0.18)]"
              initial={false}
              transition={spring}
            >
              <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            </motion.span>
          {navItems.map((item, index) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.href}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              >
                <Link
                  aria-current={active ? "page" : undefined}
                  className="relative z-10 block whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs text-white/58 transition-colors duration-200 hover:text-white sm:px-3.5 sm:text-sm"
                  href={item.href}
                  ref={(element) => { itemRefs.current[index] = element; }}
                  onPointerDown={() => measureCursor(index)}
                >
                  <span className={active ? "text-white" : undefined}>
                    {t(item.labelKey)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
          </div>
          {process.env.NODE_ENV === "development" ? (
            <>
              <span className="mx-1 hidden h-4 w-px bg-white/12 sm:block" />
              <motion.div className="hidden sm:block" whileTap={{ scale: 0.95 }}>
                <Link
                  className="block rounded-full px-3 py-1.5 text-xs text-antique/72 transition-colors hover:bg-white/[0.06] hover:text-white sm:text-sm"
                  href="/studio"
                >
                  Studio
                </Link>
              </motion.div>
            </>
          ) : null}
          <span className="mx-1 h-4 w-px bg-white/12" />
          <motion.button
            aria-label={languageAria[language]}
            className="relative rounded-full px-3 py-1.5 text-xs text-white/62 transition hover:bg-white/[0.08] hover:text-white sm:text-sm"
            title={languageTitle[language]}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={toggleLanguage}
          >
            {languageLabels[language]}
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
