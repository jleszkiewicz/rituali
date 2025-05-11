import { supabase } from "./supabaseClient";
import { HabitData } from "../../components/AddHabitModal/types";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";

const mapHabitFromDb = (dbHabit: any): HabitData => ({
  id: dbHabit.id,
  name: dbHabit.name,
  frequency: dbHabit.frequency,
  selectedDays: dbHabit.selected_days,
  completionDates: dbHabit.completion_dates,
  category: dbHabit.category,
  isPartOfChallenge: dbHabit.is_part_of_challenge,
  startDate: dbHabit.start_date,
  endDate: dbHabit.end_date,
  status: dbHabit.status,
});

const mapHabitToDb = (habit: HabitData): any => ({
  name: habit.name,
  frequency: habit.frequency,
  selected_days: habit.selectedDays,
  challenges: habit.challenges,
  completion_dates: habit.completionDates,
  category: habit.category,
  is_part_of_challenge: habit.isPartOfChallenge,
  start_date: habit.startDate,
  end_date: habit.endDate,
  status: habit.status,
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

    const mappedHabits = data.map(mapHabitFromDb);
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
      startDate: format(challenge.start_date, dateFormat),
      endDate: format(challenge.end_date, dateFormat),
      habits: challenge.habits,
      challenges: challenge.challenges,
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
    challenges: habit.challenges,
    completion_dates: habit.completionDates,
    category: habit.category,
    is_part_of_challenge: habit.isPartOfChallenge,
    start_date: format(new Date(), dateFormat),
    end_date: null,
    status: habit.status,
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
    start_date: format(new Date(challenge.startDate), dateFormat),
    end_date: format(new Date(challenge.endDate), dateFormat),
    habits: challenge.habits,
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
    startDate: format(challenge.start_date, dateFormat),
    endDate: format(challenge.end_date, dateFormat),
    habits: challenge.habits,
    challenges: challenge.challenges,
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

export const deleteChallenge = async (challengeId: string) => {
  try {
    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challengeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error;
  }
};

export const updateChallengeHabits = async (challengeId: string, habits: string[]) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .update({ habits })
      .eq("id", challengeId)
      .select();

    if (error) {
      console.error("Error updating challenge habits:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error updating challenge habits:", error);
    throw error;
  }
};
