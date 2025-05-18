export type ChallengeData = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  habits: string[];
  status: "active" | "completed";
};
