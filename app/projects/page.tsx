import { PageIntro } from "@/components/PageIntro";
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
      <PageIntro
        descriptionKey="projects.description"
        eyebrowKey="projects.eyebrow"
        titleKey="projects.title"
      />
      <div className="mt-16">
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
