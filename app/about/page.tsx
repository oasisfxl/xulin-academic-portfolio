import { AboutContent, AboutEyebrow, AboutHeading } from "@/components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Xulin Fu and research interests.",
};

export default function AboutPage() {
  return (
    <section className="page-shell py-14 sm:py-20">
      <div className="grid gap-12 border-b border-white/[0.1] pb-16 lg:grid-cols-[0.38fr_minmax(0,0.62fr)] lg:gap-20">
        <div>
          <AboutEyebrow />
          <AboutHeading />
        </div>
        <AboutContent />
      </div>
    </section>
  );
}
