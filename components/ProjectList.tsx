"use client";

import { ComingSoonModal } from "@/components/ComingSoonModal";
import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/data/projects";
import { useState } from "react";

type ProjectListProps = {
  projects: Project[];
};

export function ProjectList({ projects }: ProjectListProps) {
  const [lockedProject, setLockedProject] = useState<Project | undefined>();

  return (
    <>
      <div>
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onLockedProject={setLockedProject}
          />
        ))}
      </div>
      <ComingSoonModal
        open={Boolean(lockedProject)}
        projectTitle={lockedProject?.title}
        onClose={() => setLockedProject(undefined)}
      />
    </>
  );
}
