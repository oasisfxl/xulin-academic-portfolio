import { getAdminSession } from "@/lib/admin-auth";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Studio Login", robots: { index: false, follow: false } };

export default async function StudioLoginPage() {
  if (await getAdminSession()) redirect("/studio");

  return (
    <section className="page-shell grid min-h-[calc(100vh-8rem)] place-items-center py-16">
      <div className="w-full max-w-md border-y border-white/10 py-10 text-center">
        <p className="text-xs uppercase text-antique/72">Private workspace</p>
        <h1 className="mt-4 text-4xl font-medium text-white">Content Studio</h1>
        <p className="mt-4 text-sm leading-7 text-white/48">
          Sign in with the authorized GitHub account to publish research content.
        </p>
        <Link
          className="mt-8 inline-flex bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-mist"
          href="/api/auth/github"
        >
          Continue with GitHub
        </Link>
      </div>
    </section>
  );
}
