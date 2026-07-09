import {
  getPublicProjectBySlug,
  getPublicProjects,
  projectHref,
} from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublicProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);
  const links = Object.entries(project?.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );

  if (!project) {
    notFound();
  }

  return (
    <article className="page-shell py-20">
      <Link
        className="text-sm text-white/46 transition hover:text-white"
        href="/projects"
      >
        ← Back to projects
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_0.28fr]">
        <div>
          <p className="text-sm uppercase text-antique/72">
            {project.year} / {project.type}
          </p>
          <h1 className="mt-5 text-balance text-5xl font-medium leading-tight text-white sm:text-7xl">
            {project.title}
          </h1>
          <p className="mt-5 text-xl leading-8 text-white/62">
            {project.subtitle}
          </p>
          <p className="mt-10 max-w-3xl text-lg leading-9 text-white/68">
            {project.description}
          </p>
        </div>

        <aside className="border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <dl className="grid gap-5 text-sm">
            <div>
              <dt className="text-white/36">Status</dt>
              <dd className="mt-1 text-white/74">{project.status}</dd>
            </div>
            <div>
              <dt className="text-white/36">Type</dt>
              <dd className="mt-1 text-white/74">{project.type}</dd>
            </div>
            <div>
              <dt className="text-white/36">Tags</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    className="bg-white/[0.045] px-2.5 py-1 text-xs text-white/56"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="mt-20 grid gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-[0.28fr_minmax(0,0.72fr)]">
        <h2 className="text-sm uppercase text-white/40">Notes</h2>
        <div className="space-y-6 text-base leading-8 text-white/62">
          <p>
            This page is intentionally lightweight for the first version. It is
            ready for method diagrams, experiment logs, paper links, videos, and
            reproducibility notes as the project matures.
          </p>
          <p>
            Future updates can add hardware setup, dataset notes, training
            curves, ablations, and deployment videos without changing the site
            structure.
          </p>
        </div>
      </section>

      {links.length > 0 ? (
        <section className="mt-12 flex flex-wrap gap-4 border-t border-white/[0.08] pt-8 text-sm text-mist/82">
          {links.map(([label, href]) => (
            <a
              className="border border-white/10 px-4 py-2 transition hover:border-mist/45 hover:text-white"
              href={href}
              key={label}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              target={href.startsWith("http") ? "_blank" : undefined}
            >
              {label}
            </a>
          ))}
          <Link
            className="border border-white/10 px-4 py-2 text-white/50 transition hover:border-white/22 hover:text-white"
            href={projectHref(project)}
          >
            permalink
          </Link>
        </section>
      ) : null}
    </article>
  );
}
