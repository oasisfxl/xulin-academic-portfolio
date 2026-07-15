import { AlbumShowcase } from "@/components/AlbumShowcase";
import { HomeFeaturedHeader } from "@/components/HomeFeaturedHeader";
import { HomeHero } from "@/components/HomeHero";
import { ProjectList } from "@/components/ProjectList";
import { getFeaturedProjects, getVisibleProjects } from "@/lib/projects";

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  const visibleProjects = getVisibleProjects();

  return (
    <>
      <HomeHero />
      <div className="page-shell py-12 sm:py-16">
        <AlbumShowcase projects={featuredProjects} />
      </div>
      <section className="page-shell mt-8 sm:mt-14">
        <HomeFeaturedHeader />
        <ProjectList projects={visibleProjects} />
      </section>
    </>
  );
}
