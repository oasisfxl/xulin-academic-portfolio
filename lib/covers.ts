import type { Project } from "@/data/projects";
import type { CSSProperties } from "react";

export const coverGradients = {
  mist: "linear-gradient(135deg, #d6dae5 0%, #6d7891 34%, #1b1b20 72%, #080808 100%)",
  antique: "linear-gradient(135deg, #d6c28d 0%, #6d6558 32%, #151516 70%, #080808 100%)",
  iris: "linear-gradient(135deg, #b7a9d7 0%, #58647e 36%, #15161a 72%, #090909 100%)",
  sage: "linear-gradient(135deg, #bdd1ce 0%, #687482 35%, #171614 70%, #090908 100%)",
  pearl: "linear-gradient(135deg, #e3e0d7 0%, #8f879d 31%, #202025 72%, #080808 100%)",
} as const;

export function projectCoverStyle(project: Project): CSSProperties {
  if (project.cover) {
    const overlay =
      project.slug === "robust-humanoid-action-delay"
        ? "linear-gradient(180deg, rgba(4,6,10,0.2), rgba(4,6,10,0.7))"
        : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.44))";

    return {
      backgroundImage: `${overlay}, url(${project.cover})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return { backgroundImage: coverGradients[project.coverTone || "mist"] };
}
