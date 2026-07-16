"use client";

import { Project } from "@/data/projects";
import { projectCoverStyle } from "@/lib/covers";
import { projectHref } from "@/lib/project-routing";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, PointerEvent } from "react";

const MotionLink = motion.create(Link);

type ProjectCardProps = {
  project: Project;
  onLockedProject: (project: Project) => void;
};

function ProjectTitle({
  project,
  onLockedProject,
}: {
  project: Project;
  onLockedProject: (project: Project) => void;
}) {
  if (project.visibility === "public") {
    return (
      <MotionLink
        className="inline-flex items-center gap-2 text-xl font-medium text-white transition-colors hover:text-mist"
        href={projectHref(project)}
        whileTap={{ scale: 0.975 }}
      >
        {project.title}
        <motion.span
          aria-hidden="true"
          className="text-sm text-white/38 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          ↗
        </motion.span>
      </MotionLink>
    );
  }

  return (
    <motion.button
      className="inline-flex items-center gap-2 text-left text-xl font-medium text-white transition hover:text-mist"
      type="button"
      whileTap={{ scale: 0.975 }}
      onClick={() => onLockedProject(project)}
    >
      {project.title}
      <span className="border border-white/12 px-2 py-1 text-[10px] uppercase text-antique/82">
        Coming soon
      </span>
    </motion.button>
  );
}

export function ProjectCard({
  project,
  onLockedProject,
}: ProjectCardProps) {
  const router = useRouter();
  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );

  function openProject() {
    if (project.visibility === "public") {
      router.push(projectHref(project));
      return;
    }
    onLockedProject(project);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      return;
    }
    openProject();
  }

  function trackSpotlight(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.article
      aria-label={`${project.title}${project.visibility === "locked" ? ", Coming soon" : ""}`}
      className="spotlight-row group grid cursor-pointer gap-5 overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#101012]/90 p-4 transition-[background-color,border-color,box-shadow] duration-300 hover:z-10 hover:border-mist/28 hover:bg-[#141417] hover:shadow-[0_22px_70px_rgba(0,0,0,0.3)] focus-visible:z-10 focus-visible:bg-[#141417] sm:grid-cols-[96px_minmax(0,1fr)] sm:p-5"
      initial={{ opacity: 0, scale: 0.965, y: 16 }}
      whileHover={{ scale: 1.006, x: 5 }}
      whileTap={{ scale: 0.995, x: 2 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.72 }}
      onClick={handleCardClick}
      onPointerMove={trackSpotlight}
    >
      <span className="pointer-events-none absolute inset-0 z-[3] opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist/36 to-transparent" />
        <span className="absolute inset-y-0 left-0 w-px bg-mist/28" />
      </span>
      <div className="relative z-[2]">
        <div
          aria-hidden="true"
          className="aspect-square w-20 overflow-hidden rounded-[5px] border border-white/10 bg-graphite-850 shadow-[0_12px_34px_rgba(0,0,0,0.3)] sm:w-24"
          style={projectCoverStyle(project)}
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-white/38 sm:block">
          <p>{project.year}</p>
          <p className="sm:mt-1">{project.type}</p>
        </div>
      </div>
      <div className="relative z-[2]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <ProjectTitle
              project={project}
              onLockedProject={onLockedProject}
            />
            <p className="mt-2 text-sm text-white/55">{project.subtitle}</p>
          </div>
          <span className="w-fit border border-white/[0.08] px-2.5 py-1 text-xs text-white/48">
            {project.status}
          </span>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              className="bg-white/[0.045] px-2.5 py-1 text-xs text-white/54"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        {links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-mist/80">
            {links.map(([label, href]) => (
              <a
                className="transition hover:text-white"
                href={href}
                key={label}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                target={href.startsWith("http") ? "_blank" : undefined}
              >
                {label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
