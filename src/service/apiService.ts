import { supabase } from "./supabaseClient";
import { HabitData } from "../../components/AddHabitModal/types";
import { ChallengeData } from "@/components/AddChallengeModal/types";

const API_URL = "http://localhost:3000/api";

const mapHabitFromDb = (dbHabit: any): HabitData => ({
  id: dbHabit.id,
  name: dbHabit.name,
  frequency: dbHabit.frequency,
  selectedDays: dbHabit.selected_days,
  challengeId: dbHabit.challenge_id,
  completionDates: dbHabit.completion_dates,
  category: dbHabit.category,
  isPartOfChallenge: dbHabit.is_part_of_challenge,
  startDate: dbHabit.start_date,
  endDate: dbHabit.end_date,
});

const mapHabitToDb = (habit: HabitData): any => ({
  name: habit.name,
  frequency: habit.frequency,
  selected_days: habit.selectedDays,
  challenge_id: habit.challengeId,
  completion_dates: habit.completionDates,
  category: habit.category,
  is_part_of_challenge: habit.isPartOfChallenge,
  start_date: habit.startDate,
  end_date: habit.endDate,
});

export const fetchUserHabits = async (userId: string | null): Promise<HabitData[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user habits:", error);
      throw error;
    }

    console.log("Raw habits from database:", data);
    const mappedHabits = data.map(mapHabitFromDb);
    console.log("Mapped habits:", mappedHabits);
    return mappedHabits;
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw error;
  }
};

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

    return data.map((challenge: any) => ({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      startDate: new Date(challenge.start_date).toISOString(),
      endDate: new Date(challenge.end_date).toISOString(),
    }));
  } catch (err) {
    console.error("Error fetching challenges:", err);
    return [];
  }
};

export const addHabit = async (userId: string | null, habit: HabitData) => {
  const dbHabit = {
    user_id: userId,
    name: habit.name,
    frequency: habit.frequency,
    selected_days: habit.selectedDays,
    challenge_id: habit.challengeId,
    completion_dates: habit.completionDates,
    category: habit.category,
    is_part_of_challenge: habit.isPartOfChallenge,
    start_date: habit.startDate,
    end_date: habit.endDate,
  };

  const { data, error } = await supabase
    .from("habits")
    .insert([dbHabit])
    .select();

  if (error) {
    console.error("Error adding habit:", error);
    throw error;
  }

  return data.map(mapHabitFromDb);
};

export const addChallenge = async (userId: string, challenge: ChallengeData) => {
  const dbChallenge = {
    user_id: userId,
    name: challenge.name,
    description: challenge.description,
    start_date: new Date(challenge.startDate).toISOString(),
    end_date: new Date(challenge.endDate).toISOString(),
  };

  const { data, error } = await supabase
    .from("challenges")
    .insert([dbChallenge])
    .select();

  if (error) {
    console.error("Error adding challenge:", error);
    throw error;
  }

  return data.map((challenge: any) => ({
    id: challenge.id,
    name: challenge.name,
    description: challenge.description,
    startDate: new Date(challenge.start_date).toISOString(),
    endDate: new Date(challenge.end_date).toISOString(),
  }));
};

export const updateHabitCompletion = async (habitId: string, completionDates: string[]) => {
  try {
    const { error } = await supabase
      .from("habits")
      .update({
        completion_dates: completionDates,
      })
      .eq("id", habitId)
      .select('completion_dates');

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating habit completion:", error);
    throw error;
  }
};

export const createHabit = async (userId: string, habit: Omit<HabitData, "id">): Promise<HabitData> => {
  try {
    const dbHabit = {
      user_id: userId,
      ...mapHabitToDb(habit as HabitData),
    };

    const { data, error } = await supabase
      .from("habits")
      .insert([dbHabit])
      .select();

    if (error) {
      console.error("Error creating habit:", error);
      throw error;
    }

    return mapHabitFromDb(data[0]);
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

export const updateHabit = async (habitId: string, habit: Omit<HabitData, "id">): Promise<HabitData> => {
  try {
    const dbHabit = mapHabitToDb(habit as HabitData);

    const { data, error } = await supabase
      .from("habits")
      .update(dbHabit)
      .eq("id", habitId)
      .select();

    if (error) {
      console.error("Error updating habit:", error);
      throw error;
    }

    return mapHabitFromDb(data[0]);
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
};

export const getHabits = async (userId: string): Promise<HabitData[]> => {
  try {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }

    return data.map(mapHabitFromDb);
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
};

export const deleteHabit = async (habitId: string) => {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);

  if (error) {
    throw error;
  }
};

export const toggleHabitCompletion = async (habitId: string, date: Date): Promise<HabitData> => {
  try {
    const { data: habit, error: fetchError } = await supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (fetchError) {
      console.error("Error fetching habit:", fetchError);
      throw fetchError;
    }

    const completionDates = habit.completion_dates || [];
    const dateString = date.toISOString();
    const isCompleted = completionDates.includes(dateString);

    const updatedCompletionDates = isCompleted
      ? completionDates.filter((d: string) => d !== dateString)
      : [...completionDates, dateString];

    const { data, error } = await supabase
      .from("habits")
      .update({ completion_dates: updatedCompletionDates })
      .eq("id", habitId)
      .select();

    if (error) {
      console.error("Error updating habit completion:", error);
      throw error;
    }

    return mapHabitFromDb(data[0]);
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw error;
  }
};