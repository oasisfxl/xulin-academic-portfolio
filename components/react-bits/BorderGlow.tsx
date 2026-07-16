"use client";

import {
  CSSProperties,
  PointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styles from "./BorderGlow.module.css";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

const gradientPositions = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const gradientKeys = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGlowVariables(color: string, intensity: number) {
  const match = color.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  const hue = match ? Number.parseFloat(match[1]) : 215;
  const saturation = match ? Number.parseFloat(match[2]) : 32;
  const lightness = match ? Number.parseFloat(match[3]) : 76;
  const base = `${hue}deg ${saturation}% ${lightness}%`;
  const variables: Record<string, string> = {};
  [100, 60, 50, 40, 30, 20, 10].forEach((opacity) => {
    const suffix = opacity === 100 ? "" : `-${opacity}`;
    variables[`--glow-color${suffix}`] = `hsl(${base} / ${Math.min(
      opacity * intensity,
      100
    )}%)`;
  });
  return variables;
}

function buildGradientVariables(colors: string[]) {
  const palette = colors.length ? colors : ["#aebbd1"];
  const variables: Record<string, string> = {};
  gradientKeys.forEach((key, index) => {
    const color = palette[Math.min(colorMap[index], palette.length - 1)];
    variables[key] = `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`;
  });
  variables["--gradient-base"] = `linear-gradient(${palette[0]} 0 100%)`;
  return variables;
}

export function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 28,
  glowColor = "215 32 76",
  backgroundColor = "#0d0d0f",
  borderRadius = 8,
  glowRadius = 32,
  glowIntensity = 0.8,
  coneSpread = 24,
  animated = false,
  colors = ["#aebbd1", "#a899c7", "#c8b78a"],
  fillOpacity = 0.34,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const updatePointer = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const scaleX = deltaX === 0 ? Number.POSITIVE_INFINITY : centerX / Math.abs(deltaX);
    const scaleY = deltaY === 0 ? Number.POSITIVE_INFINITY : centerY / Math.abs(deltaY);
    const edge = Math.min(Math.max(1 / Math.min(scaleX, scaleY), 0), 1);
    let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card) return;
    let frame = 0;
    const started = performance.now();
    card.classList.add(styles.sweeping);
    const sweep = (now: number) => {
      const progress = Math.min((now - started) / 1900, 1);
      const proximity = Math.sin(progress * Math.PI) * 100;
      card.style.setProperty("--edge-proximity", proximity.toFixed(2));
      card.style.setProperty("--cursor-angle", `${110 + progress * 355}deg`);
      if (progress < 1) {
        frame = requestAnimationFrame(sweep);
      } else {
        card.classList.remove(styles.sweeping);
      }
    };
    frame = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  return (
    <div
      className={`${styles.card} ${className}`}
      onPointerMove={updatePointer}
      ref={cardRef}
      style={
        {
          "--card-bg": backgroundColor,
          "--edge-sensitivity": edgeSensitivity,
          "--border-radius": `${borderRadius}px`,
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread,
          "--fill-opacity": fillOpacity,
          ...buildGlowVariables(glowColor, glowIntensity),
          ...buildGradientVariables(colors),
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className={styles.edgeLight} />
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
