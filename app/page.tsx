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
      <AlbumShowcase projects={featuredProjects} />
      <section className="page-shell mt-16">
        <HomeFeaturedHeader />
        <ProjectList projects={visibleProjects} />
      </section>
    </>
  );
}
