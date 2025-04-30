export type Frequency = "daily" | "weekly" | "monthly" | "selected_days";

export type HabitData = {
  name: string;
  isPartOfChallenge: boolean;
  challengeId: string | null;
  frequency: "daily" | "weekly" | "monthly" | "selected_days";
  selectedDays: number[];
  startDate: Date;
  endDate: Date;
};

export type Challenge = {
  id: string;
  name: string;
  description: string;
};
