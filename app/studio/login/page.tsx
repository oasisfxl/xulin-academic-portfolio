import { getAdminSession } from "@/lib/admin-auth";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Studio Login", robots: { index: false, follow: false } };

const errorMessages: Record<string, string> = {
  config: "The production OAuth environment is incomplete.",
  forbidden: "This GitHub account is not authorized for the Studio.",
  identity: "GitHub identity verification failed. Please try again.",
  network: "GitHub could not be reached from the server. Please try again.",
  state: "The login request expired or could not be verified. Please start again.",
  token: "GitHub rejected the OAuth callback. Check the OAuth App callback URL.",
};

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/studio");
  const { error } = await searchParams;

  return (
    <section className="studio-login relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="relative w-full max-w-md border-y border-white/10 py-12">
        <span className="grid h-11 w-11 place-items-center rounded-[7px] border border-white/12 bg-white/[0.045] text-xl font-medium text-white">F</span>
        <p className="mt-8 text-xs uppercase text-antique/72">Private workspace</p>
        <h1 className="mt-4 text-4xl font-medium text-white">Content Studio</h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-white/48">
          Use the authorized GitHub account to write, upload media, and publish research content.
        </p>
        {error ? (
          <p className="mt-5 rounded-[6px] border border-red-300/20 bg-red-300/[0.04] px-4 py-3 text-sm leading-6 text-red-200/72">
            {errorMessages[error] || "Unable to complete GitHub login."}
          </p>
        ) : null}
        <Link
          className="mt-8 inline-flex items-center gap-3 rounded-[6px] bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-mist"
          href="/api/auth/github"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.2-.11-.29-.6-1.2-1.03-1.44-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.12 2.91.85.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.22 9.22 0 0 1 12 6.99c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.93.68 1.89 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
          </svg>
          Continue with GitHub
        </Link>
        <Link className="ml-5 text-sm text-white/42 transition hover:text-white" href="/">Return to site</Link>
      </div>
    </section>
  );
}
