import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteFrame } from "@/components/SiteFrame";
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
          <SiteFrame>{children}</SiteFrame>
        </LanguageProvider>
      </body>
    </html>
  );
}
