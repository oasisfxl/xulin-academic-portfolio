"use client";

import {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./LineSidebar.module.css";

export type DocumentHeading = {
  id: string;
  label: string;
  level: number;
};

type Falloff = "linear" | "smooth" | "sharp";

type LineSidebarProps = {
  headings: DocumentHeading[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
};

const FALLOFF_CURVES: Record<Falloff, (proximity: number) => number> = {
  linear: (proximity) => proximity,
  smooth: (proximity) =>
    proximity * proximity * (3 - 2 * proximity),
  sharp: (proximity) => proximity * proximity * proximity,
};

export function LineSidebar({
  headings,
  accentColor = "#aebbd1",
  textColor = "#c4c4c4",
  markerColor = "#6c6c6c",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = 0,
  onItemClick,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const settleFrameRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(defaultActive);
  const programmaticIndexRef = useRef<number | null>(null);
  const smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultActive);

  const runFrame = useCallback(function animateItems(now: number) {
    const delta = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const amount = 1 - Math.exp(-delta / tau);
    let moving = false;

    const items = itemRefs.current;
    for (let index = 0; index < items.length; index += 1) {
      const element = items[index];
      if (!element) continue;
      const target = Math.max(
        targetsRef.current[index] || 0,
        activeRef.current === index ? 1 : 0
      );
      const current = currentRef.current[index] || 0;
      const next = current + (target - current) * amount;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[index] = value;
      element.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    frameRef.current = moving
      ? requestAnimationFrame(animateItems)
      : null;
  }, []);

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    lastRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = event.clientY - rect.top;
      const curve = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const items = itemRefs.current;

      for (let index = 0; index < items.length; index += 1) {
        const element = items[index];
        if (!element) continue;
        const center = element.offsetTop + element.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[index] = curve(
          Math.max(0, 1 - distance / proximityRadius)
        );
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const syncActiveFromScroll = useCallback(() => {
    if (programmaticIndexRef.current !== null) return;

    const elements = headings.map((heading) =>
      document.getElementById(heading.id)
    );
    const firstHeading = elements.find(
      (element): element is HTMLElement => element instanceof HTMLElement
    );
    if (!firstHeading) return;

    const scrollMargin = Number.parseFloat(
      window.getComputedStyle(firstHeading).scrollMarginTop
    );
    const activationLine = (Number.isFinite(scrollMargin) ? scrollMargin : 112) + 1;
    let nextIndex = 0;

    elements.forEach((element, index) => {
      if (element && element.getBoundingClientRect().top <= activationLine) {
        nextIndex = index;
      }
    });

    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2
    ) {
      nextIndex = headings.length - 1;
    }

    setActiveIndex((current) =>
      current === nextIndex ? current : nextIndex
    );
  }, [headings]);

  const finishProgrammaticScroll = useCallback(() => {
    programmaticIndexRef.current = null;
    if (settleFrameRef.current !== null) {
      cancelAnimationFrame(settleFrameRef.current);
      settleFrameRef.current = null;
    }
    syncActiveFromScroll();
  }, [syncActiveFromScroll]);

  const watchProgrammaticScroll = useCallback(() => {
    if (settleFrameRef.current !== null) {
      cancelAnimationFrame(settleFrameRef.current);
    }

    const startedAt = performance.now();
    let lastScrollY = window.scrollY;
    let stableFrames = 0;

    const sample = (now: number) => {
      const movement = Math.abs(window.scrollY - lastScrollY);
      stableFrames = movement < 0.5 ? stableFrames + 1 : 0;
      lastScrollY = window.scrollY;
      const elapsed = now - startedAt;

      if ((elapsed > 160 && stableFrames >= 4) || elapsed > 2200) {
        finishProgrammaticScroll();
        return;
      }

      settleFrameRef.current = requestAnimationFrame(sample);
    };

    settleFrameRef.current = requestAnimationFrame(sample);
  }, [finishProgrammaticScroll]);

  const handleClick = useCallback(
    (index: number, heading: DocumentHeading) => {
      const target = document.getElementById(heading.id);
      if (target) programmaticIndexRef.current = index;
      setActiveIndex(index);
      onItemClick?.(index, heading.label);
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      if (target) watchProgrammaticScroll();
    },
    [onItemClick, watchProgrammaticScroll]
  );

  const handleKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLLIElement>,
      index: number,
      heading: DocumentHeading
    ) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleClick(index, heading);
    },
    [handleClick]
  );

  useEffect(() => {
    activeRef.current = activeIndex;
    smoothingRef.current = smoothing;
    startLoop();
  }, [activeIndex, smoothing, startLoop]);

  useEffect(() => {
    itemRefs.current.length = headings.length;
    targetsRef.current.length = headings.length;
    currentRef.current.length = headings.length;
    programmaticIndexRef.current = null;

    const scheduleSync = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        syncActiveFromScroll();
      });
    };

    scheduleSync();
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("scroll", scheduleSync, { passive: true });
    return () => {
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("scroll", scheduleSync);
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [headings, syncActiveFromScroll]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
      if (settleFrameRef.current !== null) {
        cancelAnimationFrame(settleFrameRef.current);
        settleFrameRef.current = null;
      }
    },
    []
  );

  if (!headings.length) return null;

  return (
    <nav
      aria-label="On this page"
      className={`${styles.sidebar} ${
        showMarker ? styles.markers : ""
      } ${scaleTick ? styles.scaleTick : ""} ${className}`}
      data-line-sidebar
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
          "--smoothing": `${smoothing}ms`,
        } as CSSProperties
      }
    >
      <ul
        className={styles.list}
        ref={listRef}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        {headings.map((heading, index) => (
          <li
            aria-current={activeIndex === index ? "true" : undefined}
            className={styles.item}
            key={`${heading.label}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(index, heading)}
            onKeyDown={(event) => handleKeyDown(event, index, heading)}
          >
            {showMarker ? (
              <span aria-hidden="true" className={styles.marker} />
            ) : null}
            <span className={styles.label}>
              {showIndex ? (
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span className={styles.text}>{heading.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
