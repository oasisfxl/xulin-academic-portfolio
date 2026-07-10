"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function HomeFeaturedHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase text-antique/72">
          {t("homeProjects.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-medium text-white">
          {t("homeProjects.title")}
        </h2>
      </div>
      <p className="max-w-md text-sm leading-6 text-white/48">
        {t("homeProjects.description")}
      </p>
    </div>
  );
}
