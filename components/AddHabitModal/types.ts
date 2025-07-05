export type Frequency = "daily" | "weekly" | "selected_days";

export type HabitCategory = "health" | "fitness" | "beauty" | "mindfulness" | "education" | "self-development" | "other";

export type HabitStatus = "active" | "deleted";

export interface HabitData {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: Frequency;
  selectedDays: string[];
  startDate: string;
  endDate: string | null;
  completionDates: string[];
  isPartOfChallenge: boolean;
  status: HabitStatus;
} 

export interface RecommendedChallengeData {
  id: string;
  name: string;
  duration: string;
  habits: {
    pl: string[];
    en: string[];
    it: string[];
    fr: string[];
    de: string[];
  };
  participants_count: number;
  background_illustration: string;
}
