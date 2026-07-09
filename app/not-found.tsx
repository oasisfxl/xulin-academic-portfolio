import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-shell grid min-h-[60svh] place-items-center py-20 text-center">
      <div>
        <p className="text-sm uppercase text-antique/72">404</p>
        <h1 className="mt-4 text-4xl font-medium text-white">
          This page is not public.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/54">
          The project may be locked, hidden, or not yet added to the portfolio.
        </p>
        <Link
          className="mt-8 inline-flex border border-white/12 px-4 py-3 text-sm text-white/72 transition hover:border-mist/45 hover:text-white"
          href="/projects"
        >
          Back to projects
        </Link>
      </div>
    </section>
  );
}
