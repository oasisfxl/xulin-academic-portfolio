import { ContentStudio } from "@/components/studio/ContentStudio";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllContent } from "@/lib/content";
import { getAllProjects } from "@/lib/projects";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export default async function StudioPage() {
  const session = await getAdminSession();
  if (!session) redirect("/studio/login");
  const allProjects = getAllProjects();

  function withProjectDefaults(document: ReturnType<typeof getAllContent>[number]) {
    const project = allProjects.find((candidate) => candidate.slug === document.meta.slug);
    return {
      ...document,
      meta: {
        ...document.meta,
        featured: document.meta.featured ?? project?.featured,
        cover: document.meta.cover || project?.cover,
        coverTone: document.meta.coverTone || project?.coverTone,
        type: document.meta.type || project?.type,
        links: document.meta.links || project?.links,
      },
    };
  }

  const documents = [
    ...getAllContent("notes").map((document) => ({
      ...withProjectDefaults(document),
      kind: "notes" as const,
    })),
    ...getAllContent("projects").map((document) => ({
      ...withProjectDefaults(document),
      kind: "projects" as const,
    })),
  ];

  const projectOptions = allProjects
    .filter((project) => project.visibility !== "hidden")
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      summary: project.description,
      status: project.status,
      visibility: project.visibility,
      year: project.year,
      tags: project.tags,
      featured: project.featured,
      cover: project.cover,
      coverTone: project.coverTone,
      type: project.type,
    }));

  return (
    <ContentStudio
      adminLogin={session.login}
      initialDocuments={documents}
      projectOptions={projectOptions}
    />
  );
}
