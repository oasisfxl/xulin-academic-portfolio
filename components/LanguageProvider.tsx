"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "en" | "zh";

type TranslationKey =
  | "nav.home"
  | "nav.publications"
  | "nav.projects"
  | "nav.notes"
  | "nav.about"
  | "hero.field"
  | "hero.tagline"
  | "hero.humanoid"
  | "hero.imitation"
  | "hero.policy"
  | "hero.evaluation"
  | "hero.explore"
  | "hero.readNotes"
  | "hero.focus"
  | "showcase.return"
  | "showcase.locked"
  | "homeProjects.title"
  | "projects.eyebrow"
  | "projects.title"
  | "projects.description"
  | "publications.eyebrow"
  | "publications.title"
  | "publications.description"
  | "publications.empty"
  | "notes.eyebrow"
  | "notes.title"
  | "notes.description"
  | "about.eyebrow"
  | "about.bodyA"
  | "about.bodyB"
  | "about.focus"
  | "about.systems"
  | "footer.copyright"
  | "footer.email"
  | "footer.projects";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.publications": "Publications",
    "nav.projects": "Projects",
    "nav.notes": "Notes",
    "nav.about": "About",
    "hero.field": "Embodied Intelligence / Robot Learning",
    "hero.tagline":
      "I build and analyze robot learning systems for deployable humanoid manipulation.",
    "hero.humanoid": "Humanoid Manipulation",
    "hero.imitation": "Imitation Learning",
    "hero.policy": "Policy Deployment",
    "hero.evaluation": "Robot Evaluation",
    "hero.explore": "Explore research",
    "hero.readNotes": "Read technical notes",
    "hero.focus": "Research focus",
    "showcase.return": "Return to ring",
    "showcase.locked":
      "This project is currently being refined. A full detail page will be published when the writeup is ready.",
    "homeProjects.title": "Selected work",
    "projects.eyebrow": "Projects",
    "projects.title": "Research index",
    "projects.description":
      "A consolidated view of papers, reproductions, experiments, and notes around deployable robot learning systems.",
    "publications.eyebrow": "Publications",
    "publications.title": "Papers and preprints",
    "publications.description":
      "Formal research outputs and manuscripts connected to embodied intelligence and humanoid manipulation.",
    "publications.empty": "Publications will be added here.",
    "notes.eyebrow": "Notes",
    "notes.title": "Working notes",
    "notes.description":
      "Short technical writeups for robot learning, imitation learning, evaluation practice, generative policy ideas, and deployment logs.",
    "about.eyebrow": "About",
    "about.bodyA":
      "I am interested in embodied intelligence, robot learning, humanoid manipulation, and imitation learning. My work centers on how robot policies are trained, evaluated, reproduced, and eventually deployed outside carefully controlled benchmarks.",
    "about.bodyB":
      "This site is a static research portfolio for projects, papers, reproductions, and working notes, with room for early project signals and mature technical writeups to coexist.",
    "about.focus": "Focus: Robot Learning",
    "about.systems": "Systems: Humanoid Manipulation",
    "footer.copyright":
      "© 2026 Xulin Fu. Built for research notes and project traces.",
    "footer.email": "email",
    "footer.projects": "projects",
  },
  zh: {
    "nav.home": "首页",
    "nav.publications": "论文",
    "nav.projects": "项目",
    "nav.notes": "笔记",
    "nav.about": "关于",
    "hero.field": "具身智能 / 机器人学习",
    "hero.tagline": "我构建并分析面向真实部署的人形机器人操作学习系统。",
    "hero.humanoid": "人形机器人操作",
    "hero.imitation": "模仿学习",
    "hero.policy": "策略部署",
    "hero.evaluation": "机器人评测",
    "hero.explore": "浏览研究项目",
    "hero.readNotes": "阅读技术笔记",
    "hero.focus": "研究方向",
    "showcase.return": "返回展架",
    "showcase.locked": "该项目仍在完善中，完整详情页会在文档完成后开放。",
    "homeProjects.title": "研究索引",
    "projects.eyebrow": "项目",
    "projects.title": "研究项目索引",
    "projects.description":
      "围绕可部署机器人学习系统整理的论文、复现、实验与技术笔记。",
    "publications.eyebrow": "论文",
    "publications.title": "论文与预印本",
    "publications.description": "与具身智能和人形机器人操作相关的研究输出。",
    "publications.empty": "论文条目会在这里更新。",
    "notes.eyebrow": "笔记",
    "notes.title": "技术笔记",
    "notes.description":
      "关于机器人学习、模仿学习、评测实践、生成式策略和部署日志的短文档。",
    "about.eyebrow": "关于",
    "about.bodyA":
      "我关注具身智能、机器人学习、人形机器人操作与模仿学习。我的工作聚焦于机器人策略如何训练、评估、复现，并最终走出受控 benchmark 环境完成部署。",
    "about.bodyB":
      "这个网站用于整理项目、论文、复现与工作笔记，让早期研究信号和成熟技术文档可以并行存在。",
    "about.focus": "方向：机器人学习",
    "about.systems": "系统：人形机器人操作",
    "footer.copyright": "© 2026 Xulin Fu. 用于记录研究项目与技术笔记。",
    "footer.email": "邮箱",
    "footer.projects": "项目",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("xulin-language");
      if (saved === "en" || saved === "zh") {
        setLanguageState(saved);
        return;
      }

      if (window.navigator.language.toLowerCase().startsWith("zh")) {
        setLanguageState("zh");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("xulin-language", nextLanguage);
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "en" ? "zh" : "en"),
      t: (key) => translations[language][key],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return value;
}
