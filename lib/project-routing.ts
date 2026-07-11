import type { Project } from "@/data/projects";

export function projectHref(project: Project) {
  if (project.type === "Note" && project.links?.note) {
    return project.links.note;
  }
  return `/projects/${project.slug}`;
}
