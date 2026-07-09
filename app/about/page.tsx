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
          <p className="text-sm uppercase text-antique/72">About</p>
          <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
            Xulin Fu
          </h1>
        </div>
        <div className="space-y-8 text-lg leading-9 text-white/64">
          <p>
            I am interested in embodied intelligence, robot learning, humanoid
            manipulation, and imitation learning. My work centers on how robot
            policies are trained, evaluated, reproduced, and eventually deployed
            outside carefully controlled benchmarks.
          </p>
          <p>
            This site is a static research portfolio for projects, papers,
            reproductions, and working notes, with room for early project
            signals and mature technical writeups to coexist.
          </p>
          <div className="grid gap-4 border-t border-white/[0.08] pt-8 text-base text-white/58 sm:grid-cols-2">
            <p>GitHub: github.com/oasisfxl</p>
            <p>Email: xulin.fu@example.com</p>
            <p>Focus: Robot Learning</p>
            <p>Systems: Humanoid Manipulation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
