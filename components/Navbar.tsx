"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SpecularBorder } from "@/components/react-bits/SpecularButton";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/publications", labelKey: "nav.publications" },
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/notes", labelKey: "nav.notes" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/studio", label: "Studio", studio: true },
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

function StudioIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m4.75 19.25 4.1-.92L18.5 8.68a2.12 2.12 0 0 0-3-3L5.83 15.35l-1.08 3.9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="m13.9 7.1 3 3M8.85 18.33l-3.02-2.98"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t, toggleLanguage } = useLanguage();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const studioTimer = useRef<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, width: 0, visible: false });
  const [studioTransition, setStudioTransition] = useState(false);
  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
  const displayedIndex = studioTransition ? navItems.length - 1 : activeIndex;

  const measureCursor = useCallback((index: number) => {
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (!track || !item || index < 0) {
      setCursor((current) => ({ ...current, visible: false }));
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setCursor({
      x: itemRect.left - trackRect.left,
      width: itemRect.width,
      visible: true,
    });
  }, []);

  useLayoutEffect(() => {
    const firstFrame = window.requestAnimationFrame(() => {
      measureCursor(displayedIndex);
      window.requestAnimationFrame(() => measureCursor(displayedIndex));
    });
    const observer = new ResizeObserver(() => measureCursor(displayedIndex));
    if (trackRef.current) observer.observe(trackRef.current);
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });
    const handleResize = () => measureCursor(displayedIndex);
    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [displayedIndex, language, measureCursor]);

  useEffect(
    () => () => {
      if (studioTimer.current !== null) {
        window.clearTimeout(studioTimer.current);
      }
    },
    []
  );

  function openStudio(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (pathname.startsWith("/studio")) return;
    event.preventDefault();
    measureCursor(index);
    setStudioTransition(true);
    studioTimer.current = window.setTimeout(() => {
      router.push("/studio");
    }, 360);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#09090a]/88 backdrop-blur-2xl">
        <nav className="page-shell flex h-16 items-center justify-between gap-3">
          <Link
            className="hidden shrink-0 text-sm font-medium text-white transition hover:text-mist sm:block"
            href="/"
          >
            Xulin Fu
          </Link>
          <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-white/[0.09] bg-[#131315]/88 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_50px_rgba(0,0,0,0.24)] sm:gap-1">
            <div
              className="relative flex items-center gap-0.5 sm:gap-1"
              ref={trackRef}
            >
              <motion.span
                animate={{
                  opacity: cursor.visible ? 1 : 0,
                  x: cursor.x,
                  width: cursor.width,
                }}
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/[0.095] shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_8px_24px_rgba(0,0,0,0.2)]"
                initial={false}
                ref={cursorRef}
                transition={spring}
              >
                <SpecularBorder
                  autoAnimate
                  baseColor="#4c515a"
                  followMouse={false}
                  hostRef={cursorRef}
                  intensity={1.3}
                  lineColor="#eef3fb"
                  radius={999}
                  shineFade={42}
                  shineSize={12}
                  speed={0}
                  thickness={1.15}
                />
                <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              </motion.span>

              {navItems.map((item, index) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const label = "labelKey" in item ? t(item.labelKey) : item.label;
                const isStudioItem = "studio" in item && item.studio;

                return (
                  <motion.div
                    key={item.href}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      aria-current={active ? "page" : undefined}
                      className="relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs text-white/58 transition-colors duration-200 hover:text-white sm:px-3.5 sm:text-sm"
                      data-nav-index={index}
                      href={item.href}
                      ref={(element) => {
                        itemRefs.current[index] = element;
                      }}
                      title={isStudioItem ? "Content Studio" : undefined}
                      onClick={
                        isStudioItem
                          ? (event) => openStudio(event, index)
                          : () => measureCursor(index)
                      }
                    >
                      {isStudioItem ? <StudioIcon /> : null}
                      <span
                        className={`${active ? "text-white" : ""} ${
                          isStudioItem ? "hidden sm:inline" : ""
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <span className="mx-1 h-4 w-px shrink-0 bg-white/12" />
            <motion.button
              aria-label={languageAria[language]}
              className="relative shrink-0 rounded-full px-3 py-1.5 text-xs text-white/62 transition hover:bg-white/[0.08] hover:text-white sm:text-sm"
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

      <AnimatePresence>
        {studioTransition ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-[#0a0a0b]"
            initial={{ opacity: 0 }}
            key="studio-transition"
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative grid h-14 w-14 place-items-center rounded-[8px] border border-white/14 bg-white/[0.035] text-xl font-medium text-white"
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              F
              <motion.span
                animate={{ scaleX: 1 }}
                className="absolute -bottom-3 left-0 h-px w-full origin-left bg-mist/72"
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
