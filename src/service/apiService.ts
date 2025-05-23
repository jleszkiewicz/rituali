import { supabase } from "./supabaseClient";
import { HabitData, RecommendedChallengeData } from "../../components/AddHabitModal/types";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

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

export interface Challenge {
  id: string;
  name: string;
  beforePhotoUri: string | null;
  afterPhotoUri: string | null;
  endDate: string;
  startDate: string;
  habits: string[];
}

export const fetchChallengeById = async (challengeId: string): Promise<Challenge> => {

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) {
    console.error("Error fetching challenge:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Challenge not found");
  }

  return {
    id: data.id,
    name: data.name,
    beforePhotoUri: data.before_photo_uri,
    afterPhotoUri: data.after_photo_uri,
    endDate: data.end_date,
    startDate: data.start_date,
    habits: data.habits || [],
  };
};

export const uploadAfterPhoto = async (challengeId: string, photoUri: string) => {
  try {
    const fileName = `after_${Date.now()}.jpg`;

    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("after")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
        upsert: true
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      throw uploadError;
    }

    const { error: updateError, data: updateData } = await supabase
      .from("challenges")
      .update({ after_photo_uri: fileName })
      .eq("id", challengeId)
      .select();

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("after")
      .createSignedUrl(fileName, 3600);

    if (signedUrlError || !data || !data.signedUrl) {
      throw signedUrlError || new Error("No signed URL returned");
    }
    return data.signedUrl;
  } catch (error) {
    console.error("Error uploading after photo:", error);
    throw error;
  }
};

export const uploadBeforePhoto = async (challengeId: string, photoUri: string): Promise<string> => {
  try {
    const fileName = `before_${Date.now()}.jpg`;

    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("before")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
      .from("before")
      .createSignedUrl(fileName, 3600);

    if (signedUrlError || !data || !data.signedUrl) {
      throw signedUrlError || new Error("No signed URL returned");
    }

    const { error: updateError } = await supabase
      .from("challenges")
      .update({ before_photo_uri: fileName })
      .eq("id", challengeId);

    if (updateError) {
      throw updateError;
    }

    return signedUrl;
  } catch (error) {
    console.error("Error uploading before photo:", error);
    throw error;
  }
};

export const getSignedUrl = async (bucket: string, url: string) => {
  try {
    let fileName = url;
    if (url.includes("supabase.co/storage/v1/object")) {
      const urlParts = url.split("/");
      fileName = urlParts[urlParts.length - 1].split("?")[0];
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 60 * 60);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    if (error || !data || !data.signedUrl) {
      return null;
    }
    return data.signedUrl;
  } catch (error) {
    console.error("Error in getSignedUrl:", error);
    return null;
  }
};

export const deletePhoto = async (challengeId: string, photoType: 'before' | 'after') => {
  try {
    const { data: challenge } = await supabase
      .from("challenges")
      .select(`${photoType}_photo_uri`)
      .eq("id", challengeId)
      .single();

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const photoUri = challenge[`${photoType}_photo_uri`];
    if (!photoUri) {
      return;
    }

    const { error: storageError } = await supabase.storage
      .from(photoType)
      .remove([photoUri]);

    if (storageError) {
      throw storageError;
    }

    const { error: updateError } = await supabase
      .from("challenges")
      .update({ [`${photoType}_photo_uri`]: null })
      .eq("id", challengeId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    throw error;
  }
};

export const uploadProfilePhoto = async (userId: string, photoUri: string): Promise<string> => {
  try {
    const fileName = `${userId}.jpg`;
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
      });
    if (uploadError) {
      throw uploadError;
    }
    const { data, error: signedUrlError } = await supabase.storage
      .from("profile")
      .createSignedUrl(fileName, 60 * 60 * 24 * 7) as { data: { signedUrl: string } | null, error: any };
    if (signedUrlError || !data || !data.signedUrl) {
      throw signedUrlError || new Error("No signed URL returned");
    }
    return data.signedUrl;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
};

export const fetchProfilePhotoUrl = async (userId: string): Promise<string | null> => {
  try {
    const fileName = `${userId}.jpg`;
    const { data, error } = await supabase.storage
      .from("profile")
      .createSignedUrl(fileName, 60 * 60 * 24 * 7) as { data: { signedUrl: string } | null, error: any };
    if (error || !data || !data.signedUrl) {
      return null;
    }
    return data.signedUrl;
  } catch (error) {
    return null;
  }
};

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export const sendFriendRequest = async (senderId: string, email: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .rpc('get_user_by_email', { user_email: email });

    if (userError) {
      throw new Error("Error finding user");
    }

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.id === senderId) {
      throw new Error("Cannot send friend request to yourself");
    }

    const { data: existingRequest, error: requestError } = await supabase
      .from("friend_requests")
      .select("id, status")
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${userData.id}),and(sender_id.eq.${userData.id},receiver_id.eq.${senderId})`)
      .in("status", ["pending", "accepted"])
      .single();

    if (requestError && requestError.code !== 'PGRST116') {
      throw new Error("Error checking existing request");
    }

    if (existingRequest) {
      throw new Error(existingRequest.status === "accepted" 
        ? "You are already friends with this user" 
        : "Friend request already exists");
    }

    const { error: sendError } = await supabase
      .from("friend_requests")
      .insert([
        {
          sender_id: senderId,
          receiver_id: userData.id,
          status: "pending",
        },
      ]);

    if (sendError) {
      throw new Error("Error sending friend request");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export const fetchFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const { data: friends, error } = await supabase
      .rpc('get_friends', { user_id: userId });

    if (error) throw error;

    return friends?.map((friend: Friend) => ({
      id: friend.id,
      display_name: friend.display_name || "User",
      avatar_url: friend.avatar_url
    })) || [];
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const fetchPendingFriendRequests = async (userId: string) => {
  try {
    const { data: requestsData, error: requestsError } = await supabase
      .from("friend_requests")
      .select("id, sender_id, receiver_id")
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (requestsError) throw requestsError;

    if (requestsData && requestsData.length > 0) {
      const requestsWithUsers = await Promise.all(
        requestsData.map(async (request) => {
          const { data: userData, error: userError } = await supabase
            .rpc('get_friends', { user_id: request.sender_id });

          if (userError) throw userError;

          return {
            ...request,
            sender: userData?.[0] || null
          };
        })
      );

      return requestsWithUsers;
    }

    return [];
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    throw error;
  }
};

export const handleFriendRequest = async (requestId: string, accept: boolean) => {
  try {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", requestId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error handling friend request:", error);
    throw error;
  }
};

export const removeFriend = async (userId: string, friendId: string) => {
  try {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
      .eq("status", "accepted");

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};