export type Frequency = "daily" | "weekly" | "monthly" | "selected_days";

export type HabitCategory = "health" | "fitness" | "beauty" | "mindfulness" | "education" | "self-development" | "other";

export type HabitStatus = "active" | "deleted";

export interface HabitData {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: Frequency;
  startDate: string;
  endDate: string | null;
  selectedDays: string[];
  completionDates: string[];
  isPartOfChallenge: boolean;
  status: HabitStatus;
} 

export interface RecommendedChallengeData {
  id: string;
  name: string;
  duration: string;
  habits_pl: string[];
  habits_en: string[];
  habits_es: string[];
  habits_fr: string[];
  habits_de: string[];
  habits_it: string[];
}
