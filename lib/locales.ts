export type LocalKey = "zh_CN" | "en";

export const defaultLocale: LocalKey = "zh_CN";
export const locales: LocalKey[] = ["zh_CN", "en"];

const LocalesMap = {
  zh_CN: () => import("../locales/zh_CN.json").then((module) => module.default),
  en: () => import("../locales/en.json").then((module) => module.default),
};

export const getLocale = async (locale: LocalKey) => LocalesMap[locale]();
