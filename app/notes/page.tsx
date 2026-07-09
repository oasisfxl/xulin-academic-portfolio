import { ProjectList } from "@/components/ProjectList";
import { getVisibleProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Technical notes and research logs by Xulin Fu.",
};

export default function NotesPage() {
  const notes = getVisibleProjects().filter((project) => project.type === "Note");

  return (
    <section className="page-shell py-20">
      <div className="max-w-3xl">
        <p className="text-sm uppercase text-antique/72">Notes</p>
        <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
          Working notes
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/58">
          Short technical writeups for robot learning, imitation learning,
          evaluation practice, and generative policy ideas.
        </p>
      </div>
      <div className="mt-16">
        <ProjectList projects={notes} />
      </div>
    </section>
  );
}
