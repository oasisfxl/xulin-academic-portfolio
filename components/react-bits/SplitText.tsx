"use client";

import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import {
  CSSProperties,
  useCallback,
  useRef,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(GSAPSplitText, useGSAP);
}

type SplitMode = "chars" | "words" | "lines" | "words, chars";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitMode;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  textAlign?: CSSProperties["textAlign"];
};

type SplitElement = HTMLElement & {
  splitInstance?: GSAPSplitText | null;
};

export function SplitText({
  text,
  className = "",
  delay = 42,
  duration = 0.78,
  ease = "power4.out",
  splitType = "words",
  from = { opacity: 0, yPercent: 86, rotateX: -14 },
  to = { opacity: 1, yPercent: 0, rotateX: 0 },
  tag = "p",
  textAlign = "left",
}: SplitTextProps) {
  const ref = useRef<SplitElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const setElementRef = useCallback((element: HTMLElement | null) => {
    ref.current = element as SplitElement | null;
  }, []);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !text || shouldReduceMotion) return;

      element.splitInstance?.revert();
      // GSAP's revert restores the previous DOM text; resync before re-splitting.
      element.textContent = text;
      const split = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });
      element.splitInstance = split;

      const targets = splitType.includes("chars") ? split.chars :
        splitType.includes("lines") ? split.lines : split.words;

      gsap.fromTo(targets, from, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
        clearProps: "willChange",
      });

      return () => {
        split.revert();
        element.splitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        shouldReduceMotion,
      ],
      scope: ref,
    }
  );

  const elementProps = {
    className: `split-parent ${className}`,
    style: {
      perspective: "800px",
      textAlign,
      whiteSpace: "normal",
      wordWrap: "break-word",
    } satisfies CSSProperties,
  };

  if (tag === "h1") return <h1 {...elementProps} ref={setElementRef}>{text}</h1>;
  if (tag === "h2") return <h2 {...elementProps} ref={setElementRef}>{text}</h2>;
  if (tag === "h3") return <h3 {...elementProps} ref={setElementRef}>{text}</h3>;
  if (tag === "h4") return <h4 {...elementProps} ref={setElementRef}>{text}</h4>;
  if (tag === "h5") return <h5 {...elementProps} ref={setElementRef}>{text}</h5>;
  if (tag === "h6") return <h6 {...elementProps} ref={setElementRef}>{text}</h6>;
  return <p {...elementProps} ref={setElementRef}>{text}</p>;
}
