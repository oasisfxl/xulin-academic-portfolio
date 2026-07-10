"use client";

import { useLanguage } from "@/components/LanguageProvider";

type PageIntroProps = {
  descriptionKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
  eyebrowKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
  titleKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0];
};

export function PageIntro({
  descriptionKey,
  eyebrowKey,
  titleKey,
}: PageIntroProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase text-antique/72">{t(eyebrowKey)}</p>
      <h1 className="mt-5 text-5xl font-medium text-white sm:text-7xl">
        {t(titleKey)}
      </h1>
      <p className="mt-6 text-lg leading-8 text-white/58">
        {t(descriptionKey)}
      </p>
    </div>
  );
}
