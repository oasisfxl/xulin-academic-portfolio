import { isAdminRequest } from "@/lib/admin-auth";
import { writeRepositoryFile } from "@/lib/github-content";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const validKinds = new Set(["notes", "projects"]);
const validVisibilities = new Set(["public", "locked", "hidden"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.map(text).filter(Boolean)
    : [];
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return new NextResponse(null, { status: 401 });

  const input = (await request.json()) as Record<string, unknown>;
  const kind = text(input.kind);
  const slug = text(input.slug);
  const title = text(input.title);
  const summary = text(input.summary);
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const visibility = validVisibilities.has(text(input.visibility))
    ? text(input.visibility)
    : "public";

  if (!validKinds.has(kind)) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
  }

  if (!slugPattern.test(slug)) {
    return NextResponse.json(
      { error: "Slug must use lowercase letters, numbers, and hyphens." },
      { status: 400 }
    );
  }

  if (!title || !summary || !body) {
    return NextResponse.json(
      { error: "Title, summary, and document body are required." },
      { status: 400 }
    );
  }

  const data: Record<string, string | string[] | boolean | Record<string, string>> = {
    title,
    subtitle: text(input.subtitle),
    summary,
    visibility,
    tags: stringList(input.tags),
    type: text(input.type) || (kind === "notes" ? "Note" : "Project"),
    featured: input.featured === true,
    coverTone: text(input.coverTone) || "mist",
  };

  if (kind === "notes") {
    data.date = text(input.date);
    data.updated = text(input.updated) || text(input.date);
  } else {
    data.year = text(input.year);
    data.status = text(input.status) || "In Progress";
  }

  const cover = text(input.cover);
  const relatedProjects = stringList(input.relatedProjects);
  if (cover) data.cover = cover;
  if (relatedProjects.length > 0) data.relatedProjects = relatedProjects;

  const links = {
    paper: text(input.paperLink),
    code: text(input.codeLink),
    demo: text(input.demoLink),
  };
  const cleanLinks = Object.fromEntries(Object.entries(links).filter(([, value]) => value));
  if (Object.keys(cleanLinks).length > 0) data.links = cleanLinks;

  const relativePath = `content/${kind}/${slug}.mdx`;
  const targetDirectory = path.join(process.cwd(), "content", kind);
  const targetFile = path.join(process.cwd(), relativePath);
  const source = matter.stringify(`${body}\n`, data);

  if (process.env.NODE_ENV === "production") {
    await writeRepositoryFile(relativePath, source, `Publish ${kind.slice(0, -1)}: ${title}`);
  } else {
    await fs.mkdir(targetDirectory, { recursive: true });
    await fs.writeFile(targetFile, source, "utf8");
  }

  return NextResponse.json({
    path: relativePath,
    published: process.env.NODE_ENV === "production",
    slug,
  });
}
