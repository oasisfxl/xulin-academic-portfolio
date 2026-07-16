"use client";

import { Footer } from "@/components/Footer";
import { GitHubFloatingButton } from "@/components/GitHubFloatingButton";
import { LoadingIntro } from "@/components/LoadingIntro";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return (
      <div className="studio-route min-h-screen">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  return (
    <>
      <div aria-hidden="true" className="public-background">
        <span className="public-background__grid" />
        <span className="public-background__shade" />
      </div>
      <div className="relative z-10">
        <LoadingIntro />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <GitHubFloatingButton />
      </div>
    </>
  );
}
