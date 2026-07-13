"use client";

import type { ContentDocument, ContentVisibility } from "@/lib/content";
import type { ProjectCoverTone, Project } from "@/data/projects";
import { upload } from "@vercel/blob/client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

type StudioKind = "notes" | "projects";

type StudioDocument = ContentDocument & {
  kind: StudioKind;
};

type StudioProject = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  status: string;
  visibility: ContentVisibility;
  year: string;
  tags: string[];
  featured: boolean;
  cover?: string;
  coverTone?: ProjectCoverTone;
  type: Project["type"];
};

type EditorDraft = {
  kind: StudioKind;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  visibility: ContentVisibility;
  tags: string;
  date: string;
  updated: string;
  year: string;
  status: string;
  type: Project["type"];
  featured: boolean;
  coverTone: ProjectCoverTone;
  cover: string;
  paperLink: string;
  codeLink: string;
  demoLink: string;
  relatedProjects: string;
  body: string;
  isNew: boolean;
};

type ContentStudioProps = {
  adminLogin: string;
  initialDocuments: StudioDocument[];
  projectOptions: StudioProject[];
};

const fieldClass =
  "w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/24 focus:border-mist/55";

const coverTones: Array<{ value: ProjectCoverTone; color: string }> = [
  { value: "mist", color: "#8d98b2" },
  { value: "antique", color: "#b5a273" },
  { value: "iris", color: "#8b80b0" },
  { value: "sage", color: "#829d99" },
  { value: "pearl", color: "#c4c0b7" },
];

function LiquidCreateButton({
  children,
  tone,
  onClick,
}: {
  children: ReactNode;
  tone: "mist" | "antique";
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 280, damping: 28, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 280, damping: 28, mass: 0.35 });
  const color = tone === "mist" ? "170,183,207" : "181,162,115";
  const glow = useMotionTemplate`radial-gradient(44px circle at ${smoothX}px ${smoothY}px, rgba(${color},0.3), rgba(${color},0.1) 48%, transparent 76%)`;

  function trackPointer(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  }

  function centerPointer(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(rect.width / 2);
    pointerY.set(rect.height / 2);
  }

  function enterButton(event: ReactPointerEvent<HTMLButtonElement>) {
    setHovered(true);
    trackPointer(event);
  }

  function leaveButton(event: ReactPointerEvent<HTMLButtonElement>) {
    setHovered(false);
    centerPointer(event);
  }

  return (
    <motion.button
      className={`group relative isolate overflow-hidden rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        tone === "mist"
          ? "border-mist/18 text-mist/78 hover:border-mist/38 hover:text-white"
          : "border-antique/18 text-antique/78 hover:border-antique/38 hover:text-white"
      }`}
      type="button"
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      onClick={onClick}
      onPointerEnter={enterButton}
      onPointerLeave={leaveButton}
      onPointerMove={trackPointer}
    >
      <motion.span
        animate={{ opacity: hovered ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 -z-10"
        initial={false}
        style={{ background: glow }}
        transition={{ duration: hovered ? 0.16 : 0.3, ease: "easeOut" }}
      />
      <span className="flex items-center gap-1.5">
        <span className="text-base font-light leading-none">+</span>
        {children}
      </span>
    </motion.button>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function draftFromDocument(document: StudioDocument): EditorDraft {
  return {
    kind: document.kind,
    slug: document.meta.slug,
    title: document.meta.title,
    subtitle: document.meta.subtitle ?? "",
    summary: document.meta.summary,
    visibility: document.meta.visibility,
    tags: document.meta.tags.join(", "),
    date: document.meta.date ?? "",
    updated: document.meta.updated ?? "",
    year: document.meta.year ?? "",
    status: document.meta.status ?? "",
    type: document.meta.type ?? (document.kind === "notes" ? "Note" : "Project"),
    featured: document.meta.featured ?? false,
    coverTone: document.meta.coverTone ?? "mist",
    cover: document.meta.cover ?? "",
    paperLink: document.meta.links?.paper ?? "",
    codeLink: document.meta.links?.code ?? "",
    demoLink: document.meta.links?.demo ?? "",
    relatedProjects: (document.meta.relatedProjects ?? []).join(", "),
    body: document.source,
    isNew: false,
  };
}

function newNoteDraft(): EditorDraft {
  const date = today();
  return {
    kind: "notes",
    slug: "",
    title: "",
    subtitle: "",
    summary: "",
    visibility: "public",
    tags: "Robot Learning",
    date,
    updated: date,
    year: "",
    status: "",
    type: "Note",
    featured: false,
    coverTone: "mist",
    cover: "",
    paperLink: "",
    codeLink: "",
    demoLink: "",
    relatedProjects: "",
    body: "## 核心问题\n\n从这里开始记录。\n\n## 实验与观察\n\n- ",
    isNew: true,
  };
}

function newProjectDraft(): EditorDraft {
  return {
    kind: "projects",
    slug: "",
    title: "",
    subtitle: "",
    summary: "",
    visibility: "public",
    tags: "Robot Learning",
    date: "",
    updated: "",
    year: new Date().getFullYear().toString(),
    status: "In Progress",
    type: "Project",
    featured: true,
    coverTone: "mist",
    cover: "",
    paperLink: "",
    codeLink: "",
    demoLink: "",
    relatedProjects: "",
    body: "## 项目概览\n\n从这里开始记录。\n\n## 实验设置\n\n## 结果与反思\n",
    isNew: true,
  };
}

function projectDraft(project: StudioProject): EditorDraft {
  return {
    kind: "projects",
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    summary: project.summary,
    visibility: project.visibility,
    tags: project.tags.join(", "),
    date: "",
    updated: "",
    year: project.year,
    status: project.status,
    type: project.type,
    featured: project.featured,
    coverTone: project.coverTone ?? "mist",
    cover: project.cover ?? "",
    paperLink: "",
    codeLink: "",
    demoLink: "",
    relatedProjects: "",
    body: "## 项目概览\n\n从这里开始记录。\n\n## 实验设置\n\n## 结果与反思\n",
    isNew: true,
  };
}

function list(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ContentStudio({
  adminLogin,
  initialDocuments,
  projectOptions,
}: ContentStudioProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [managedProjects, setManagedProjects] = useState(projectOptions);
  const firstDocument = initialDocuments[0];
  const [draft, setDraft] = useState<EditorDraft>(() =>
    firstDocument ? draftFromDocument(firstDocument) : newNoteDraft()
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [externalVideo, setExternalVideo] = useState("");

  const notes = useMemo(
    () => documents.filter((document) => document.kind === "notes"),
    [documents]
  );
  const projectDocuments = useMemo(
    () => documents.filter((document) => document.kind === "projects"),
    [documents]
  );

  function selectDocument(document: StudioDocument) {
    setDraft(draftFromDocument(document));
    setSaveState("idle");
    setMessage("");
  }

  function selectProject(project: StudioProject) {
    const existing = projectDocuments.find(
      (document) => document.meta.slug === project.slug
    );
    setDraft(existing ? draftFromDocument(existing) : projectDraft(project));
    setSaveState("idle");
    setMessage("");
  }

  function update<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  function updateTitle(value: string) {
    setDraft((current) => ({
      ...current,
      title: value,
      slug:
        current.isNew
          ? slugify(value)
          : current.slug,
    }));
    setSaveState("idle");
  }

  function appendToBody(snippet: string) {
    setDraft((current) => ({
      ...current,
      body: `${current.body.trimEnd()}\n\n${snippet}\n`,
    }));
    setSaveState("idle");
  }

  async function saveDocument(event?: FormEvent) {
    event?.preventDefault();
    setSaveState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/studio/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          tags: list(draft.tags),
          relatedProjects: list(draft.relatedProjects),
        }),
      });
      const result = (await response.json()) as { error?: string; path?: string; published?: boolean };

      if (!response.ok) {
        throw new Error(result.error || "Unable to save the document.");
      }

      const savedDocument: StudioDocument = {
        kind: draft.kind,
        meta: {
          slug: draft.slug,
          title: draft.title,
          subtitle: draft.subtitle,
          summary: draft.summary,
          visibility: draft.visibility,
          tags: list(draft.tags),
          date: draft.kind === "notes" ? draft.date : undefined,
          updated: draft.kind === "notes" ? draft.updated : undefined,
          year: draft.kind === "projects" ? draft.year : undefined,
          status: draft.kind === "projects" ? draft.status : undefined,
          type: draft.type,
          featured: draft.featured,
          coverTone: draft.coverTone,
          cover: draft.cover || undefined,
          links: {
            paper: draft.paperLink || undefined,
            code: draft.codeLink || undefined,
            demo: draft.demoLink || undefined,
          },
          relatedProjects: list(draft.relatedProjects),
        },
        source: draft.body,
      };

      setDocuments((current) => [
        ...current.filter(
          (document) =>
            !(
              document.kind === savedDocument.kind &&
              document.meta.slug === savedDocument.meta.slug
            )
        ),
        savedDocument,
      ]);
      if (draft.kind === "projects") {
        const savedProject: StudioProject = {
          slug: draft.slug,
          title: draft.title,
          subtitle: draft.subtitle,
          summary: draft.summary,
          status: draft.status,
          visibility: draft.visibility,
          year: draft.year,
          tags: list(draft.tags),
          featured: draft.featured,
          cover: draft.cover || undefined,
          coverTone: draft.coverTone,
          type: draft.type,
        };
        setManagedProjects((current) => [
          ...current.filter((project) => project.slug !== savedProject.slug),
          savedProject,
        ]);
      }
      setDraft((current) => ({ ...current, isNew: false }));
      setSaveState("saved");
      setMessage(
        result.published
          ? `Published ${result.path}. Vercel is rebuilding the site.`
          : `Saved to ${result.path}`
      );
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  async function uploadMedia(
    event: ChangeEvent<HTMLInputElement>,
    target: "body" | "cover" = "body"
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!draft.slug) {
      setSaveState("error");
      setMessage("Add a valid slug before uploading media.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      let src = "";
      let embed = "";

      if (process.env.NODE_ENV === "production") {
        const blob = await upload(`studio/${draft.slug}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/studio/media",
        });
        src = blob.url;
        embed = file.type.startsWith("image/")
          ? `<Figure\n  src="${src}"\n  alt="${file.name}"\n  caption=""\n/>`
          : `<Video\n  src="${src}"\n  caption=""\n/>`;
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", draft.slug);
        const response = await fetch("/api/studio/media", { method: "POST", body: formData });
        const result = (await response.json()) as { embed?: string; error?: string; src?: string };
        if (!response.ok || !result.embed || !result.src) {
          throw new Error(result.error || "Unable to upload media.");
        }
        src = result.src;
        embed = result.embed;
      }

      if (target === "cover") {
        update("cover", src);
        setMessage("Cover image uploaded.");
      } else {
        appendToBody(embed);
        setMessage(`Added ${src} to the document.`);
      }
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Unable to upload.");
    } finally {
      setUploading(false);
    }
  }

  function insertExternalVideo() {
    const src = externalVideo.trim();
    if (!src) return;
    appendToBody(
      `<ExternalVideo\n  src="${src}"\n  title="Video demo"\n  caption=""\n/>`
    );
    setExternalVideo("");
    setMessage("External video embed added to the document.");
  }

  const publicHref =
    draft.kind === "notes"
      ? `/notes/${draft.slug}`
      : `/projects/${draft.slug}`;

  return (
    <section className="page-shell py-10 sm:py-14">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-300/80 shadow-[0_0_16px_rgba(110,231,183,0.5)]" />
            <p className="text-xs uppercase text-white/40">Authenticated workspace</p>
          </div>
          <h1 className="mt-3 text-3xl font-medium text-white sm:text-4xl">
            Content Studio
          </h1>
        </div>
        <div className="flex items-center gap-5 text-right text-sm text-white/38">
          <Link
            className="text-white/52 transition-colors hover:text-white"
            href="/"
          >
            View site ↗
          </Link>
          <span className="h-5 w-px bg-white/10" />
          <div>
            <p>@{adminLogin}</p>
            <a
              className="mt-1 inline-block text-white/52 transition hover:text-white"
              href="/api/auth/logout"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[230px_minmax(0,1fr)_260px]">
        <aside className="border-b border-white/10 py-7 lg:border-b-0 lg:border-r lg:pr-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase text-white/38">Notes</h2>
            <LiquidCreateButton
              tone="mist"
              onClick={() => setDraft(newNoteDraft())}
            >
              New note
            </LiquidCreateButton>
          </div>
          <div className="mt-4 space-y-1">
            {notes.map((document) => (
              <button
                className={`w-full border-l px-3 py-2 text-left text-sm transition-colors ${
                  draft.kind === "notes" && draft.slug === document.meta.slug
                    ? "border-mist/70 bg-white/[0.045] text-white"
                    : "border-transparent text-white/48 hover:border-white/18 hover:text-white/80"
                }`}
                key={document.meta.slug}
                type="button"
                onClick={() => selectDocument(document)}
              >
                <span className="block truncate">{document.meta.title}</span>
                <span className="mt-1 block text-xs text-white/28">
                  {document.meta.updated || document.meta.date}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xs uppercase text-white/38">Projects</h2>
            <LiquidCreateButton
              tone="antique"
              onClick={() => setDraft(newProjectDraft())}
            >
              New project
            </LiquidCreateButton>
          </div>
          <div className="mt-4 space-y-1">
            {managedProjects.map((project) => {
              const hasDocument = projectDocuments.some(
                (document) => document.meta.slug === project.slug
              );
              const active =
                draft.kind === "projects" && draft.slug === project.slug;

              return (
                <button
                  className={`w-full border-l px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "border-antique/70 bg-white/[0.045] text-white"
                      : "border-transparent text-white/48 hover:border-white/18 hover:text-white/80"
                  }`}
                  key={project.slug}
                  type="button"
                  onClick={() => selectProject(project)}
                >
                  <span className="block truncate">{project.title}</span>
                  <span className="mt-1 block text-xs text-white/28">
                    {hasDocument ? "Document ready" : "No document"}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <form className="py-7 lg:px-8" onSubmit={saveDocument}>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <p className="text-xs uppercase text-white/38">
              {draft.kind === "notes" ? "Note" : "Project document"}
            </p>
            <span className="text-xs text-white/28">
              {draft.visibility}
            </span>
          </div>

          <label className="mt-6 block text-xs text-white/38">
            Title
            <input
              className={`${fieldClass} text-lg`}
              placeholder="Document title"
              value={draft.title}
              onChange={(event) => updateTitle(event.target.value)}
            />
          </label>

          <div className="grid gap-x-6 sm:grid-cols-2">
            <label className="mt-5 block text-xs text-white/38">
              Slug
              <input
                className={fieldClass}
                disabled={!draft.isNew}
                placeholder="english-url-slug"
                value={draft.slug}
                onChange={(event) => update("slug", slugify(event.target.value))}
              />
            </label>
            <label className="mt-5 block text-xs text-white/38">
              Visibility
              <select
                className={fieldClass}
                value={draft.visibility}
                onChange={(event) =>
                  update("visibility", event.target.value as ContentVisibility)
                }
              >
                <option value="public">public</option>
                <option value="locked">locked</option>
                <option value="hidden">hidden</option>
              </select>
            </label>
          </div>

          {draft.kind === "projects" ? (
            <label className="mt-5 block text-xs text-white/38">
              Content type
              <select
                className={fieldClass}
                value={draft.type}
                onChange={(event) => update("type", event.target.value as Project["type"])}
              >
                <option>Paper</option>
                <option>Reproduction</option>
                <option>Project</option>
                <option>Experiment</option>
                <option>Note</option>
              </select>
            </label>
          ) : null}

          <label className="mt-5 block text-xs text-white/38">
            Subtitle
            <input
              className={fieldClass}
              placeholder="One concise supporting line"
              value={draft.subtitle}
              onChange={(event) => update("subtitle", event.target.value)}
            />
          </label>

          <label className="mt-5 block text-xs text-white/38">
            Summary
            <textarea
              className={`${fieldClass} min-h-24 resize-y leading-6`}
              placeholder="Public summary shown in the index"
              value={draft.summary}
              onChange={(event) => update("summary", event.target.value)}
            />
          </label>

          <div className="grid gap-x-6 sm:grid-cols-2">
            {draft.kind === "notes" ? (
              <>
                <label className="mt-5 block text-xs text-white/38">
                  Date
                  <input
                    className={fieldClass}
                    type="date"
                    value={draft.date}
                    onChange={(event) => update("date", event.target.value)}
                  />
                </label>
                <label className="mt-5 block text-xs text-white/38">
                  Updated
                  <input
                    className={fieldClass}
                    type="date"
                    value={draft.updated}
                    onChange={(event) => update("updated", event.target.value)}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="mt-5 block text-xs text-white/38">
                  Year
                  <input
                    className={fieldClass}
                    value={draft.year}
                    onChange={(event) => update("year", event.target.value)}
                  />
                </label>
                <label className="mt-5 block text-xs text-white/38">
                  Status
                  <select
                    className={fieldClass}
                    value={draft.status}
                    onChange={(event) => update("status", event.target.value)}
                  >
                    <option>Published</option>
                    <option>Preprint</option>
                    <option>In Progress</option>
                    <option>Reproduced</option>
                    <option>Archived</option>
                  </select>
                </label>
              </>
            )}
          </div>

          <label className="mt-5 block text-xs text-white/38">
            Tags
            <input
              className={fieldClass}
              placeholder="Robot Learning, IsaacLab, Reproduction"
              value={draft.tags}
              onChange={(event) => update("tags", event.target.value)}
            />
          </label>

          <div className="mt-7 border-y border-white/10 py-6">
            <label className="flex cursor-pointer items-center justify-between gap-5">
              <span>
                <span className="block text-sm text-white/76">Show in rotating archive</span>
                <span className="mt-1 block text-xs leading-5 text-white/34">The item still appears in the homepage index when this is off.</span>
              </span>
              <input
                checked={draft.featured}
                className="h-4 w-4 accent-[#aab7cf]"
                type="checkbox"
                onChange={(event) => update("featured", event.target.checked)}
              />
            </label>

            <div className="mt-6">
              <p className="text-xs text-white/38">Default cover palette</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {coverTones.map((tone) => (
                  <button
                    aria-label={`Use ${tone.value} cover palette`}
                    className={`h-9 w-9 rounded-full border transition-transform hover:scale-110 ${draft.coverTone === tone.value ? "border-white shadow-[0_0_20px_rgba(170,183,207,0.34)]" : "border-white/12"}`}
                    key={tone.value}
                    style={{ backgroundColor: tone.color }}
                    title={tone.value}
                    type="button"
                    onClick={() => update("coverTone", tone.value)}
                  />
                ))}
              </div>
            </div>

            <label className="mt-5 block text-xs text-white/38">
              Custom cover URL
              <input
                className={fieldClass}
                placeholder="Optional; palette is used when empty"
                value={draft.cover}
                onChange={(event) => update("cover", event.target.value)}
              />
            </label>
          </div>

          {draft.kind === "projects" ? (
            <div className="mt-6 grid gap-x-6 sm:grid-cols-3">
              <label className="block text-xs text-white/38">
                Paper URL
                <input className={fieldClass} value={draft.paperLink} onChange={(event) => update("paperLink", event.target.value)} />
              </label>
              <label className="mt-5 block text-xs text-white/38 sm:mt-0">
                Code URL
                <input className={fieldClass} value={draft.codeLink} onChange={(event) => update("codeLink", event.target.value)} />
              </label>
              <label className="mt-5 block text-xs text-white/38 sm:mt-0">
                Demo URL
                <input className={fieldClass} value={draft.demoLink} onChange={(event) => update("demoLink", event.target.value)} />
              </label>
            </div>
          ) : null}

          <label className="mt-7 block text-xs text-white/38">
            MDX body
            <textarea
              className="mt-3 min-h-[520px] w-full resize-y border border-white/10 bg-black/20 p-5 font-mono text-sm leading-7 text-white/72 outline-none transition-colors placeholder:text-white/24 focus:border-mist/45"
              spellCheck={false}
              value={draft.body}
              onChange={(event) => update("body", event.target.value)}
            />
          </label>
        </form>

        <aside className="border-t border-white/10 py-7 lg:border-l lg:border-t-0 lg:pl-7">
          <motion.button
            className="w-full bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-mist"
            disabled={saveState === "saving"}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => saveDocument()}
          >
            {saveState === "saving" ? "Saving..." : "Save document"}
          </motion.button>
          {draft.slug ? (
            <a
              className="mt-3 block w-full border border-white/10 px-4 py-3 text-center text-sm text-white/58 transition-colors hover:border-white/24 hover:text-white"
              href={publicHref}
              rel="noreferrer"
              target="_blank"
            >
              Open rendered page ↗
            </a>
          ) : null}

          <div className="min-h-16 border-b border-white/10 py-5 text-xs leading-5">
            <p
              className={
                saveState === "error" ? "text-red-300/80" : "text-white/38"
              }
            >
              {message || "Production saves commit to GitHub and trigger a Vercel rebuild."}
            </p>
          </div>

          <div className="border-b border-white/10 py-6">
            <h2 className="text-xs uppercase text-white/38">Media</h2>
            <label className="mt-4 block cursor-pointer border border-white/12 px-4 py-3 text-center text-sm text-white/52 transition-colors hover:border-antique/45 hover:text-white">
              {draft.cover ? "Replace cover image" : "Upload cover image"}
              <input
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                type="file"
                onChange={(event) => uploadMedia(event, "cover")}
              />
            </label>
            <label className="mt-4 block cursor-pointer border border-dashed border-white/14 px-4 py-7 text-center text-sm text-white/48 transition-colors hover:border-mist/45 hover:text-white">
              {uploading ? "Uploading..." : "Insert image or video"}
              <input
                accept="image/*,video/*"
                className="sr-only"
                disabled={uploading}
                type="file"
                onChange={uploadMedia}
              />
            </label>
            <p className="mt-3 text-xs leading-5 text-white/28">Production media uploads directly to Vercel Blob.</p>
          </div>

          <div className="py-6">
            <h2 className="text-xs uppercase text-white/38">External video</h2>
            <input
              className={fieldClass}
              placeholder="Embed URL"
              value={externalVideo}
              onChange={(event) => setExternalVideo(event.target.value)}
            />
            <motion.button
              className="mt-3 text-sm text-mist/72 transition-colors hover:text-white"
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={insertExternalVideo}
            >
              Insert embed
            </motion.button>
          </div>
        </aside>
      </div>
    </section>
  );
}
