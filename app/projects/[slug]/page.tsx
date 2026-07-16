import { MdxContent } from "@/components/mdx/MdxContent";
import { LineSidebar } from "@/components/react-bits/LineSidebar";
import { SplitText } from "@/components/react-bits/SplitText";
import { extractDocumentHeadings, getContentBySlug } from "@/lib/content";
import { projectHref } from "@/lib/project-routing";
import {
  getPublicProjectBySlug,
  getPublicProjects,
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
  const doc = getContentBySlug("projects", slug);

  if (!project) {
    return {
      title: "Project",
    };
  }

  return {
    title: doc?.meta.title || project.title,
    description: doc?.meta.summary || project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const doc = getContentBySlug("projects", slug);
  const shouldRenderDoc = doc?.meta.visibility === "public";
  const title = doc?.meta.title || project.title;
  const headings = shouldRenderDoc ? extractDocumentHeadings(doc.source) : [];
  const splitType = /[\u3400-\u9fff]/.test(title) ? "chars" : "words";
  const titleSize = title.length > 56
    ? "text-4xl leading-[1.08] sm:text-6xl sm:leading-[1.06] lg:text-7xl"
    : "text-5xl leading-tight sm:text-7xl";
  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1])
  );

  return (
    <article className="page-shell py-14 sm:py-20">
      <Link
        className="group inline-flex items-center gap-2 text-sm text-white/46 transition hover:text-white"
        href="/projects"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        Back to projects
      </Link>

      <div className="mt-9 grid gap-12 border-b border-white/[0.1] pb-14 lg:grid-cols-[minmax(0,0.72fr)_0.28fr] lg:pb-16">
        <div>
          <p className="text-sm uppercase text-antique/72">
            {project.year} / {project.type}
          </p>
          <SplitText
            className={`mt-5 text-balance font-medium text-white ${titleSize}`}
            delay={splitType === "chars" ? 36 : 28}
            splitType={splitType}
            tag="h1"
            text={title}
          />
          <p className="mt-5 text-xl leading-8 text-white/62">
            {doc?.meta.subtitle || project.subtitle}
          </p>
          <p className="mt-9 max-w-3xl text-lg leading-9 text-white/72">
            {doc?.meta.summary || project.description}
          </p>
        </div>

        <aside className="border-t border-white/[0.09] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
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

      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 pt-12 md:grid-cols-[minmax(190px,0.24fr)_minmax(0,0.76fr)] md:gap-10 md:pt-16 lg:gap-12">
        <aside className="min-w-0 md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs uppercase text-white/34">
            {headings.length ? "Contents" : "Document"}
          </p>
          <LineSidebar headings={headings} />
        </aside>
        {shouldRenderDoc ? (
          <MdxContent source={doc.source} />
        ) : (
          <div className="space-y-6 text-base leading-8 text-white/62">
            <p>
              This public detail page is ready for a full MDX writeup. Add one
              at <code>content/projects/{project.slug}.mdx</code>.
            </p>
          </div>
        )}
      </section>

      {links.length > 0 ? (
        <section className="mt-12 flex flex-wrap gap-4 border-t border-white/[0.08] pt-8 text-sm text-mist/82">
          {links.map(([label, href]) => (
            <a
            className="rounded-[6px] border border-white/10 bg-white/[0.025] px-4 py-2.5 transition hover:border-mist/45 hover:bg-white/[0.06] hover:text-white"
              href={href}
              key={label}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              target={href.startsWith("http") ? "_blank" : undefined}
            >
              {label}
            </a>
          ))}
          <Link
            className="rounded-[6px] border border-white/10 bg-white/[0.025] px-4 py-2.5 text-white/50 transition hover:border-white/22 hover:bg-white/[0.06] hover:text-white"
            href={projectHref(project)}
          >
            permalink
          </Link>
        </section>
      ) : null}
    </article>
  );
}
