import { Project, projects as legacyProjects } from "@/data/projects";
import { getAllContent, type ContentDocument, type ContentKind } from "@/lib/content";

const validStatuses = new Set<Project["status"]>([
  "Published",
  "Preprint",
  "In Progress",
  "Reproduced",
  "Archived",
]);

function contentProject(
  document: ContentDocument,
  kind: ContentKind,
  existing?: Project
): Project {
  const { meta } = document;
  const year = meta.year || meta.date?.slice(0, 4) || meta.updated?.slice(0, 4) || new Date().getFullYear().toString();
  const status = validStatuses.has(meta.status as Project["status"])
    ? (meta.status as Project["status"])
    : kind === "notes" ? "Published" : "In Progress";
  const type = meta.type || (kind === "notes" ? "Note" : "Project");
  const links = {
    ...(existing?.links ?? {}),
    ...(meta.links ?? {}),
    ...(kind === "notes" ? { note: `/notes/${meta.slug}` } : {}),
  };

  return {
    slug: meta.slug,
    title: meta.title || existing?.title || meta.slug,
    subtitle: meta.subtitle || existing?.subtitle || "",
    type,
    year,
    status,
    visibility: meta.visibility,
    featured: meta.featured ?? existing?.featured ?? false,
    cover: meta.cover || existing?.cover,
    coverTone: meta.coverTone || existing?.coverTone || "mist",
    description: meta.summary || existing?.description || "",
    tags: meta.tags.length > 0 ? meta.tags : existing?.tags ?? [],
    links: Object.values(links).some(Boolean) ? links : undefined,
  };
}

export function getAllProjects() {
  const records = new Map(
    legacyProjects.map((project) => [project.slug, { ...project }])
  );

  for (const kind of ["notes", "projects"] as const) {
    for (const document of getAllContent(kind)) {
      records.set(
        document.meta.slug,
        contentProject(document, kind, records.get(document.meta.slug))
      );
    }
  }

  return [...records.values()].sort((a, b) => b.year.localeCompare(a.year));
}

export function getVisibleProjects() {
  return getAllProjects().filter((project) => project.visibility !== "hidden");
}

export function getFeaturedProjects() {
  return getVisibleProjects().filter((project) => project.featured);
}

export function getPublicProjects() {
  return getAllProjects().filter((project) => project.visibility === "public");
}

export function getProjectBySlug(slug: string) {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getPublicProjectBySlug(slug: string) {
  const project = getProjectBySlug(slug);
  return project?.visibility === "public" ? project : undefined;
}
