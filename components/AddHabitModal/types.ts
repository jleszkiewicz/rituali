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
  challenges: string[];
  status: HabitStatus;
} 