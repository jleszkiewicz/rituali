import * as Notifications from 'expo-notifications';
import { supabase } from './supabaseClient';
import { t } from './translateService';
import { Platform } from 'react-native';
import { format } from 'date-fns';
import { dateFormat } from '@/constants/Constants';

// Konfiguracja powiadomień
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Funkcja do sprawdzania i żądania uprawnień
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return finalStatus === 'granted';
};

// Funkcja do anulowania wszystkich zaplanowanych powiadomień
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Funkcja do planowania sprawdzania nieukończonych nawyków
export const scheduleUncompletedHabitsCheck = async (userId: string) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error scheduling uncompleted habits check:', error);
  }
};

// Funkcja do sprawdzania nieukończonych nawyków
export const checkUncompletedHabits = async (userId: string) => {
  try {
    const today = format(new Date(), dateFormat);
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    const uncompletedHabits = habits?.filter(habit => {
      const completionDates = habit.completion_dates || [];
      return !completionDates.includes(today);
    });

    if (uncompletedHabits && uncompletedHabits.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  } catch (error) {
    console.error('Error checking uncompleted habits:', error);
  }
};

// Funkcja do wysyłania powiadomienia o zaproszeniu do znajomych
export const sendFriendRequestNotification = async (
  userId: string,
  senderName: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('friend_request_notification_title'),
        body: t('friend_request_notification_body').replace('{{name}}', senderName),
        data: { type: 'friend_request' },
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending friend request notification:', error);
  }
};

// Funkcja do wysyłania powiadomienia o zaproszeniu do wyzwania
export const sendChallengeInvitationNotification = async (
  userId: string,
  senderName: string,
  challengeName: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('challenge_invitation_notification_title'),
        body: t('challenge_invitation_notification_body')
          .replace('{{name}}', senderName)
          .replace('{{challengeName}}', challengeName),
        data: { type: 'challenge_invitation' },
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending challenge invitation notification:', error);
  }
};

// Funkcja do wysyłania powiadomienia o zakończeniu wyzwania
export const sendChallengeCompletedNotification = async (
  userId: string,
  challengeName: string
) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('challenge_completed_notification_title'),
        body: t('challenge_completed_notification_body').replace(
          '{{challengeName}}',
          challengeName
        ),
        data: { type: 'challenge_completed' },
      },
      trigger: {
        type: 'date',
        date: tomorrow,
      },
    });
  } catch (error) {
    console.error('Error sending challenge completed notification:', error);
  }
};

// Subskrypcja do powiadomień o zaproszeniach do znajomych
export const subscribeToFriendRequestNotifications = (userId: string) => {
  const channel = supabase
    .channel(`friend_requests:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'friend_requests',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload) => {
        const { data: sender } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', payload.new.sender_id)
          .single();

        if (sender) {
          await sendFriendRequestNotification(userId, sender.display_name);
        }
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

// Subskrypcja do powiadomień o zaproszeniach do wyzwań
export const subscribeToChallengeInvitationNotifications = (userId: string) => {
  const channel = supabase
    .channel(`challenge_invitations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'challenge_invitations',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload) => {
        const { data: sender } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', payload.new.sender_id)
          .single();

        const { data: challenge } = await supabase
          .from('challenges')
          .select('name')
          .eq('id', payload.new.challenge_id)
          .single();

        if (sender && challenge) {
          await sendChallengeInvitationNotification(
            userId,
            sender.display_name,
            challenge.name
          );
        }
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

// Subskrypcja do powiadomień o poke'ach
export const subscribeToPokeNotifications = (userId: string) => {
  const channel = supabase
    .channel(`pokes:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'pokes',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload) => {
        const { data: sender } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', payload.new.sender_id)
          .single();

        if (sender) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: t('poke_notification_title'),
              body: t('poke_notification_body').replace('{{name}}', sender.display_name),
              data: { type: 'poke' },
            },
            trigger: null,
          });
        }
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}; 