import { Callout } from "@/components/mdx/Callout";
import { ExternalVideo } from "@/components/mdx/ExternalVideo";
import { Figure } from "@/components/mdx/Figure";
import { Video } from "@/components/mdx/Video";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type MdxContentProps = {
  source: string;
};

const components = {
  Callout,
  ExternalVideo,
  Figure,
  Video,
};

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="doc-prose">
      <MDXRemote
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            remarkPlugins: [remarkGfm],
          },
        }}
        source={source}
      />
    </div>
  );
}
