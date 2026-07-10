import { NoteList } from "@/components/NoteList";
import { PageIntro } from "@/components/PageIntro";
import { getVisibleContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Technical notes and research logs by Xulin Fu.",
};

export default function NotesPage() {
  const notes = getVisibleContent("notes");

  return (
    <section className="page-shell py-20">
      <PageIntro
        descriptionKey="notes.description"
        eyebrowKey="notes.eyebrow"
        titleKey="notes.title"
      />
      <div className="mt-16">
        <NoteList notes={notes} />
      </div>
    </section>
  );
}
