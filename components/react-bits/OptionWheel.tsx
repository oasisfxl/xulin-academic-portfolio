"use client";

import {
  CSSProperties,
  PointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./OptionWheel.module.css";

type Side = "left" | "right";

type OptionWheelProps = {
  items: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  textColor?: string;
  activeColor?: string;
  side?: Side;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  className?: string;
};

type WheelConfig = {
  count: number;
  items: string[];
  rowHeight: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: Side;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
};

export function OptionWheel({
  items,
  defaultSelected = 2,
  onChange,
  textColor = "#777b84",
  activeColor = "#f4f5f7",
  side = "left",
  fontSize = 2.35,
  spacing = 1.34,
  curve = 0.92,
  tilt = 7,
  blur = 1.25,
  fade = 0.2,
  minOpacity = 0.08,
  smoothing = 190,
  inset = 72,
  loop = true,
  draggable = true,
  className = "",
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const positionRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const configRef = useRef<WheelConfig>({
    count: items.length,
    items,
    rowHeight: Math.max(fontSize * spacing * 16, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
  });
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const layoutItems = useCallback((position: number) => {
    const config = configRef.current;
    const mirror = config.side === "right" ? -1 : 1;
    const tiltRadians = (config.tilt * Math.PI) / 180;
    const radius = tiltRadians > 0.0005 ? config.rowHeight / tiltRadians : 0;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      let distanceFromCenter = index - position;
      if (config.loop && config.count > 1) {
        distanceFromCenter =
          ((distanceFromCenter % config.count) + config.count) % config.count;
        if (distanceFromCenter > config.count / 2) {
          distanceFromCenter -= config.count;
        }
      }

      const distance = Math.abs(distanceFromCenter);
      let x = 0;
      let y = distanceFromCenter * config.rowHeight;
      let rotation = 0;
      if (radius > 0) {
        const angle = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, distanceFromCenter * tiltRadians)
        );
        y = radius * Math.sin(angle);
        x = -mirror * radius * (1 - Math.cos(angle)) * config.curve;
        rotation = (mirror * angle * 180) / Math.PI;
      }

      element.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
      element.style.opacity = String(
        Math.max(config.minOpacity, 1 - distance * config.fade)
      );
      element.style.filter =
        config.blur > 0
          ? `blur(${(distance * config.blur).toFixed(2)}px)`
          : "none";
      element.style.setProperty(
        "--ow-p",
        Math.max(0, 1 - Math.min(distance, 1)).toFixed(4)
      );
    });
  }, []);

  const runFrame = useCallback(function animateWheel(now: number) {
    const delta = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;
    const config = configRef.current;
    const easing = 1 - Math.exp(-delta / (Math.max(config.smoothing, 1) / 1000));
    const target = targetRef.current;
    const current = positionRef.current;
    let next = current + (target - current) * easing;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    positionRef.current = next;
    layoutItems(next);

    frameRef.current = settled
      ? null
      : requestAnimationFrame(animateWheel);
  }, [layoutItems]);

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    lastFrameRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const config = configRef.current;
      if (!config.count) return;
      let next = value;
      if (!config.loop) {
        next = Math.min(Math.max(next, 0), config.count - 1);
      }
      if (snap) next = Math.round(next);
      targetRef.current = next;
      const index =
        ((Math.round(next) % config.count) + config.count) % config.count;
      if (index !== selectedRef.current) {
        selectedRef.current = index;
        setSelectedIndex(index);
        onChangeRef.current?.(index, config.items[index]);
      }
      startLoop();
    },
    [startLoop]
  );

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const remPixels =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    onChangeRef.current = onChange;
    configRef.current = {
      count: items.length,
      items,
      rowHeight: Math.max(fontSize * spacing * remPixels, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
    };

    itemRefs.current.length = items.length;
    positionRef.current = targetRef.current;

    const refreshLayout = () => {
      layoutItems(positionRef.current);
    };
    refreshLayout();

    const nextFrame = requestAnimationFrame(refreshLayout);
    const resizeObserver = new ResizeObserver(refreshLayout);
    resizeObserver.observe(element);
    const handlePageShow = () => refreshLayout();
    const handleVisibilityChange = () => {
      if (!document.hidden) refreshLayout();
    };
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(nextFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    items,
    onChange,
    fontSize,
    spacing,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    layoutItems,
  ]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const config = configRef.current;
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / config.rowHeight));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(
        () => applyTarget(targetRef.current, true),
        140
      );
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!configRef.current.draggable) return;
    dragRef.current = {
      y: event.clientY,
      start: targetRef.current,
      id: event.pointerId,
    };
    dragMovedRef.current = false;
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientY - drag.y;
    if (!dragMovedRef.current && Math.abs(delta) > 4) {
      dragMovedRef.current = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (dragMovedRef.current) {
      applyTarget(drag.start - delta / configRef.current.rowHeight, false);
    }
  }

  function handlePointerEnd() {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }

  function selectItem(index: number) {
    if (dragMovedRef.current) return;
    const config = configRef.current;
    const current = targetRef.current;
    let delta = index - (((current % config.count) + config.count) % config.count);
    if (config.loop && config.count > 1) {
      if (delta > config.count / 2) delta -= config.count;
      if (delta < -config.count / 2) delta += config.count;
    }
    applyTarget(current + delta, true);
  }

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    },
    []
  );

  return (
    <div
      aria-label="Research directions"
      className={`${styles.wheel} ${side === "right" ? styles.right : ""} ${
        isDragging ? styles.dragging : ""
      } ${className}`}
      ref={rootRef}
      role="listbox"
      style={
        {
          "--ow-text-color": textColor,
          "--ow-active-color": activeColor,
          "--ow-font-size": `${fontSize}rem`,
          "--ow-inset": `${inset}px`,
        } as CSSProperties
      }
      tabIndex={0}
      onKeyDown={(event) => {
        const delta =
          event.key === "ArrowUp" || event.key === "ArrowLeft"
            ? -1
            : event.key === "ArrowDown" || event.key === "ArrowRight"
              ? 1
              : null;
        if (delta === null) return;
        event.preventDefault();
        applyTarget(Math.round(targetRef.current) + delta, true);
      }}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      {items.map((item, index) => (
        <div
          aria-selected={selectedIndex === index}
          className={`${styles.item} ${
            selectedIndex === index ? styles.selected : ""
          }`}
          key={`${item}-${index}`}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          role="option"
          onClick={() => selectItem(index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
