import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { Locale } from "date-fns";
import enTranslations from "../locales/en/translations.json";
import deTranslation from "../locales/de/translations.json";
import frTranslation from "../locales/fr/translations.json";
import esTranslation from "../locales/es/translations.json";
import plTranslation from "../locales/pl/translations.json"

import { enUS, pl, de, fr, es } from "date-fns/locale";

const locales: Record<string, Locale> = {
  pl,
  de,
  fr,
  es,
  en: enUS,
};

const resources = {
  en: { translation: enTranslations },
  de: { translation: deTranslation },
  fr: { translation: frTranslation },
  es: { translation: esTranslation },
  pl: { translation: plTranslation},
};

export const getLocale = (language?: string) => {
  const lang =
    language || Localization.getLocales()[0]?.languageCode || "en";
  return locales[lang] || enUS;
};

export const t = (key: string): string => {
  return i18n.t(key);
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
