"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LineSidebar.module.css";

export type DocumentHeading = {
  id: string;
  label: string;
  level: number;
};

type LineSidebarProps = {
  headings: DocumentHeading[];
};

const falloff = (proximity: number) =>
  proximity * proximity * (3 - 2 * proximity);

export function LineSidebar({ headings }: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible[0]) return;
        const index = headings.findIndex(
          (heading) => heading.id === visible[0].target.id
        );
        if (index >= 0) setActiveIndex(index);
      },
      { rootMargin: "-18% 0px -66% 0px", threshold: [0, 1] }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    itemRefs.current.forEach((element, index) => {
      element?.style.setProperty("--effect", index === activeIndex ? "1" : "0");
    });
  }, [activeIndex]);

  function handlePointerMove(event: React.PointerEvent<HTMLUListElement>) {
    const list = listRef.current;
    if (!list || window.matchMedia("(max-width: 1023px)").matches) return;
    const rect = list.getBoundingClientRect();
    const pointerY = event.clientY - rect.top;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const center = element.offsetTop + element.offsetHeight / 2;
      const proximity = Math.max(0, 1 - Math.abs(pointerY - center) / 92);
      const effect = Math.max(falloff(proximity), activeIndex === index ? 1 : 0);
      element.style.setProperty("--effect", effect.toFixed(4));
    });
  }

  function handlePointerLeave() {
    itemRefs.current.forEach((element, index) => {
      element?.style.setProperty("--effect", index === activeIndex ? "1" : "0");
    });
  }

  function handleClick(index: number, heading: DocumentHeading) {
    setActiveIndex(index);
    document.getElementById(heading.id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  if (!headings.length) return null;

  return (
    <nav aria-label="On this page" className={styles.sidebar}>
      <ul
        className={styles.list}
        ref={listRef}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        {headings.map((heading, index) => (
          <li
            aria-current={activeIndex === index ? "location" : undefined}
            className={`${styles.item} ${heading.level === 3 ? styles.level3 : ""}`}
            key={heading.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
          >
            <span aria-hidden="true" className={styles.marker} />
            <button
              className={styles.button}
              type="button"
              onClick={() => handleClick(index, heading)}
            >
              <span className={styles.index}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.text}>{heading.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
