import { supabase } from "./supabaseClient";
import { HabitData } from "../../components/AddHabitModal/types";
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

    const { data: invitations, error: invitationsError } = await supabase
      .from("challenge_invitations")
      .select("challenge_id")
      .eq("receiver_id", userId)
      .eq("status", "accepted");

    if (invitationsError) {
      throw invitationsError;
    }

    const challengeIds = invitations?.map(inv => inv.challenge_id) || [];

    const { data: challenges, error: challengesError } = await supabase
      .from("challenges")
      .select("habits")
      .in("id", challengeIds);

    if (challengesError) {
      throw challengesError;
    }

    const challengeHabitIds = challenges?.flatMap(challenge => challenge.habits || []) || [];

    const { data: challengeHabits, error: challengeHabitsError } = await supabase
      .from("habits")
      .select("*")
      .in("id", challengeHabitIds);

    if (challengeHabitsError) {
      throw challengeHabitsError;
    }

    const allHabits = [...(data || []), ...(challengeHabits || [])];

    const mappedHabits = allHabits.map(mapHabitFromDb);
    return mappedHabits;
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw error;
  }
};

export interface RecommendedChallengeData {
  id: string;
  name: string;
  duration: string;
  habits_en: string[];
  habits_pl: string[];
  habits_es: string[];
  habits_fr: string[];
  habits_de: string[];
  habits_it: string[];
}

export interface Challenge {
  id: string;
  name: string;
  beforePhotoUri: string | null;
  afterPhotoUri: string | null;
  endDate: string;
  startDate: string;
  habits: string[];
  participants: string[];
}

interface DbChallenge {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  habits: string[];
  before_photo_uri: string | null;
  after_photo_uri: string | null;
  participants: string[];
}

const mapChallengeFromDb = (dbChallenge: DbChallenge): Challenge => {
  const mapped = {
    id: dbChallenge.id,
    name: dbChallenge.name,
    beforePhotoUri: dbChallenge.before_photo_uri,
    afterPhotoUri: dbChallenge.after_photo_uri,
    endDate: dbChallenge.end_date,
    startDate: dbChallenge.start_date,
    habits: Array.isArray(dbChallenge.habits) ? dbChallenge.habits : [],
    participants: Array.isArray(dbChallenge.participants) ? dbChallenge.participants : [],
  };

  return mapped;
};

export const getActiveChallenges = async (userId: string): Promise<ChallengeData[]> => {
  try {
    const today = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .contains('participants', [userId])
      .gt('end_date', today)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching active challenges:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      beforePhotoUri: challenge.before_photo_uri,
      afterPhotoUri: challenge.after_photo_uri,
      endDate: challenge.end_date,
      startDate: challenge.start_date,
      habits: challenge.habits || [],
      participants: challenge.participants || []
    }));
  } catch (error) {
    console.error('Error in getActiveChallenges:', error);
    throw error;
  }
};

export const getCompletedChallenges = async (userId: string | { id: string }): Promise<ChallengeData[]> => {
  try {
    const today = new Date().toISOString();
    const actualUserId = typeof userId === 'string' ? userId : userId.id;

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .contains('participants', [actualUserId])
      .lte('end_date', today)
      .order('end_date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      beforePhotoUri: challenge.before_photo_uri || undefined,
      afterPhotoUri: challenge.after_photo_uri || undefined,
      endDate: challenge.end_date,
      startDate: challenge.start_date,
      habits: challenge.habits || [],
      participants: challenge.participants || []
    }));
  } catch (error) {
    throw error;
  }
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

interface ChallengeInput {
  name: string;
  startDate: string;
  endDate: string;
  habits: string[];
  beforePhotoUri?: string;
  afterPhotoUri?: string;
}

export const addChallenge = async (
  userId: string,
  challengeData: ChallengeInput
): Promise<Challenge> => {
  try {
    const startDate = challengeData.startDate || new Date().toISOString();
    const endDate = challengeData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        name: challengeData.name,
        start_date: startDate,
        end_date: endDate,
        habits: challengeData.habits,
        before_photo_uri: challengeData.beforePhotoUri,
        after_photo_uri: challengeData.afterPhotoUri,
        participants: [userId],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error in addChallenge:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after insert');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    console.error('Error in addChallenge:', error);
    throw error;
  }
};

export const sendChallengeInvitation = async (
  challengeId: string,
  senderId: string,
  receiverId: string
): Promise<ChallengeInvitation> => {
  try {
    const { data: senderData, error: senderError } = await supabase
      .rpc('get_user_by_email', { user_email: senderId });

    if (senderError || !senderData || !senderData.id) {
      console.error('Supabase error in sendChallengeInvitation (sender):', senderError);
      throw new Error('Sender not found');
    }

    const { data: receiverData, error: receiverError } = await supabase
      .rpc('get_user_by_email', { user_email: receiverId });

    if (receiverError || !receiverData || !receiverData.id) {
      console.error('Supabase error in sendChallengeInvitation (receiver):', receiverError);
      throw new Error('Receiver not found');
    }

    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challengeError) {
      console.error('Supabase error in sendChallengeInvitation (challenge):', challengeError);
      throw challengeError;
    }

    if (!challengeData) {
      throw new Error('Challenge not found');
    }

    const { data: existingInvitation, error: checkError } = await supabase
      .from('challenge_invitations')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('receiver_id', receiverData.id)
      .eq('status', 'pending')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Supabase error in sendChallengeInvitation (check):', checkError);
      throw checkError;
    }

    if (existingInvitation) {
      throw new Error('Invitation already exists');
    }

    const { data: invitationData, error: invitationError } = await supabase
      .from('challenge_invitations')
      .insert({
        challenge_id: challengeId,
        sender_id: senderData.id,
        receiver_id: receiverData.id,
        status: 'pending',
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Supabase error in sendChallengeInvitation (invitation):', invitationError);
      throw invitationError;
    }

    if (!invitationData) {
      throw new Error('No data returned after insert');
    }

    return {
      id: invitationData.id,
      challenge_id: invitationData.challenge_id,
      sender_id: invitationData.sender_id,
      receiver_id: invitationData.receiver_id,
      status: invitationData.status,
      created_at: invitationData.created_at,
      challenge: mapChallengeFromDb(challengeData as DbChallenge),
      sender: {
        id: senderData.id,
        username: senderData.email?.split('@')[0] || 'User',
        avatar_url: '',
      },
    };
  } catch (error) {
    console.error('Error in sendChallengeInvitation:', error);
    throw error;
  }
};

interface ChallengeInvitation {
  id: string;
  challenge_id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  challenge: Challenge;
  sender: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export const respondToChallengeInvitation = async (
  invitationId: string,
  status: 'accepted' | 'rejected'
): Promise<ChallengeInvitation> => {
  try {
    const { data: invitationData, error: invitationError } = await supabase
      .from('challenge_invitations')
      .update({ status })
      .eq('id', invitationId)
      .select()
      .single();

    if (invitationError) {
      console.error('Supabase error in respondToChallengeInvitation (invitation):', invitationError);
      throw invitationError;
    }

    if (!invitationData) {
      throw new Error('Invitation not found');
    }

    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', invitationData.challenge_id)
      .single();

    if (challengeError) {
      console.error('Supabase error in respondToChallengeInvitation (challenge):', challengeError);
      throw challengeError;
    }

    const { data: senderData, error: senderError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('id', invitationData.sender_id)
      .single();

    if (senderError) {
      console.error('Supabase error in respondToChallengeInvitation (sender):', senderError);
      throw senderError;
    }

    if (status === 'accepted') {
      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          participants: [...challengeData.participants, invitationData.receiver_id]
        })
        .eq('id', invitationData.challenge_id);

      if (updateError) {
        console.error('Supabase error in respondToChallengeInvitation (update):', updateError);
        throw updateError;
      }
    }

    return {
      id: invitationData.id,
      challenge_id: invitationData.challenge_id,
      sender_id: invitationData.sender_id,
      receiver_id: invitationData.receiver_id,
      status: invitationData.status,
      created_at: invitationData.created_at,
      challenge: mapChallengeFromDb(challengeData as DbChallenge),
      sender: {
        id: senderData.id,
        username: senderData.email?.split('@')[0] || 'User',
        avatar_url: '',
      },
    };
  } catch (error) {
    console.error('Error in respondToChallengeInvitation:', error);
    throw error;
  }
};

export const fetchChallengeInvitations = async (userId: string): Promise<ChallengeInvitation[]> => {
  try {
    const { data, error } = await supabase
      .from('challenge_invitations')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in fetchChallengeInvitations:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(invitation => ({
      id: invitation.id,
      challenge_id: invitation.challenge_id,
      sender_id: invitation.sender_id,
      receiver_id: invitation.receiver_id,
      status: invitation.status,
      created_at: invitation.created_at,
      challenge: mapChallengeFromDb(invitation.challenge as DbChallenge),
      sender: {
        id: invitation.sender_id,
        username: 'User',
        avatar_url: ''
      },
    }));
  } catch (error) {
    console.error('Error in fetchChallengeInvitations:', error);
    throw error;
  }
};

export const getPendingChallengeInvitations = fetchChallengeInvitations;

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

export const fetchRecommendedChallenges = async (userId: string): Promise<RecommendedChallengeData[]> => {
  try {
    const { data: recommendedData, error: recommendedError } = await supabase
      .from("recommended_challenges")
      .select("*");

    if (recommendedError) throw recommendedError;

    const { data: activeChallenges, error: activeError } = await supabase
      .from('challenges')
      .select('name')
      .contains('participants', [userId])
      .gt('end_date', new Date().toISOString());

    if (activeError) throw activeError;

    const activeChallengeNames = new Set(
      (activeChallenges || []).map(challenge => challenge.name.toLowerCase())
    );

    const filteredChallenges = recommendedData.filter(
      challenge => !activeChallengeNames.has(challenge.name.toLowerCase())
    );

    return filteredChallenges.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      duration: challenge.duration.toString(),
      habits_en: challenge.habits_en || [],
      habits_pl: challenge.habits_pl || [],
      habits_es: challenge.habits_es || [],
      habits_fr: challenge.habits_fr || [],
      habits_de: challenge.habits_de || [],
      habits_it: challenge.habits_it || []
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchCompletedChallenges = async (): Promise<ChallengeData[]> => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .lte('end_date', yesterday.toISOString())
      .eq('was_displayed', false)
      .order('end_date', { ascending: false });

    if (error) {
      console.error('Supabase error in fetchCompletedChallenges:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => mapChallengeFromDb(challenge as DbChallenge) as ChallengeData);
  } catch (error) {
    console.error('Error in fetchCompletedChallenges:', error);
    throw error;
  }
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

export const fetchChallengeById = async (challengeId: string): Promise<Challenge> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) {
      console.error('Supabase error in fetchChallengeById:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Challenge not found');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    console.error('Error in fetchChallengeById:', error);
    throw error;
  }
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

    if (signedUrlError || !signedUrlData || !signedUrlData.signedUrl) {
      throw signedUrlError || new Error("No signed URL returned");
    }
    return signedUrlData.signedUrl;
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

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("before")
      .createSignedUrl(fileName, 3600);

    if (signedUrlError || !signedUrlData || !signedUrlData.signedUrl) {
      throw signedUrlError || new Error("No signed URL returned");
    }

    const { error: updateError } = await supabase
      .from("challenges")
      .update({ before_photo_uri: fileName })
      .eq("id", challengeId);

    if (updateError) {
      throw updateError;
    }

    return signedUrlData.signedUrl;
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

    const photoUri = photoType === 'before' 
      ? (challenge as { before_photo_uri: string }).before_photo_uri 
      : (challenge as { after_photo_uri: string }).after_photo_uri;

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

    const { error: updateError } = await supabase
      .rpc('update_user_avatar', { 
        user_id: userId, 
        avatar_url: data.signedUrl 
      });

    if (updateError) {
      throw updateError;
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
  user_id: string;
  friend_id: string;
  created_at: string;
}

export const getFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("status", "accepted")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) throw error;

    return (data || []).map(request => ({
      id: request.id,
      user_id: request.sender_id === userId ? request.sender_id : request.receiver_id,
      friend_id: request.sender_id === userId ? request.receiver_id : request.sender_id,
      created_at: request.created_at
    }));
  } catch (error) {
    console.error("Error getting friends:", error);
    throw error;
  }
};

export const fetchFriends = getFriends;

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

export const canSendPoke = async (senderId: string, receiverId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('can_send_poke', {
        p_sender_id: senderId,
        p_receiver_id: receiverId
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error checking if can send poke:", error);
    return false;
  }
};

export const sendPoke = async (senderId: string, receiverId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('send_poke', {
        p_sender_id: senderId,
        p_receiver_id: receiverId
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending poke:", error);
    return false;
  }
};

export const subscribeToPokeNotifications = (userId: string, onPokeReceived: (senderName: string) => void) => {
  const channel = supabase
    .channel('poke_notifications')
    .on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: 'friend_pokes',
        filter: `receiver_id=eq.${userId}`
      },
      (payload: { new: { sender_id: string } }) => {
        try {
          supabase
            .from('user_profiles')
            .select('name')
            .eq('id', payload.new.sender_id)
            .single()
            .then(({ data }) => {
              if (data?.name) {
                onPokeReceived(data.name);
              }
            });
        } catch (error) {
          console.error('Error handling poke notification:', error);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const markChallengeAsViewed = async (challengeId: string): Promise<Challenge> => {
  try {
    if (!challengeId) {
      throw new Error('Challenge ID is required');
    }

    const { data, error } = await supabase
      .from('challenges')
      .update({ was_displayed: true })
      .eq('id', challengeId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error in markChallengeAsViewed:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned after update');
      throw new Error('No data returned after update');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    console.error('Error in markChallengeAsViewed:', error);
    throw error;
  }
};

export const addRecommendedChallenge = async (
  userId: string,
  challengeData: RecommendedChallengeData
): Promise<Challenge> => {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(challengeData.duration || 30));

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        name: challengeData.name,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        habits: challengeData.habits_en || [],
        participants: [userId],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error in addRecommendedChallenge:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after insert');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    console.error('Error in addRecommendedChallenge:', error);
    throw error;
  }
};

export const fetchUserChallenges = async (userId: string): Promise<ChallengeData[]> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .contains('participants', [userId])
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      beforePhotoUri: challenge.before_photo_uri || undefined,
      afterPhotoUri: challenge.after_photo_uri || undefined,
      endDate: challenge.end_date,
      startDate: challenge.start_date,
      habits: challenge.habits || [],
      participants: challenge.participants || []
    }));
  } catch (error) {
    throw error;
  }
};