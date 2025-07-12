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
  completionDates: dbHabit.completion_dates,
  category: dbHabit.category,
  frequency: dbHabit.frequency || "daily",
  selectedDays: dbHabit.selected_days || [],
  isPartOfChallenge: dbHabit.is_part_of_challenge,
  startDate: dbHabit.start_date,
  endDate: dbHabit.end_date,
  status: dbHabit.status,
});

const mapHabitToDb = (habit: HabitData): any => ({
  name: habit.name,
  completion_dates: habit.completionDates,
  category: habit.category,
  frequency: habit.frequency,
  selected_days: habit.selectedDays,
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
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      throw error;
    }

    return (data || []).map(mapHabitFromDb);
  } catch (error) {
    throw error;
  }
};

export interface RecommendedChallengeData {
  id: string;
  name: string;
  duration: string;
  habits: {
    pl: string[];
    en: string[];
    it: string[];
    fr: string[];
    de: string[];
  };
  participants_count: number;
  background_illustration: string;
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

const mapChallengeFromDb = (dbChallenge: DbChallenge): ChallengeData => ({
  id: dbChallenge.id,
  name: dbChallenge.name,
  beforePhotoUri: dbChallenge.before_photo_uri || undefined,
  afterPhotoUri: dbChallenge.after_photo_uri || undefined,
  startDate: dbChallenge.start_date,
  endDate: dbChallenge.end_date,
  habits: dbChallenge.habits || [],
  participants: dbChallenge.participants || []
});

const mapChallengeToDb = (challenge: ChallengeData): DbChallenge => ({
  id: challenge.id,
  name: challenge.name,
  before_photo_uri: challenge.beforePhotoUri || null,
  after_photo_uri: challenge.afterPhotoUri || null,
  start_date: challenge.startDate,
  end_date: challenge.endDate,
  habits: challenge.habits,
  participants: challenge.participants
});

export const getActiveChallenges = async (userId: string): Promise<ChallengeData[]> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .contains('participants', [userId])
      .order('start_date', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => mapChallengeFromDb(challenge as DbChallenge));
  } catch (error) {
    throw error;
  }
};

export const getSharedActiveChallenges = async (userId: string): Promise<ChallengeData[]> => {
  try {
    const today = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .contains('participants', [userId])
      .gt('end_date', today)
      .order('start_date', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    const sharedChallenges = data.filter(challenge => challenge.participants.length > 1);

    return sharedChallenges.map(challenge => mapChallengeFromDb(challenge as DbChallenge));
  } catch (error) {
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
    completion_dates: habit.completionDates,
    category: habit.category,
    frequency: habit.frequency,
    selected_days: habit.selectedDays,
    is_part_of_challenge: habit.isPartOfChallenge,
    start_date: habit.startDate,
    end_date: habit.endDate,
    status: habit.status,
  };

  const { data, error } = await supabase
    .from("habits")
    .insert([dbHabit])
    .select();

  if (error) {
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
): Promise<ChallengeData> => {
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
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after insert');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    throw error;
  }
};

export const sendChallengeInvitation = async (
  challengeId: string,
  senderId: string,
  receiverId: string
): Promise<ChallengeInvitation> => {
  try {
    const senderData = { id: senderId };
    const receiverData = { id: receiverId };

    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challengeError) {
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
        username: 'User',
        avatar_url: '',
      },
    };
  } catch (error) {
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
  challenge: ChallengeData;
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
      throw challengeError;
    }

    const { data: senderData, error: senderError } = await supabase
      .rpc('get_user_by_id', { user_id: invitationData.sender_id });

    if (senderError) {
      throw senderError;
    }

    if (status === 'accepted') {
      const updatedParticipants = [...new Set([...challengeData.participants, invitationData.receiver_id])];

      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          participants: updatedParticipants
        })
        .eq('id', invitationData.challenge_id);

      if (updateError) {
        throw updateError;
      }

      const { data: verifyData, error: verifyError } = await supabase
        .from('challenges')
        .select('participants')
        .eq('id', invitationData.challenge_id)
        .single();

      if (verifyError) {
        throw verifyError;
      }

      const { data: challengeHabits, error: habitsError } = await supabase
        .from("habits")
        .select('*')
        .in('id', challengeData.habits)
        .eq('user_id', invitationData.sender_id);

      if (habitsError) {
        throw habitsError;
      }

      const newHabits = challengeHabits.map(habit => ({
        user_id: invitationData.receiver_id,
        name: habit.name,
        completion_dates: [],
        category: habit.category,
        is_part_of_challenge: true,
        start_date: format(new Date(), dateFormat),
        end_date: challengeData.end_date,
        status: 'active'
      }));

      const { error: insertError } = await supabase
        .from("habits")
        .insert(newHabits);

      if (insertError) {
        throw insertError;
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
        id: senderData?.id || invitationData.sender_id,
        username: senderData?.display_name || senderData?.email?.split('@')[0] || 'User',
        avatar_url: senderData?.avatar_url || ''
      },
    };
  } catch (error) {
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
      throw error;
    }

    if (!data) {
      return [];
    }

    const invitationsWithSenders = await Promise.all(
      data.map(async (invitation) => {
        const { data: userData, error: userError } = await supabase
          .rpc('get_user_by_id', { user_id: invitation.sender_id });

        if (userError) {
          throw userError;
        }

        const senderData = userData?.[0] || null;

        return {
          id: invitation.id,
          challenge_id: invitation.challenge_id,
          sender_id: invitation.sender_id,
          receiver_id: invitation.receiver_id,
          status: invitation.status,
          created_at: invitation.created_at,
          challenge: mapChallengeFromDb(invitation.challenge as DbChallenge),
          sender: {
            id: senderData?.id || invitation.sender_id,
            username: senderData?.email?.split('@')[0] || 'User',
            avatar_url: senderData?.avatar_url || ''
          },
        };
      })
    );

    return invitationsWithSenders;
  } catch (error) {
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
      throw error;
    }

    return mapHabitFromDb(data[0]);
  } catch (error) {
    throw error;
  }
};

export const deleteChallenge = async (challengeId: string) => {
  try {
    const { data: challenge, error: fetchError } = await supabase
      .from("challenges")
      .select("habits")
      .eq("id", challengeId)
      .single();

    if (fetchError) throw fetchError;

    if (challenge && challenge.habits && challenge.habits.length > 0) {
      const { error: habitsError } = await supabase
        .from("habits")
        .delete()
        .in("id", challenge.habits);

      if (habitsError) throw habitsError;
    }

    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challengeId);

    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateChallengeHabits = async (challengeId: string, habits: string[]) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .update({ habits: habits })
      .eq("id", challengeId)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};

export const fetchRecommendedChallenges = async (userId: string) => {
  try {
    const { data: recommendedChallenges, error } = await supabase
      .from("recommended_challenges")
      .select("*");

    if (error) throw error;

    const today = new Date().toISOString();
    const { data: userChallenges, error: userChallengesError } = await supabase
      .from("challenges")
      .select("name")
      .contains("participants", [userId])
      .gt("end_date", today);

    if (userChallengesError) throw userChallengesError;

    const activeChallengeNames = userChallenges.map((challenge) => challenge.name);
    const filteredChallenges = recommendedChallenges.filter(
      (challenge) => !activeChallengeNames.includes(challenge.name)
    );

    return filteredChallenges.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      duration: challenge.duration,
      background_illustration: challenge.background_illustration,
      participants_count: challenge.participants_count,
      habits: {
        pl: challenge.habits_pl || [],
        en: challenge.habits_en || [],
        it: challenge.habits_it || [],
        fr: challenge.habits_fr || [],
        de: challenge.habits_de || []
      }
    }));
  } catch (error) {
    console.error("Error fetching recommended challenges:", error);
    return [];
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
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(challenge => mapChallengeFromDb(challenge as DbChallenge) as ChallengeData);
  } catch (error) {
    throw error;
  }
};

export const skipAfterPhoto = async (challengeId: string) => {
  const { error } = await supabase
    .from('challenges')
    .update({ after_photo_uri: 'skipped' })
    .eq('id', challengeId);

  if (error) {
    throw error;
  }
};

export const fetchChallengeById = async (challengeId: string): Promise<ChallengeData> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Challenge not found');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
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
      throw uploadError;
    }

    const { error: updateError, data: updateData } = await supabase
      .from("challenges")
      .update({ after_photo_uri: fileName })
      .eq("id", challengeId)
      .select();

    if (updateError) {
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
      return null;
    }

    if (error || !data || !data.signedUrl) {
      return null;
    }
    return data.signedUrl;
  } catch (error) {
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

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
  created_at: string;
}

export const getFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_friends', { user_id: userId });

    if (error) {
      throw error;
    }

    return (data || []).map((friend: any) => ({
      id: friend.id,
      user_id: userId,
      friend_id: friend.id,
      display_name: friend.display_name === 'User' ? null : friend.display_name,
      avatar_url: friend.avatar_url || null,
      completion_percentage: friend.completion_percentage || 0,
      created_at: new Date().toISOString()
    }));
  } catch (error) {
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
    return false;
  }
};



export const markChallengeAsViewed = async (challengeId: string): Promise<ChallengeData> => {
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
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after update');
    }

    return mapChallengeFromDb(data as DbChallenge);
  } catch (error) {
    throw error;
  }
};

export const addRecommendedChallenge = async (
  userId: string,
  challengeData: RecommendedChallengeData
): Promise<ChallengeData> => {
  try {
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .insert({
        name: challengeData.name,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        habits: challengeData.habits.en,
        participants: [userId],
      })
      .select()
      .single();

    if (challengeError) {
      throw challengeError;
    }

    const { error: updateError } = await supabase
      .from('recommended_challenges')
      .update({ participants_count: challengeData.participants_count + 1 })
      .eq('id', challengeData.id);

    if (updateError) {
      throw updateError;
    }

    return mapChallengeFromDb(challenge as DbChallenge);
  } catch (error) {
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

    const singleUserChallenges = data
      .filter(challenge => challenge.participants.length === 1)
      .map(challenge => mapChallengeFromDb(challenge as DbChallenge));

    const sharedChallenges = data
      .filter(challenge => challenge.participants.length > 1)
      .map(challenge => mapChallengeFromDb(challenge as DbChallenge));

    return [...singleUserChallenges, ...sharedChallenges];
  } catch (error) {
    throw error;
  }
};

export const fetchSharedChallenge = async (challengeId: string): Promise<ChallengeData> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) throw error;
  return mapChallengeFromDb(data as DbChallenge);
};

export const fetchChallengeParticipants = async (challengeData: ChallengeData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const participantsData = await Promise.all(
    challengeData.participants.map(async (participantId) => {
      const { data: userData } = await supabase
        .rpc('get_user_by_id', { user_id: participantId });

      return {
        id: participantId,
        display_name: userData?.[0]?.display_name || userData?.[0]?.email?.split('@')[0] || "User",
        avatar_url: userData?.[0]?.avatar_url || null,
      };
    })
  );

  const today = new Date();
  const todayStr = format(today, dateFormat);

  return Promise.all(
    participantsData.map(async (participant) => {
      const { data: habits } = await supabase
        .from("habits")
        .select("completion_dates")
        .in("id", challengeData.habits)
        .eq("user_id", participant.id)
        .eq("status", "active");

      const challengeHabits = habits || [];
      const completedToday = challengeHabits.filter(habit => 
        habit.completion_dates.includes(todayStr)
      ).length;

      const completionPercentage = challengeData.habits.length > 0
        ? Math.round((completedToday / challengeData.habits.length) * 100)
        : 0;

      return {
        ...participant,
        completion_percentage: completionPercentage,
      };
    })
  );
};

export const leaveSharedChallenge = async (challengeId: string, userId: string) => {
  const { data: challenge } = await supabase
    .from("challenges")
    .select("participants")
    .eq("id", challengeId)
    .single();

  if (!challenge) throw new Error("Challenge not found");

  const updatedParticipants = challenge.participants.filter(
    (id: string) => id !== userId
  );

  await updateChallengeHabits(challengeId, updatedParticipants);

  const [updatedHabits, updatedChallenges] = await Promise.all([
    fetchUserHabits(userId),
    fetchUserChallenges(userId),
  ]);

  return { updatedHabits, updatedChallenges };
};

export const deleteSharedChallenge = async (challengeId: string) => {
  const { error } = await supabase
    .from("challenges")
    .delete()
    .eq("id", challengeId);

  if (error) throw error;
};

export const fetchChallengeCompletionHistory = async (challengeId: string, userId: string) => {
  try {
    const { data: challenge } = await supabase
      .from("challenges")
      .select("start_date, end_date, habits")
      .eq("id", challengeId)
      .single();

    if (!challenge) throw new Error("Challenge not found");

    const { data: habits } = await supabase
      .from("habits")
      .select("completion_dates")
      .in("id", challenge.habits)
      .eq("user_id", userId)
      .eq("status", "active");

    if (!habits) return [];

    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    const today = new Date();

    const completionHistory = [];
    let currentDate = new Date(startDate);

    while (currentDate <= today && currentDate <= endDate) {
      const dateStr = format(currentDate, dateFormat);
      const completedHabits = habits.filter(habit => 
        habit.completion_dates.includes(dateStr)
      ).length;
      
      const totalHabits = challenge.habits.length;
      const completionPercentage = totalHabits > 0 
        ? Math.round((completedHabits / totalHabits) * 100)
        : 0;

      completionHistory.push({
        date: dateStr,
        completion_percentage: completionPercentage,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return completionHistory;
  } catch (error) {
    throw error;
  }
};

export const fetchHabitById = async (habitId: string): Promise<HabitData> => {
  try {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Habit not found");
    }

    return mapHabitFromDb(data);
  } catch (error) {
    throw error;
  }
};

export interface SubscriptionData {
  id: string;
  user_id: string;
  status: 'active' | 'trial';
  plan_type: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  updated_at: string;
}

export const checkSubscriptionStatus = async (userId: string): Promise<SubscriptionData | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error checking subscription:", error);
    throw error;
  }
};

export const startSubscription = async (userId: string, type: "monthly" | "yearly"): Promise<SubscriptionData> => {
  try {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (type === 'yearly' ? 12 : 1));

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'active',
        plan_type: type,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        updated_at: now.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};

export const startTrial = async (userId: string): Promise<SubscriptionData> => {
  try {
    const now = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'trial',
        plan_type: 'monthly',
        start_date: now.toISOString(),
        end_date: trialEndDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        updated_at: now.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error starting trial:", error);
    throw error;
  }
};

export const checkAndUpdateExpiredHabits = async (userId: string | null): Promise<void> => {
  if (!userId) return;
  
  try {
    const today = format(new Date(), dateFormat);
    const { data: habits, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .not("end_date", "is", null);

    if (error) throw error;

    const expiredHabits = habits?.filter(habit => {
      const endDate = new Date(habit.end_date);
      const todayDate = new Date();
      return endDate < todayDate;
    });

    if (expiredHabits && expiredHabits.length > 0) {
      const updatePromises = expiredHabits.map(habit => 
        supabase
          .from("habits")
          .update({ status: "completed" })
          .eq("id", habit.id)
      );

      await Promise.all(updatePromises);
    }
  } catch (error) {
    console.error("Error checking expired habits:", error);
    throw error;
  }
};