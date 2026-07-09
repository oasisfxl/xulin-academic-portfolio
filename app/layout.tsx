import { Footer } from "@/components/Footer";
import { GitHubFloatingButton } from "@/components/GitHubFloatingButton";
import { LoadingIntro } from "@/components/LoadingIntro";
import { Navbar } from "@/components/Navbar";
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
    <html lang="en">
      <body>
        <LoadingIntro />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <GitHubFloatingButton />
      </body>
    </html>
  );
}
