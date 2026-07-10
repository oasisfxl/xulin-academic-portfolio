export type ProjectVisibility = "public" | "locked" | "hidden";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  type: "Paper" | "Reproduction" | "Project" | "Note" | "Experiment";
  year: string;
  status:
    | "Published"
    | "Preprint"
    | "In Progress"
    | "Reproduced"
    | "Archived";
  visibility: ProjectVisibility;
  featured: boolean;
  cover?: string;
  description: string;
  tags: string[];
  links?: {
    paper?: string;
    code?: string;
    demo?: string;
    note?: string;
  };
};

// Visibility controls:
// public = visible and detail page enabled
// locked = visible on indexes, detail page blocked with Coming soon
// hidden = excluded from all indexes and showcase surfaces
export const projects: Project[] = [
  {
    slug: "robust-humanoid-action-delay",
    title: "Robust Humanoid Locomotion",
    subtitle:
      "动作时延下的鲁棒人形运动控制：延迟执行暴露与显式时延感知的因子化研究",
    type: "Paper",
    year: "2026",
    status: "Published",
    visibility: "public",
    featured: true,
    cover: "/covers/robust-humanoid-action-delay.png",
    description:
      "发表于 ICGNC 2026。本文以 Unitree G1 的 IsaacLab 速度跟踪任务为例，系统拆分并比较延迟执行暴露与显式时延条件，验证二者结合可在较大动作时延下获得最稳健的运动表现。",
    tags: [
      "Humanoid Locomotion",
      "Action Delay",
      "Reinforcement Learning",
      "IsaacLab",
      "Unitree G1",
    ],
  },
  {
    slug: "sieve",
    title: "SIEVE",
    subtitle: "Structured evaluation for embodied robot learning systems",
    type: "Paper",
    year: "2026",
    status: "In Progress",
    visibility: "locked",
    featured: true,
    description:
      "A developing research project around evaluating what robot policies actually learn, where they fail, and how those failures transfer to deployment.",
    tags: [
      "Embodied Intelligence",
      "Robot Learning",
      "Evaluation",
      "Humanoid Manipulation",
    ],
  },
  {
    slug: "robotwin-act-reproduction",
    title: "RoboTwin ACT Reproduction",
    subtitle: "Reproducing action chunking baselines in dual-arm simulation",
    type: "Reproduction",
    year: "2026",
    status: "Reproduced",
    visibility: "public",
    featured: true,
    description:
      "A compact reproduction log for ACT-style imitation learning in RoboTwin, focusing on data handling, training stability, and task-level failure modes.",
    tags: ["Imitation Learning", "ACT", "RoboTwin", "Reproduction"],
    links: {
      code: "https://github.com/oasisfxl",
    },
  },
  {
    slug: "unitree-g1-dex3-deployment",
    title: "Unitree G1 Dex3 Deployment",
    subtitle: "Toward deployable dexterous manipulation on humanoid hardware",
    type: "Experiment",
    year: "2026",
    status: "In Progress",
    visibility: "locked",
    featured: true,
    description:
      "An ongoing deployment notebook for policy integration, hand control, sensing assumptions, and practical debugging on humanoid manipulation hardware.",
    tags: ["Unitree G1", "Dexterous Hands", "Deployment", "Control"],
  },
  {
    slug: "flow-matching-notes",
    title: "Flow Matching Notes",
    subtitle: "A concise map from generative modeling to robot policy learning",
    type: "Note",
    year: "2025",
    status: "Published",
    visibility: "public",
    featured: true,
    description:
      "Technical notes connecting flow matching intuition, trajectory distributions, and how continuous-time generative models can shape robot policy learning.",
    tags: ["Flow Matching", "Diffusion Policy", "Notes", "Generative Models"],
    links: {
      note: "/notes/flow-matching-notes",
    },
  },
  {
    slug: "robot-learning-pitfalls",
    title: "Robot Learning Pitfalls",
    subtitle: "A field guide for debugging imitation learning experiments",
    type: "Note",
    year: "2025",
    status: "Published",
    visibility: "public",
    featured: true,
    description:
      "A practical checklist of common robot learning traps, including silent dataset bugs, observation leakage, brittle evaluation, and deployment mismatch.",
    tags: ["Robot Learning", "Debugging", "Imitation Learning", "Evaluation"],
    links: {
      note: "/notes/robot-learning-pitfalls",
    },
  },
  {
    slug: "private-dexterity-benchmark",
    title: "Private Dexterity Benchmark",
    subtitle: "Internal experiments for long-horizon humanoid manipulation",
    type: "Experiment",
    year: "2026",
    status: "In Progress",
    visibility: "hidden",
    featured: true,
    description:
      "A hidden example used to verify that private projects do not appear in public indexes or the album showcase.",
    tags: ["Hidden", "Benchmark"],
  },
];
