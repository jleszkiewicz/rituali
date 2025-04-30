import { HabitData } from "@/components/AddHabitModal/types";
import { supabase } from "./supabaseClient";

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

export const addHabit = async (userId: string | null, habit: HabitData) => {
  const { error } = await supabase.from("habits").insert([
    {
      user_id: userId,
      name: habit.name,
      is_part_of_challenge: habit.isPartOfChallenge,
      challenge_id: habit.challengeId,
      frequency: habit.frequency,
      selected_days: habit.selectedDays,
      start_date: habit.startDate,
      end_date: habit.endDate,
    },
  ]);

  if (error) {
    console.error("Error adding habit:", error.message);
  } else {
    console.log("Habit added successfully");
  }
};