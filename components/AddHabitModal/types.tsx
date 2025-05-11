export type HabitCategory =
  | "health"
  | "fitness"
  | "beauty"
  | "mindfulness"
  | "education"
  | "self-development"
  | "other";

export type Frequency = "daily" | "weekly" | "monthly" | "selected_days";
export type HabitStatus = "active" | "deleted";

export type HabitData = {
  id: string;
  name: string;
  frequency: Frequency;
  selectedDays: string[];
  category: HabitCategory;
  isPartOfChallenge: boolean;
  startDate: string;
  endDate: string | null;
  completionDates: string[];
  status: HabitStatus;
};
