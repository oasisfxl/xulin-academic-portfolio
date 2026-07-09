import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentKind = "projects" | "notes";
export type ContentVisibility = "public" | "locked" | "hidden";

export type ContentMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  date?: string;
  updated?: string;
  year?: string;
  status?: string;
  visibility: ContentVisibility;
  tags: string[];
  cover?: string;
  relatedProjects?: string[];
};

export type ContentDocument = {
  meta: ContentMeta;
  source: string;
};

const contentRoot = path.join(process.cwd(), "content");

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asVisibility(value: unknown): ContentVisibility {
  return value === "locked" || value === "hidden" ? value : "public";
}

function toSlug(filePath: string) {
  return filePath.replace(/\/index\.mdx$/, "").replace(/\.mdx$/, "");
}

function contentPath(kind: ContentKind, slug: string) {
  const base = path.join(contentRoot, kind);
  const candidates = [
    path.join(base, `${slug}.mdx`),
    path.join(base, slug, "index.mdx"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function collectMdxFiles(kind: ContentKind) {
  const dir = path.join(contentRoot, kind);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [entry.name];
      }

      const indexFile = path.join(dir, entry.name, "index.mdx");
      if (entry.isDirectory() && fs.existsSync(indexFile)) {
        return [`${entry.name}/index.mdx`];
      }

      return [];
    })
    .sort();
}

function parseDocument(kind: ContentKind, file: string): ContentDocument {
  const absolutePath = path.join(contentRoot, kind, file);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = matter(raw);
  const slug = toSlug(file);
  const title = asString(parsed.data.title, slug);

  return {
    meta: {
      slug,
      title,
      subtitle: asString(parsed.data.subtitle),
      summary: asString(parsed.data.summary, asString(parsed.data.description)),
      date: asString(parsed.data.date),
      updated: asString(parsed.data.updated),
      year: asString(parsed.data.year),
      status: asString(parsed.data.status),
      visibility: asVisibility(parsed.data.visibility),
      tags: asStringArray(parsed.data.tags),
      cover: asString(parsed.data.cover),
      relatedProjects: asStringArray(parsed.data.relatedProjects),
    },
    source: parsed.content.trim(),
  };
}

export function getAllContent(kind: ContentKind) {
  return collectMdxFiles(kind)
    .map((file) => parseDocument(kind, file))
    .sort((a, b) => {
      const dateA = a.meta.updated || a.meta.date || a.meta.year || "";
      const dateB = b.meta.updated || b.meta.date || b.meta.year || "";
      return dateB.localeCompare(dateA);
    });
}

export function getVisibleContent(kind: ContentKind) {
  return getAllContent(kind).filter((doc) => doc.meta.visibility !== "hidden");
}

export function getPublicContent(kind: ContentKind) {
  return getAllContent(kind).filter((doc) => doc.meta.visibility === "public");
}

export function getContentBySlug(kind: ContentKind, slug: string) {
  const filePath = contentPath(kind, slug);

  if (!filePath) {
    return undefined;
  }

  const relativeFile = path.relative(path.join(contentRoot, kind), filePath);
  return parseDocument(kind, relativeFile);
}

export function getPublicContentBySlug(kind: ContentKind, slug: string) {
  const doc = getContentBySlug(kind, slug);
  return doc?.meta.visibility === "public" ? doc : undefined;
}
