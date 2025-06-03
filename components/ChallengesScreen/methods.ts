import { RecommendedChallengeData } from "../AddHabitModal/types";
import * as Localization from "expo-localization";

const supportedLangs = ["pl", "en", "es", "fr", "de", "it"] as const;
type SupportedLang = (typeof supportedLangs)[number];

export const getHabitsForCurrentLanguage = (
  challenge: RecommendedChallengeData
): string[] => {
  if (!challenge || !challenge.habits) {
    console.warn('getHabitsForCurrentLanguage: challenge or habits is undefined');
    return [];
  }
  
  const deviceLang = Localization.locale.split("-")[0];
  
  const parseHabits = (habits: any): string[] => {
    if (Array.isArray(habits)) {
      return habits;
    }
    if (typeof habits === 'string') {
      try {
        const parsed = JSON.parse(habits);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        console.warn('Parsed habits is not an array:', parsed);
        return [];
      } catch (e) {
        console.warn('Failed to parse habits string:', e);
        return [];
      }
    }
    console.warn('Habits is neither an array nor a string:', habits);
    return [];
  };
  

  if (deviceLang in challenge.habits) {
    const habits = challenge.habits[deviceLang as keyof typeof challenge.habits];
    return parseHabits(habits);
  }

  if ('en' in challenge.habits) {
    const habits = challenge.habits.en;
    return parseHabits(habits);
  }

  const firstLang = Object.keys(challenge.habits)[0];
  const habits = challenge.habits[firstLang as keyof typeof challenge.habits];
  return parseHabits(habits);
};