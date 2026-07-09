import { ProjectList } from "@/components/ProjectList";
import { getVisibleProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Research projects, reproductions, experiments, and notes by Xulin Fu.",
};

export default function ProjectsPage() {
  const projects = getVisibleProjects();

  return (
    <section className="page-shell py-20">
      <div className="max-w-3xl">
        <p className="text-sm uppercase text-antique/72">Projects</p>
        <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
          Research index
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/58">
          A consolidated view of papers, reproductions, experiments, and notes
          around deployable robot learning systems.
        </p>
      </div>
      <div className="mt-16">
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
