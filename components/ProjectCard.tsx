"use client";

import { Project } from "@/data/projects";
import { projectHref } from "@/lib/projects";
import { motion } from "framer-motion";
import Link from "next/link";

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
      <Link
        className="inline-flex items-center gap-2 text-xl font-medium text-white transition hover:text-mist"
        href={projectHref(project)}
      >
        {project.title}
        <span aria-hidden="true" className="text-sm text-white/38">
          ↗
        </span>
      </Link>
    );
  }

  return (
    <button
      className="inline-flex items-center gap-2 text-left text-xl font-medium text-white transition hover:text-mist"
      type="button"
      onClick={() => onLockedProject(project)}
    >
      {project.title}
      <span className="border border-white/12 px-2 py-1 text-[10px] uppercase text-antique/82">
        Coming soon
      </span>
    </button>
  );
}

export function ProjectCard({ project, onLockedProject }: ProjectCardProps) {
  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );

  return (
    <motion.article
      className="group relative -mx-4 grid gap-5 overflow-hidden border-t border-white/[0.08] px-4 py-8 transition duration-300 hover:border-mist/30 hover:bg-white/[0.025] hover:shadow-[0_0_54px_rgba(170,183,207,0.09)] sm:grid-cols-[116px_minmax(0,1fr)]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="absolute -left-32 top-1/2 h-44 w-72 -translate-y-1/2 bg-[radial-gradient(circle,rgba(170,183,207,0.18),transparent_68%)]" />
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist/36 to-transparent" />
      </span>
      <div className="flex items-center gap-3 text-sm text-white/42 sm:block">
        <p>{project.year}</p>
        <p className="sm:mt-2">{project.type}</p>
      </div>
      <div>
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
