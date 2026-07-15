"use client";

import { ContentDocument } from "@/lib/content";
import { coverGradients } from "@/lib/covers";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";

const MotionLink = motion.create(Link);

type NoteListProps = {
  notes: ContentDocument[];
};

export function NoteList({ notes }: NoteListProps) {
  const router = useRouter();

  function openNote(event: MouseEvent<HTMLElement>, slug: string) {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      return;
    }
    router.push(`/notes/${slug}`);
  }

  function trackSpotlight(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className="grid gap-3">
      {notes.map(({ meta }) => {
        const isPublic = meta.visibility === "public";

        return (
          <motion.article
            className={`spotlight-row group relative grid gap-5 overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#101012]/90 p-4 transition-[background-color,border-color,box-shadow] duration-300 hover:z-10 hover:border-mist/28 hover:bg-[#141417] hover:shadow-[0_22px_70px_rgba(0,0,0,0.3)] sm:grid-cols-[96px_minmax(0,1fr)] sm:p-5 ${isPublic ? "cursor-pointer" : "cursor-default"}`}
            initial={{ opacity: 0, y: 16 }}
            key={meta.slug}
            transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.72 }}
            viewport={{ once: true, margin: "-70px" }}
            whileHover={{ scale: 1.01, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileTap={isPublic ? { scale: 0.995, y: -1 } : undefined}
            onClick={isPublic ? (event) => openNote(event, meta.slug) : undefined}
            onPointerMove={trackSpotlight}
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist/36 to-transparent" />
              <span className="absolute inset-y-0 left-0 w-px bg-mist/28" />
            </span>
            <div>
              <div
                aria-hidden="true"
                className="relative aspect-square w-20 overflow-hidden rounded-[5px] border border-white/10 sm:w-24"
                style={
                  meta.cover
                    ? ({ backgroundImage: `linear-gradient(180deg,transparent,rgba(0,0,0,.58)),url(${meta.cover})`, backgroundPosition: "center", backgroundSize: "cover" } as CSSProperties)
                    : { backgroundImage: coverGradients[meta.coverTone || "mist"] }
                }
              >
                <span className="absolute bottom-3 left-3 text-[10px] uppercase text-white/68">Note</span>
              </div>
              <div className="mt-3 text-xs text-white/38">
                <p>{meta.date || meta.year || "Draft"}</p>
                {meta.updated ? <p className="mt-1">Updated {meta.updated}</p> : null}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  {isPublic ? (
                    <MotionLink
                      className="inline-flex items-center gap-2 text-xl font-medium text-white transition hover:text-mist"
                      href={`/notes/${meta.slug}`}
                      whileTap={{ scale: 0.975 }}
                    >
                      {meta.title}
                      <span aria-hidden="true" className="text-sm text-white/38 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </MotionLink>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xl font-medium text-white/72">
                      {meta.title}
                      <span className="border border-white/12 px-2 py-1 text-[10px] uppercase text-antique/82">
                        Coming soon
                      </span>
                    </div>
                  )}
                  {meta.subtitle ? (
                    <p className="mt-2 text-sm text-white/55">{meta.subtitle}</p>
                  ) : null}
                </div>
                <span className="w-fit border border-white/[0.08] px-2.5 py-1 text-xs text-white/48">
                  {meta.visibility}
                </span>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">
                {meta.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {meta.tags.map((tag) => (
                  <span
                    className="bg-white/[0.045] px-2.5 py-1 text-xs text-white/54"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
