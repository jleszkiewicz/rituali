import { supabase } from "./supabaseClient";
import { HabitData, RecommendedChallengeData } from "../../components/AddHabitModal/types";
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
    })) as ChallengeData[];
  } catch (err) {
    console.error("Error fetching challenges:", err);
    return [];
  }
};

export const getActiveChallenges = (challenges: ChallengeData[]): ChallengeData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return challenges.filter(challenge => {
    const endDate = new Date(challenge.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });
};

export const getCompletedChallenges = (challenges: ChallengeData[]): ChallengeData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return challenges.filter(challenge => {
    const endDate = new Date(challenge.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate < today;
  });
};

export const addHabit = async (userId: string | null, habit: HabitData) => {
  const dbHabit = {
    user_id: userId,
    name: habit.name,
    frequency: habit.frequency,
    selected_days: habit.selectedDays,
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
    before_photo_uri: challenge.beforePhotoUri,
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
    beforePhotoUri: challenge.before_photo,
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

export const fetchRecommendedChallenges = async (): Promise<RecommendedChallengeData[]> => {
  try {
    const { data, error } = await supabase
      .from("recommended_challenges")
      .select("*");

    if (error) {
      console.error("Error fetching recommended challenges:", error);
      throw error;
    }

    return data.map((challenge: any) => ({
      id: challenge.id,
      name: challenge.name,
      duration: challenge.duration,
      habits_pl: challenge.habits_pl || [],
      habits_en: challenge.habits_en || [],
      habits_es: challenge.habits_es || [],
      habits_fr: challenge.habits_fr || [],
      habits_de: challenge.habits_de || [],
      habits_it: challenge.habits_it || []
    }));
  } catch (error) {
    console.error("Error in fetchRecommendedChallenges:", error);
    throw error;
  }
};

export interface CompletedChallenge {
  id: string;
  name: string;
  beforePhotoUri: string | null;
  afterPhotoUri: string | null;
  endDate: string;
  startDate: string;
  habits: string[];
}

interface CompletedChallengeDb {
  id: string;
  name: string;
  before_photo_uri: string | null;
  after_photo_uri: string | null;
  end_date: string;
  start_date: string;
  habits: string[];
}

const mapCompletedChallengeFromDb = (dbChallenge: CompletedChallengeDb): CompletedChallenge => ({
  id: dbChallenge.id,
  name: dbChallenge.name,
  beforePhotoUri: dbChallenge.before_photo_uri,
  afterPhotoUri: dbChallenge.after_photo_uri,
  endDate: dbChallenge.end_date,
  startDate: dbChallenge.start_date,
  habits: dbChallenge.habits,
});

export const markChallengeAsViewed = async (challengeId: string) => {
  try {
    
    if (!challengeId) {
      throw new Error('Challenge ID is required');
    }

    const { data, error } = await supabase
      .from('challenges')
      .update({ was_displayed: true })
      .eq('id', challengeId)
      .select();

    if (error) {
      console.error('Supabase error in markChallengeAsViewed:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('No data returned after update');
      throw new Error('No data returned after update');
    }

    return data[0];
  } catch (error) {
    console.error('Error in markChallengeAsViewed:', error);
    throw error;
  }
};

export const fetchCompletedChallenges = async (): Promise<CompletedChallenge[]> => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .lte('end_date', yesterday.toISOString())
    .eq('was_displayed', false)
    .order('end_date', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data.map((challenge) => ({
    id: challenge.id,
    name: challenge.name,
    beforePhotoUri: challenge.before_photo_uri,
    afterPhotoUri: challenge.after_photo_uri,
    endDate: challenge.end_date,
    startDate: challenge.start_date,
    habits: challenge.habits || [],
  }));
};

export const skipAfterPhoto = async (challengeId: string) => {
  const { error } = await supabase
    .from('challenges')
    .update({ after_photo_uri: 'skipped' })
    .eq('id', challengeId);

  if (error) {
    console.error('Error skipping after photo:', error);
    throw error;
  }
};