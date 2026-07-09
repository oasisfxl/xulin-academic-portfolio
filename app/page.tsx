import { AlbumShowcase } from "@/components/AlbumShowcase";
import { HomeHero } from "@/components/HomeHero";
import { ProjectList } from "@/components/ProjectList";
import { getFeaturedProjects, getVisibleProjects } from "@/lib/projects";

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  const visibleProjects = getVisibleProjects();

  return (
    <>
      <HomeHero />
      <AlbumShowcase projects={featuredProjects} />
      <section className="page-shell mt-16">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase text-antique/72">
              Featured Projects
            </p>
            <h2 className="mt-3 text-3xl font-medium text-white">
              Selected work
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/48">
            A readable index for papers, reproductions, notes, and deployment
            experiments.
          </p>
        </div>
        <ProjectList projects={visibleProjects} />
      </section>
    </>
  );
}
