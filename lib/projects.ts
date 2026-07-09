import { Project, projects } from "@/data/projects";

export function getVisibleProjects() {
  return projects.filter((project) => project.visibility !== "hidden");
}

export function getFeaturedProjects() {
  return getVisibleProjects().filter((project) => project.featured);
}

export function getPublicProjects() {
  return projects.filter((project) => project.visibility === "public");
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getPublicProjectBySlug(slug: string) {
  const project = getProjectBySlug(slug);
  return project?.visibility === "public" ? project : undefined;
}

export function projectHref(project: Project) {
  return `/projects/${project.slug}`;
}
