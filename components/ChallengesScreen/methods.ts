import { RecommendedChallengeData } from "../AddHabitModal/types";
import * as Localization from "expo-localization";

const supportedLangs = ["pl", "en", "es", "fr", "de", "it"] as const;
type SupportedLang = (typeof supportedLangs)[number];
type HabitsKey = `habits_${SupportedLang}`;

export const getHabitsForCurrentLanguage = (
  challenge: RecommendedChallengeData
): string[] => {
  if (!challenge) {
    console.warn('getHabitsForCurrentLanguage: challenge is undefined');
    return [];
  }

  const deviceLang = Localization.locale.split("-")[0];
  const lang = supportedLangs.includes(deviceLang as SupportedLang)
    ? (deviceLang as SupportedLang)
    : "en";

  const key: HabitsKey = `habits_${lang}`;
  const habits = challenge[key] ?? challenge.habits_en ?? [];
  
  try {
    if (typeof habits === 'string') {
      return JSON.parse(habits);
    }
    return Array.isArray(habits) ? habits : [];
  } catch (error) {
    console.warn('Error parsing habits:', error);
    return [];
  }
};