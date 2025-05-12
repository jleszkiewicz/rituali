import { RecommendedChallengeData } from "../AddHabitModal/types";
import * as Localization from "expo-localization";

const supportedLangs = ["pl", "en", "es", "fr", "de", "it"] as const;
type SupportedLang = (typeof supportedLangs)[number];
type HabitsKey = `habits_${SupportedLang}`;

export const getHabitsForCurrentLanguage = (
  challenge: RecommendedChallengeData
): string[] => {
  const deviceLang = Localization.locale.split("-")[0];
  const lang = supportedLangs.includes(deviceLang as SupportedLang)
    ? (deviceLang as SupportedLang)
    : "en";

  const key: HabitsKey = `habits_${lang}`;
  return challenge[key] ?? challenge.habits_en;
};