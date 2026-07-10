"use client";

import { ComingSoonModal } from "@/components/ComingSoonModal";
import { useLanguage } from "@/components/LanguageProvider";
import { Project } from "@/data/projects";
import { projectHref } from "@/lib/projects";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  CSSProperties,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type AlbumShowcaseProps = {
  projects: Project[];
};

type ShowcaseMode = "ring" | "preview";
type PreviewPhase = "opening" | "open" | "closing";
type CoverRect = { x: number; y: number; width: number; height: number };

const coverGradients = [
  "linear-gradient(135deg, #d6dae5 0%, #6d7891 34%, #1b1b20 72%, #080808 100%)",
  "linear-gradient(135deg, #d6c28d 0%, #6d6558 32%, #151516 70%, #080808 100%)",
  "linear-gradient(135deg, #b7a9d7 0%, #58647e 36%, #15161a 72%, #090909 100%)",
  "linear-gradient(135deg, #bdd1ce 0%, #687482 35%, #171614 70%, #090908 100%)",
  "linear-gradient(135deg, #e3e0d7 0%, #8f879d 31%, #202025 72%, #080808 100%)",
];

const dragDegreesPerPixel = 0.13;
const idleVelocity = -2.15;
const coverSpring = {
  type: "spring",
  stiffness: 128,
  damping: 23,
  mass: 0.86,
} as const;

const overlayEase = [0.22, 1, 0.36, 1] as const;

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function coverStyle(project: Project, index: number): CSSProperties {
  if (project.cover) {
    const overlay =
      project.slug === "robust-humanoid-action-delay"
        ? "linear-gradient(180deg, rgba(4,6,10,0.34), rgba(4,6,10,0.82))"
        : "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.42))";

    return {
      backgroundImage: `${overlay}, url(${project.cover})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return { backgroundImage: coverGradients[index % coverGradients.length] };
}

function projectIndex(projects: Project[], project: Project) {
  return Math.max(
    0,
    projects.findIndex((candidate) => candidate.slug === project.slug)
  );
}

function rectFromElement(element?: HTMLElement | null): CoverRect | null {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) {
    return null;
  }

  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}

function previewRect(): CoverRect {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const size = Math.round(
    Math.min(620, width < 640 ? width - 40 : width * 0.56, height * 0.6)
  );

  return {
    width: size,
    height: size,
    x: Math.round((width - size) / 2),
    // Keep a clear lane above the focused cover for the preview controls.
    y: Math.max(88, Math.round((height - size) / 2 - 12)),
  };
}

function fallbackOrigin(): CoverRect {
  const size = Math.min(180, Math.max(112, window.innerWidth * 0.28));
  return {
    width: size,
    height: size,
    x: Math.round((window.innerWidth - size) / 2),
    y: Math.round(window.innerHeight * 0.28),
  };
}

function RingAlbumCard({
  project,
  index,
  angle,
  active,
  dimmed,
  onHover,
  onSelect,
  registerCover,
}: {
  project: Project;
  index: number;
  angle: number;
  active: boolean;
  dimmed: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: (project: Project, source: HTMLButtonElement) => void;
  registerCover: (element: HTMLButtonElement | null) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.16 : 1 }}
      className="album-orbit-card absolute left-1/2 top-1/2"
      style={{
        transform: `rotateY(${angle}deg) translateZ(var(--album-ring-radius))`,
      }}
      transition={{ duration: 0.34, ease: overlayEase }}
    >
      <motion.button
        aria-label={`Preview ${project.title}`}
        className={[
          "group relative h-full w-full overflow-hidden border bg-graphite-850 text-left outline-none transition duration-300",
          "shadow-[0_30px_110px_rgba(0,0,0,0.42)]",
          active
            ? "border-mist/60 shadow-[0_0_0_1px_rgba(170,183,207,0.24),0_0_48px_rgba(170,183,207,0.28),0_38px_120px_rgba(0,0,0,0.52)]"
            : "border-white/10 opacity-70 hover:border-mist/45 hover:opacity-100 hover:shadow-[0_0_0_1px_rgba(170,183,207,0.2),0_0_40px_rgba(170,183,207,0.2),0_34px_100px_rgba(0,0,0,0.5)]",
        ].join(" ")}
        data-album-project={project.slug}
        ref={registerCover}
        style={coverStyle(project, index)}
        type="button"
        whileHover={{ scale: 1.035, y: -5 }}
        whileTap={{ scale: 0.985 }}
        transition={coverSpring}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(project, event.currentTarget);
        }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <CoverArtwork index={index} project={project} compact />
      </motion.button>
    </motion.div>
  );
}

function CoverArtwork({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index: number;
  compact?: boolean;
}) {
  return (
    <>
      <span className="album-cover-noise absolute inset-0" />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.24)_48%,rgba(0,0,0,0.82)_100%)]" />
      <span className={compact ? "absolute left-4 top-4 text-[11px] uppercase text-white/76" : "absolute left-5 top-5 text-xs uppercase text-white/74"}>
        {compact ? String(index + 1).padStart(2, "0") : `${project.year} / ${project.type}`}
      </span>
      {project.visibility === "locked" ? (
        <span className={compact ? "absolute right-3 top-3 border border-white/14 bg-black/28 px-2 py-1 text-[10px] uppercase text-white/72 backdrop-blur-md" : "absolute right-5 top-5 border border-white/14 bg-black/28 px-2.5 py-1.5 text-[11px] uppercase text-white/72 backdrop-blur-md"}>
          Coming soon
        </span>
      ) : null}
      <span className={compact ? "absolute inset-x-4 bottom-4" : "absolute inset-x-5 bottom-5"}>
        <span className={compact ? "block text-base font-medium leading-tight text-white" : "block text-2xl font-medium leading-tight text-white"}>
          {project.title}
        </span>
        <span className={compact ? "mt-2 block text-xs uppercase text-white/54" : "mt-3 block max-w-md text-sm leading-6 text-white/62"}>
          {compact ? `${project.year} / ${project.type}` : project.subtitle}
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="absolute -inset-12 bg-[radial-gradient(circle_at_50%_34%,rgba(170,183,207,0.4),transparent_48%)]" />
        <span className="absolute inset-0 ring-1 ring-inset ring-white/45" />
      </span>
    </>
  );
}

function PreviewOverlay({
  phase,
  project,
  index,
  projectCount,
  direction,
  origin,
  returnTarget,
  description,
  openLabel,
  onClose,
  onCloseComplete,
  onOpenComplete,
  onOpen,
  onStep,
}: {
  phase: PreviewPhase;
  project: Project;
  index: number;
  projectCount: number;
  direction: -1 | 1;
  origin: CoverRect;
  returnTarget: CoverRect | null;
  description: string;
  openLabel: string;
  onClose: () => void;
  onCloseComplete: () => void;
  onOpenComplete: () => void;
  onOpen: () => void;
  onStep: (direction: -1 | 1) => void;
}) {
  const target = previewRect();
  const isClosing = phase === "closing";
  const destination = isClosing ? returnTarget ?? origin : target;

  return createPortal(
    <motion.div
      aria-modal="true"
      className="fixed inset-0 z-[100] cursor-zoom-out bg-[#070708]/[0.86] backdrop-blur-[18px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      transition={{ duration: isClosing ? 0.32 : 0.28, ease: overlayEase }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        animate={destination}
        className="fixed left-0 top-0 z-20"
        initial={origin}
        transition={isClosing ? { duration: 0.62, ease: overlayEase } : coverSpring}
        onAnimationComplete={() => {
          if (phase === "closing") {
            onCloseComplete();
          } else if (phase === "opening") {
            onOpenComplete();
          }
        }}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.button
            aria-label={`Open ${project.title}`}
            animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
            className="group absolute inset-0 overflow-hidden border border-white/14 bg-graphite-850 text-left outline-none shadow-[0_44px_170px_rgba(0,0,0,0.58)]"
            custom={direction}
            exit={{
              opacity: 0,
              rotateY: direction * -8,
              scale: 0.965,
              x: direction * -36,
            }}
            initial={{
              opacity: 0,
              rotateY: direction * 8,
              scale: 0.965,
              x: direction * 36,
            }}
            key={project.slug}
            style={{
              ...coverStyle(project, index),
              transformOrigin: direction === 1 ? "100% 50%" : "0% 50%",
            }}
            transition={{ duration: 0.46, ease: overlayEase }}
            type="button"
            whileHover={isClosing ? undefined : { scale: 1.008, y: -3 }}
            whileTap={isClosing ? undefined : { scale: 0.992 }}
            onClick={onOpen}
          >
            <CoverArtwork index={index} project={project} />
          </motion.button>
        </AnimatePresence>
      </motion.div>

      <motion.div
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 8 : 0 }}
        className="pointer-events-none fixed inset-x-5 bottom-7 mx-auto max-w-2xl text-center sm:bottom-9"
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: phase === "opening" ? 0.2 : 0, duration: 0.38, ease: overlayEase }}
      >
        <p className="text-xs uppercase tracking-[0.16em] text-mist/84">
          {String(index + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/54">
          {description}
        </p>
      </motion.div>

      <motion.div
        className="fixed inset-x-0 top-5 z-30 flex justify-center px-4"
      >
        <motion.div
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -8 : 0 }}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          transition={{ delay: phase === "opening" ? 0.16 : 0, duration: 0.32, ease: overlayEase }}
        >
          <button
            aria-label="Previous project"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-black/20 text-white/72 backdrop-blur-xl transition hover:border-mist/55 hover:bg-white/[0.09] hover:text-white"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onStep(-1);
            }}
          >
            ←
          </button>
          <button
            className="min-w-28 rounded-full border border-white/12 bg-black/20 px-4 py-2.5 text-xs text-white/70 backdrop-blur-xl transition hover:border-mist/55 hover:bg-white/[0.09] hover:text-white"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            {openLabel}
          </button>
          <button
            aria-label="Next project"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-black/20 text-white/72 backdrop-blur-xl transition hover:border-mist/55 hover:bg-white/[0.09] hover:text-white"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onStep(1);
            }}
          >
            →
          </button>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function AlbumShowcase({ projects }: AlbumShowcaseProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<ShowcaseMode>("ring");
  const [previewPhase, setPreviewPhase] = useState<PreviewPhase>("opening");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [previewDirection, setPreviewDirection] = useState<-1 | 1>(1);
  const [previewOrigin, setPreviewOrigin] = useState<CoverRect | null>(null);
  const [returnTarget, setReturnTarget] = useState<CoverRect | null>(null);
  const [hovered, setHovered] = useState(false);
  const [lockedProject, setLockedProject] = useState<Project | undefined>();
  const sectionRef = useRef<HTMLElement>(null);
  const coverRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragState = useRef({ active: false, startX: 0, startRotation: 0, lastX: 0, lastTime: 0 });
  const tapCandidate = useRef<Project | null>(null);
  const angularVelocity = useRef(0);
  const snapAnimation = useRef<{ stop: () => void } | null>(null);
  const suppressClick = useRef(false);

  const rotation = useMotionValue(0);
  const rotationSpring = useSpring(rotation, { stiffness: 86, damping: 21, mass: 0.78 });
  const ringTransform = useTransform(rotationSpring, (value) => `rotateX(-7deg) rotateY(${value}deg)`);
  const angleStep = projects.length > 0 ? 360 / projects.length : 0;
  const activeProject = projects[activeIndex] ?? projects[0];
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mode === "preview") {
        closePreview();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  });

  useMotionValueEvent(rotationSpring, "change", (latest) => {
    if (projects.length === 0 || angleStep === 0 || mode !== "ring") {
      return;
    }
    const nextIndex = mod(Math.round(-latest / angleStep), projects.length);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || mode !== "ring" || dragState.current.active || projects.length === 0) {
      return;
    }
    const seconds = delta / 1000;
    const currentVelocity = angularVelocity.current;
    const resting = Math.abs(currentVelocity) < 0.08;
    const ambientVelocity = hovered ? idleVelocity * 0.28 : idleVelocity;
    const appliedVelocity = resting ? ambientVelocity : currentVelocity;
    rotation.set(rotation.get() + appliedVelocity * seconds);
    angularVelocity.current = resting ? 0 : currentVelocity * Math.pow(0.91, delta / 16.67);
  });

  function stopSnapAnimation() {
    snapAnimation.current?.stop();
    snapAnimation.current = null;
  }

  function openProject(project: Project) {
    if (project.visibility === "public") {
      router.push(projectHref(project));
      return;
    }
    if (project.visibility === "locked") {
      setLockedProject(project);
    }
  }

  function openPreview(project: Project, source?: HTMLButtonElement | null) {
    if (suppressClick.current || mode === "preview") {
      return;
    }
    const nextIndex = projectIndex(projects, project);
    const origin = rectFromElement(source ?? coverRefs.current[project.slug]) ?? fallbackOrigin();
    angularVelocity.current = 0;
    stopSnapAnimation();
    setSelectedProjectIndex(nextIndex);
    setActiveIndex(nextIndex);
    setPreviewDirection(1);
    setPreviewOrigin(origin);
    setReturnTarget(null);
    setPreviewPhase("opening");
    setHovered(false);
    setMode("preview");
  }

  function snapToIndex(index: number) {
    if (angleStep === 0) return;
    stopSnapAnimation();
    angularVelocity.current = 0;
    const normalizedIndex = mod(index, projects.length);
    const target = -normalizedIndex * angleStep;
    snapAnimation.current = animate(rotation, target, {
      type: "spring",
      stiffness: 82,
      damping: 18,
      mass: 0.86,
    });
  }

  function stepRing(direction: -1 | 1) {
    snapToIndex(activeIndex + direction);
  }

  function stepPreview(direction: -1 | 1) {
    setPreviewDirection(direction);
    setSelectedProjectIndex((current) => mod(current + direction, projects.length));
  }

  function projectAtPointer(clientX: number, clientY: number) {
    const matches = projects.flatMap((project) => {
      const rect = rectFromElement(coverRefs.current[project.slug]);
      if (
        !rect ||
        clientX < rect.x ||
        clientX > rect.x + rect.width ||
        clientY < rect.y ||
        clientY > rect.y + rect.height
      ) {
        return [];
      }

      const distance =
        Math.pow((clientX - (rect.x + rect.width / 2)) / rect.width, 2) +
        Math.pow((clientY - (rect.y + rect.height / 2)) / rect.height, 2);

      return [{ project, distance }];
    });

    return matches.sort((a, b) => a.distance - b.distance)[0]?.project ?? null;
  }

  function closePreview() {
    if (mode !== "preview" || previewPhase === "closing") {
      return;
    }
    const targetIndex = selectedProjectIndex;
    const rotationTarget = -targetIndex * angleStep;
    stopSnapAnimation();
    angularVelocity.current = 0;
    rotation.jump(rotationTarget);
    setActiveIndex(targetIndex);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setReturnTarget(rectFromElement(coverRefs.current[selectedProject.slug]) ?? fallbackOrigin());
        setPreviewPhase("closing");
      });
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    stopSnapAnimation();
    tapCandidate.current = projectAtPointer(event.clientX, event.clientY);
    dragState.current = {
      active: true,
      startX: event.clientX,
      startRotation: rotation.get(),
      lastX: event.clientX,
      lastTime: performance.now(),
    };
    angularVelocity.current = 0;
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    const now = performance.now();
    const state = dragState.current;
    const totalOffset = event.clientX - state.startX;
    const deltaX = event.clientX - state.lastX;
    const deltaTime = Math.max(now - state.lastTime, 16);
    if (Math.abs(totalOffset) > 6) suppressClick.current = true;
    if (suppressClick.current) tapCandidate.current = null;
    rotation.set(state.startRotation + totalOffset * dragDegreesPerPixel);
    angularVelocity.current = (deltaX / deltaTime) * dragDegreesPerPixel * 1000;
    state.lastX = event.clientX;
    state.lastTime = now;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    const selectOnTap = event.type === "pointerup" && !suppressClick.current;
    dragState.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (selectOnTap) {
      angularVelocity.current = 0;
      const project = tapCandidate.current ?? activeProject;
      tapCandidate.current = null;
      openPreview(project, coverRefs.current[project.slug]);
      return;
    }
    tapCandidate.current = null;
    window.setTimeout(() => { suppressClick.current = false; }, 120);
  }

  if (projects.length === 0 || !activeProject || !selectedProject) return null;

  return (
    <section aria-label="Featured research albums" className="relative overflow-hidden py-4 sm:py-6" ref={sectionRef}>
      <motion.div
        animate={{ filter: mode === "preview" ? "blur(8px) saturate(0.72)" : "blur(0px) saturate(1)", opacity: mode === "preview" ? 0.36 : 1 }}
        className="transition-none"
        transition={{ duration: 0.38, ease: overlayEase }}
      >
        <div className="page-shell flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase text-antique/72">{t("showcase.eyebrow")}</p>
            <h2 className="mt-3 text-2xl font-medium text-white sm:text-3xl">{t("showcase.title")}</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-white/48 sm:block">{t("showcase.instruction")}</p>
        </div>

        <div className="album-stage relative mt-3 h-[500px] overflow-hidden sm:h-[600px] lg:h-[650px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(170,183,207,0.14),transparent_38%),linear-gradient(90deg,#070707_0%,transparent_15%,transparent_85%,#070707_100%)]" />
          <div className="pointer-events-none absolute left-1/2 top-[22%] h-[54%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-mist/16 to-transparent" />
          <div
            className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
          >
            <motion.div
              className="absolute left-1/2 top-[22%] h-0 w-0"
              style={{ transform: ringTransform, transformStyle: "preserve-3d" }}
            >
              {projects.map((project, index) => (
                <RingAlbumCard
                  active={index === activeIndex}
                  angle={index * angleStep}
                  dimmed={mode === "preview" && project.slug === selectedProject.slug}
                  index={index}
                  key={project.slug}
                  project={project}
                  registerCover={(element) => { coverRefs.current[project.slug] = element; }}
                  onHover={setHovered}
                  onSelect={openPreview}
                />
              ))}
            </motion.div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex justify-center px-5 text-center">
            <div className="max-w-[90vw]">
              <p className="text-xs uppercase text-white/36">{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-medium text-white sm:text-2xl">{activeProject.title}</h3>
              <p className="mt-2 line-clamp-1 text-sm text-white/44">{activeProject.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="page-shell -mt-4 flex items-center justify-center gap-4">
          <button aria-label="Previous project cover" className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white" type="button" onClick={() => stepRing(-1)}>←</button>
          <button className="rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/60 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white" type="button" onClick={() => openPreview(activeProject, coverRefs.current[activeProject.slug])}>{t("showcase.select")}</button>
          <button aria-label="Next project cover" className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white" type="button" onClick={() => stepRing(1)}>→</button>
        </div>
      </motion.div>

      <AnimatePresence onExitComplete={() => {
        setPreviewOrigin(null);
        setReturnTarget(null);
      }}>
        {mode === "preview" && previewOrigin ? (
          <PreviewOverlay
            description={selectedProject.visibility === "locked" ? t("showcase.locked") : selectedProject.description}
            direction={previewDirection}
            index={selectedProjectIndex}
            key="preview-overlay"
            onClose={closePreview}
            onCloseComplete={() => setMode("ring")}
            onOpenComplete={() => setPreviewPhase("open")}
            onOpen={() => openProject(selectedProject)}
            onStep={stepPreview}
            openLabel={t("showcase.return")}
            origin={previewOrigin}
            phase={previewPhase}
            project={selectedProject}
            projectCount={projects.length}
            returnTarget={returnTarget}
          />
        ) : null}
      </AnimatePresence>

      <ComingSoonModal open={Boolean(lockedProject)} projectTitle={lockedProject?.title} onClose={() => setLockedProject(undefined)} />
    </section>
  );
}
