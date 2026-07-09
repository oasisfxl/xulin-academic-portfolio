"use client";

import { ComingSoonModal } from "@/components/ComingSoonModal";
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
import { CSSProperties, PointerEvent, useRef, useState } from "react";

type AlbumShowcaseProps = {
  projects: Project[];
};

type ShowcaseMode = "ring" | "preview";

const coverGradients = [
  "linear-gradient(135deg, #d6dae5 0%, #6d7891 34%, #1b1b20 72%, #080808 100%)",
  "linear-gradient(135deg, #d6c28d 0%, #6d6558 32%, #151516 70%, #080808 100%)",
  "linear-gradient(135deg, #b7a9d7 0%, #58647e 36%, #15161a 72%, #090909 100%)",
  "linear-gradient(135deg, #bdd1ce 0%, #687482 35%, #171614 70%, #090908 100%)",
  "linear-gradient(135deg, #e3e0d7 0%, #8f879d 31%, #202025 72%, #080808 100%)",
];

const dragDegreesPerPixel = 0.13;
const idleVelocity = -2.15;

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function coverStyle(project: Project, index: number): CSSProperties {
  if (project.cover) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.42)), url(${project.cover})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return {
    backgroundImage: coverGradients[index % coverGradients.length],
  };
}

function projectIndex(projects: Project[], project: Project) {
  return Math.max(
    0,
    projects.findIndex((candidate) => candidate.slug === project.slug)
  );
}

function RingAlbumCard({
  project,
  index,
  angle,
  active,
  onHover,
  onSelect,
}: {
  project: Project;
  index: number;
  angle: number;
  active: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: (project: Project) => void;
}) {
  return (
    <div
      className="album-orbit-card absolute left-1/2 top-1/2"
      style={{
        transform: `rotateY(${angle}deg) translateZ(var(--album-ring-radius))`,
      }}
    >
      <motion.button
        className={[
          "group relative h-full w-full overflow-hidden border bg-graphite-850 text-left outline-none transition duration-300",
          "shadow-[0_30px_110px_rgba(0,0,0,0.42)]",
          active
            ? "border-mist/60 shadow-[0_0_0_1px_rgba(170,183,207,0.24),0_0_48px_rgba(170,183,207,0.28),0_38px_120px_rgba(0,0,0,0.52)]"
            : "border-white/10 opacity-70 hover:border-mist/45 hover:opacity-100 hover:shadow-[0_0_0_1px_rgba(170,183,207,0.2),0_0_40px_rgba(170,183,207,0.2),0_34px_100px_rgba(0,0,0,0.5)]",
        ].join(" ")}
        style={coverStyle(project, index)}
        type="button"
        whileHover={{ scale: 1.035, y: -5 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => onSelect(project)}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <span className="album-cover-noise absolute inset-0" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.24)_48%,rgba(0,0,0,0.82)_100%)]" />
        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="absolute -inset-12 bg-[radial-gradient(circle_at_50%_36%,rgba(170,183,207,0.42),transparent_46%)]" />
          <span className="absolute inset-0 ring-1 ring-inset ring-white/42" />
        </span>
        <span className="absolute left-4 top-4 text-[11px] uppercase text-white/76">
          {String(index + 1).padStart(2, "0")}
        </span>
        {project.visibility === "locked" ? (
          <span className="absolute right-3 top-3 border border-white/14 bg-black/28 px-2 py-1 text-[10px] uppercase text-white/72 backdrop-blur-md">
            Coming soon
          </span>
        ) : null}
        <span className="absolute inset-x-4 bottom-4">
          <span className="block text-base font-medium leading-tight text-white">
            {project.title}
          </span>
          <span className="mt-2 block text-xs uppercase text-white/54">
            {project.year} / {project.type}
          </span>
        </span>
      </motion.button>
    </div>
  );
}

function PreviewCover({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      className="group relative mx-auto aspect-square w-full max-w-[min(620px,68vh)] overflow-hidden border border-white/10 bg-graphite-850 text-left shadow-[0_40px_140px_rgba(0,0,0,0.42)] outline-none transition hover:border-mist/55 hover:shadow-[0_0_0_1px_rgba(170,183,207,0.2),0_0_56px_rgba(170,183,207,0.2),0_42px_130px_rgba(0,0,0,0.46)] focus-visible:border-mist"
      style={coverStyle(project, index)}
      type="button"
      whileHover={{ y: -6, scale: 1.012 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
    >
      <span className="album-cover-noise absolute inset-0" />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_26%),linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.76)_100%)]" />
      <span className="absolute left-5 top-5 text-xs uppercase tracking-normal text-white/74">
        {project.year} / {project.type}
      </span>
      {project.visibility === "locked" ? (
        <span className="absolute right-5 top-5 border border-white/14 bg-black/28 px-2.5 py-1.5 text-[11px] uppercase text-white/72 backdrop-blur-md">
          Coming soon
        </span>
      ) : null}
      <span className="absolute inset-x-5 bottom-5">
        <span className="block text-2xl font-medium leading-tight text-white">
          {project.title}
        </span>
        <span className="mt-3 block max-w-md text-sm leading-6 text-white/62">
          {project.subtitle}
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="absolute -inset-12 bg-[radial-gradient(circle_at_50%_34%,rgba(170,183,207,0.34),transparent_48%)]" />
        <span className="absolute inset-0 ring-1 ring-inset ring-white/45" />
      </span>
    </motion.button>
  );
}

export function AlbumShowcase({ projects }: AlbumShowcaseProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<ShowcaseMode>("ring");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [lockedProject, setLockedProject] = useState<Project | undefined>();
  const sectionRef = useRef<HTMLElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startRotation: 0,
    lastX: 0,
    lastTime: 0,
  });
  const angularVelocity = useRef(0);
  const snapAnimation = useRef<{ stop: () => void } | null>(null);
  const suppressClick = useRef(false);

  const rotation = useMotionValue(0);
  const rotationSpring = useSpring(rotation, {
    stiffness: 86,
    damping: 21,
    mass: 0.78,
  });
  const ringTransform = useTransform(
    rotationSpring,
    (value) => `rotateX(-7deg) rotateY(${value}deg)`
  );

  const angleStep = projects.length > 0 ? 360 / projects.length : 0;
  const activeProject = projects[activeIndex] ?? projects[0];
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];

  useMotionValueEvent(rotationSpring, "change", (latest) => {
    if (projects.length === 0 || angleStep === 0) {
      return;
    }

    const nextIndex = mod(Math.round(-latest / angleStep), projects.length);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useAnimationFrame((_, delta) => {
    if (
      shouldReduceMotion ||
      mode !== "ring" ||
      dragState.current.active ||
      projects.length === 0
    ) {
      return;
    }

    const seconds = delta / 1000;
    const currentVelocity = angularVelocity.current;
    const resting = Math.abs(currentVelocity) < 0.08;
    const ambientVelocity = hovered ? idleVelocity * 0.28 : idleVelocity;
    const appliedVelocity = resting ? ambientVelocity : currentVelocity;

    rotation.set(rotation.get() + appliedVelocity * seconds);

    if (!resting) {
      angularVelocity.current =
        currentVelocity * Math.pow(0.91, delta / 16.67);
    } else {
      angularVelocity.current = 0;
    }
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

  function scrollShowcaseIntoView() {
    window.requestAnimationFrame(() => {
      const top =
        (sectionRef.current?.getBoundingClientRect().top ?? 0) +
        window.scrollY -
        72;

      window.scrollTo({ behavior: "smooth", top });
    });
  }

  function selectFromRing(project: Project) {
    if (suppressClick.current) {
      return;
    }

    setSelectedProjectIndex(projectIndex(projects, project));
    setMode("preview");
    scrollShowcaseIntoView();
  }

  function snapToIndex(index: number) {
    if (angleStep === 0) {
      return;
    }

    stopSnapAnimation();
    angularVelocity.current = 0;
    const target = -mod(index, projects.length) * angleStep;

    snapAnimation.current = animate(rotation, target, {
      type: "spring",
      stiffness: 82,
      damping: 18,
      mass: 0.86,
    });
  }

  function stepPreview(direction: -1 | 1) {
    setSelectedProjectIndex((current) => mod(current + direction, projects.length));
  }

  function stepRing(direction: -1 | 1) {
    snapToIndex(activeIndex + direction);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    stopSnapAnimation();
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
    if (!dragState.current.active) {
      return;
    }

    const now = performance.now();
    const state = dragState.current;
    const totalOffset = event.clientX - state.startX;
    const deltaX = event.clientX - state.lastX;
    const deltaTime = Math.max(now - state.lastTime, 16);

    if (Math.abs(totalOffset) > 6) {
      suppressClick.current = true;
    }

    rotation.set(state.startRotation + totalOffset * dragDegreesPerPixel);
    angularVelocity.current =
      (deltaX / deltaTime) * dragDegreesPerPixel * 1000;
    state.lastX = event.clientX;
    state.lastTime = now;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) {
      return;
    }

    dragState.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      suppressClick.current = false;
    }, 120);
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured research albums"
      className="relative overflow-hidden py-4 sm:py-6"
      ref={sectionRef}
    >
      <AnimatePresence mode="wait">
        {mode === "ring" ? (
          <motion.div
            key="ring"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <div className="page-shell flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase text-antique/72">
                  Featured project records
                </p>
                <h2 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                  Rotating research archive
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-6 text-white/48 sm:block">
                Drag with momentum, choose a cover, then open the project from
                the preview.
              </p>
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
                  style={{
                    transform: ringTransform,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {projects.map((project, index) => (
                    <RingAlbumCard
                      active={index === activeIndex}
                      angle={index * angleStep}
                      index={index}
                      key={project.slug}
                      project={project}
                      onHover={setHovered}
                      onSelect={selectFromRing}
                    />
                  ))}
                </motion.div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex justify-center px-5 text-center">
                <div className="max-w-[90vw]">
                  <p className="text-xs uppercase text-white/36">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                    {activeProject.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-sm text-white/44">
                    {activeProject.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="page-shell -mt-4 flex items-center justify-center gap-4">
              <button
                aria-label="Previous project cover"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => stepRing(-1)}
              >
                ←
              </button>
              <button
                className="rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/60 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => selectFromRing(activeProject)}
              >
                Select cover
              </button>
              <button
                aria-label="Next project cover"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => stepRing(1)}
              >
                →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="page-shell"
            key="preview"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
          >
            <div className="grid min-h-[520px] items-center gap-10 py-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(320px,0.4fr)]">
              <PreviewCover
                index={selectedProjectIndex}
                project={selectedProject}
                onOpen={() => openProject(selectedProject)}
              />

              <div>
                <p className="text-sm font-medium text-mist">
                  {String(selectedProjectIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </p>
                <h2 className="mt-5 text-4xl font-medium leading-tight text-white sm:text-5xl">
                  {selectedProject.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-white/58">
                  {selectedProject.subtitle}
                </p>

                <p className="mt-8 max-w-xl text-sm leading-7 text-white/58">
                  {selectedProject.visibility === "locked"
                    ? "This project is currently being refined. A full detail page will be published when the writeup is ready."
                    : selectedProject.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedProject.tags.slice(0, 5).map((tag) => (
                    <span
                      className="border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-white/52"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    className="border border-mist/32 px-5 py-3 text-sm text-white transition hover:border-mist/72 hover:bg-mist/10"
                    type="button"
                    onClick={() => openProject(selectedProject)}
                  >
                    {selectedProject.visibility === "public"
                      ? "Open project"
                      : "Coming soon"}
                  </button>
                  <button
                    className="border border-white/12 px-5 py-3 text-sm text-white/60 transition hover:border-white/26 hover:bg-white/[0.045] hover:text-white"
                    type="button"
                    onClick={() => {
                      setMode("ring");
                      scrollShowcaseIntoView();
                    }}
                  >
                    Return to ring
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pb-5">
              <button
                aria-label="Previous project"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => stepPreview(-1)}
              >
                ←
              </button>
              <span className="text-sm text-white/38">
                {String(selectedProjectIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Next project"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/62 transition hover:border-mist/45 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => stepPreview(1)}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComingSoonModal
        open={Boolean(lockedProject)}
        projectTitle={lockedProject?.title}
        onClose={() => setLockedProject(undefined)}
      />
    </section>
  );
}
