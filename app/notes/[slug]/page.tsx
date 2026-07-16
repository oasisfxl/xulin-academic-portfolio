import { MdxContent } from "@/components/mdx/MdxContent";
import { LineSidebar } from "@/components/react-bits/LineSidebar";
import { SplitText } from "@/components/react-bits/SplitText";
import {
  extractDocumentHeadings,
  getPublicContent,
  getPublicContentBySlug,
} from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type NotePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublicContent("notes").map((doc) => ({
    slug: doc.meta.slug,
  }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPublicContentBySlug("notes", slug);

  if (!doc) {
    return {
      title: "Note",
    };
  }

  return {
    title: doc.meta.title,
    description: doc.meta.summary,
  };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const doc = getPublicContentBySlug("notes", slug);

  if (!doc) {
    notFound();
  }
  const headings = extractDocumentHeadings(doc.source);
  const splitType = /[\u3400-\u9fff]/.test(doc.meta.title) ? "chars" : "words";

  return (
    <article className="page-shell py-14 sm:py-20">
      <Link
        className="group inline-flex items-center gap-2 text-sm text-white/46 transition hover:text-white"
        href="/notes"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        Back to notes
      </Link>

      <div className="mt-9 grid gap-12 border-b border-white/[0.1] pb-14 lg:grid-cols-[minmax(0,0.72fr)_0.28fr] lg:pb-16">
        <div>
          <p className="text-sm uppercase text-antique/72">
            {doc.meta.date || "Note"}
          </p>
          <SplitText
            className="mt-5 text-balance text-5xl font-medium leading-tight text-white sm:text-7xl"
            delay={splitType === "chars" ? 38 : 34}
            splitType={splitType}
            tag="h1"
            text={doc.meta.title}
          />
          {doc.meta.subtitle ? (
            <p className="mt-5 text-xl leading-8 text-white/62">
              {doc.meta.subtitle}
            </p>
          ) : null}
          <p className="mt-9 max-w-3xl text-lg leading-9 text-white/72">
            {doc.meta.summary}
          </p>
        </div>

        <aside className="border-t border-white/[0.09] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
          <dl className="grid gap-5 text-sm">
            {doc.meta.updated ? (
              <div>
                <dt className="text-white/36">Updated</dt>
                <dd className="mt-1 text-white/74">{doc.meta.updated}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-white/36">Tags</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {doc.meta.tags.map((tag) => (
                  <span
                    className="bg-white/[0.045] px-2.5 py-1 text-xs text-white/56"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
            {doc.meta.relatedProjects?.length ? (
              <div>
                <dt className="text-white/36">Related</dt>
                <dd className="mt-3 grid gap-2">
                  {doc.meta.relatedProjects.map((project) => (
                    <Link
                      className="text-mist/76 transition hover:text-white"
                      href={`/projects/${project}`}
                      key={project}
                    >
                      {project}
                    </Link>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>

      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 pt-12 md:grid-cols-[minmax(190px,0.24fr)_minmax(0,0.76fr)] md:gap-10 md:pt-16 lg:gap-12">
        <aside className="min-w-0 md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs uppercase text-white/34">Contents</p>
          <LineSidebar headings={headings} />
        </aside>
        <MdxContent source={doc.source} />
      </section>
    </article>
  );
}
