import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.08]">
      <div className="page-shell flex flex-col gap-5 py-10 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Xulin Fu. Built for research notes and project traces.</p>
        <div className="flex gap-5">
          <a
            className="transition hover:text-white"
            href="mailto:xulin.fu@example.com"
          >
            email
          </a>
          <a
            className="transition hover:text-white"
            href="https://github.com/oasisfxl"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Link className="transition hover:text-white" href="/projects">
            projects
          </Link>
        </div>
      </div>
    </footer>
  );
}
