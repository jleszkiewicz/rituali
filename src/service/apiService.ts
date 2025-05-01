import { HabitData } from "@/components/AddHabitModal/types";
import { supabase } from "./supabaseClient";
import { ChallengeData } from "@/components/AddChallengeModal/types";

export const fetchUserChallenges = async (userId: string | null) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error fetching challenges:", err);
    return [];
  }
};

export const addHabit = async (userId: string, habit: HabitData) => {
  const { data, error } = await supabase
    .from("habits")
    .insert([
      {
        user_id: userId,
        name: habit.name,
        frequency: habit.frequency,
        selected_days: habit.selectedDays,
        challenge_id: habit.challengeId,
      },
    ])
    .select();

  if (error) {
    console.error("Error adding habit:", error);
    throw error;
  }

  return data;
};

export const addChallenge = async (userId: string, challenge: ChallengeData) => {
  const { data, error } = await supabase
    .from("challenges")
    .insert([
      {
        user_id: userId,
        name: challenge.name,
        start_date: challenge.startDate.toISOString(),
        end_date: challenge.endDate.toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Error adding challenge:", error);
    throw error;
  }

  return data;
};