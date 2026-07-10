import { AboutContent, AboutEyebrow } from "@/components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Xulin Fu and research interests.",
};

export default function AboutPage() {
  return (
    <section className="page-shell py-20">
      <div className="grid gap-14 lg:grid-cols-[0.38fr_minmax(0,0.62fr)]">
        <div>
          <AboutEyebrow />
          <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
            Xulin Fu
          </h1>
        </div>
        <AboutContent />
      </div>
    </section>
  );
}
