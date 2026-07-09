import { MdxContent } from "@/components/mdx/MdxContent";
import { getPublicContent, getPublicContentBySlug } from "@/lib/content";
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

  return (
    <article className="page-shell py-20">
      <Link
        className="text-sm text-white/46 transition hover:text-white"
        href="/notes"
      >
        ← Back to notes
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_0.28fr]">
        <div>
          <p className="text-sm uppercase text-antique/72">
            {doc.meta.date || "Note"}
          </p>
          <h1 className="mt-5 text-balance text-5xl font-medium leading-tight text-white sm:text-7xl">
            {doc.meta.title}
          </h1>
          {doc.meta.subtitle ? (
            <p className="mt-5 text-xl leading-8 text-white/62">
              {doc.meta.subtitle}
            </p>
          ) : null}
          <p className="mt-10 max-w-3xl text-lg leading-9 text-white/68">
            {doc.meta.summary}
          </p>
        </div>

        <aside className="border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
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

      <section className="mt-20 grid gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-[0.22fr_minmax(0,0.78fr)]">
        <h2 className="text-sm uppercase text-white/40">Note</h2>
        <MdxContent source={doc.source} />
      </section>
    </article>
  );
}
