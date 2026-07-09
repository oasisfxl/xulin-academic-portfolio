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
    <section className="page-shell py-20">
      <div className="max-w-3xl">
        <p className="text-sm uppercase text-antique/72">Publications</p>
        <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
          Papers and preprints
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/58">
          Formal research outputs and manuscripts connected to embodied
          intelligence and humanoid manipulation.
        </p>
      </div>
      <div className="mt-16">
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
