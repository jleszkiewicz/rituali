export type Frequency = "daily" | "weekly" | "monthly" | "selected_days";

export type HabitCategory = "health" | "fitness" | "beauty" | "mindfulness" | "education" | "self-development" | "other";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface HabitData {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: Frequency;
  startDate: string;
  endDate: string;
  selectedDays: string[];
  completionDates: string[];
  isPartOfChallenge: boolean;
  challengeId: string | null;
} 