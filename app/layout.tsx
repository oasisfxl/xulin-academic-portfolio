import { Footer } from "@/components/Footer";
import { GitHubFloatingButton } from "@/components/GitHubFloatingButton";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LoadingIntro } from "@/components/LoadingIntro";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Xulin Fu | Embodied Intelligence",
    template: "%s | Xulin Fu",
  },
  description:
    "Personal academic portfolio for Xulin Fu, focused on embodied intelligence, robot learning, humanoid manipulation, and imitation learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <LanguageProvider>
          <LoadingIntro />
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <GitHubFloatingButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
