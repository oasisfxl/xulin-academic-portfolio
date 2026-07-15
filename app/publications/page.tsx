import { PageIntro } from "@/components/PageIntro";
import { ProjectList } from "@/components/ProjectList";
import { getVisibleProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Papers and preprints by Xulin Fu.",
};

export default function PublicationsPage() {
  const publications = getVisibleProjects().filter(
    (project) => project.type === "Paper"
  );

  return (
    <section className="page-shell py-14 sm:py-20">
      <PageIntro
        descriptionKey="publications.description"
        eyebrowKey="publications.eyebrow"
        titleKey="publications.title"
      />
      <div className="mt-12 sm:mt-16">
        {publications.length > 0 ? (
          <ProjectList projects={publications} />
        ) : (
          <p className="border-t border-white/[0.08] py-8 text-white/52">
            Publications will be added here.
          </p>
        )}
      </div>
    </section>
  );
}
