import * as Notifications from 'expo-notifications';
import { t } from './translateService';
import { supabase } from './supabaseClient';
import { fetchUserHabits } from './apiService';
import { HabitData } from '../../components/AddHabitModal/types';
import { format, getDay, getWeek, getYear } from 'date-fns';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    if (notification.request.content.data?.type === 'scheduled_check') {
      const checkType = notification.request.content.data.checkType;
      if (checkType === 'challenge_completion') {
        await sendChallengeCompletionNotification();
      } else if (checkType === 'daily_reminder') {
        await sendDailyReminderNotification();
      }
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    if (status === 'granted') {
      await Notifications.setNotificationChannelAsync('friend-requests', {
        name: 'Friend Requests',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

export const sendFriendRequestNotification = async (senderName: string): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('friend_request_notification_title'),
        body: t('friend_request_notification_body').replace('{{name}}', senderName),
        data: { type: 'friend_request' },
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending friend request notification:', error);
  }
};

export const sendChallengeInvitationNotification = async (senderName: string, challengeName: string): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('challenge_invitation_notification_title'),
        body: t('challenge_invitation_notification_body')
          .replace('{{name}}', senderName)
          .replace('{{challengeName}}', challengeName),
        data: { type: 'challenge_invitation' },
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending challenge invitation notification:', error);
  }
};

export const subscribeToFriendRequestNotifications = (userId: string) => {
  const channel = supabase
    .channel('friend_request_notifications')
    .on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'friend_requests',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload) => {
        try {
          const { data: sender } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', payload.new.sender_id)
            .single();

          if (sender?.name) {
            await sendFriendRequestNotification(sender.name);
          }
        } catch (error) {
          console.error('Error handling friend request notification:', error);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToChallengeInvitationNotifications = (userId: string) => {
  const channel = supabase
    .channel('challenge_invitation_notifications')
    .on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'challenge_invitations',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload) => {
        try {
          const { data: sender } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', payload.new.sender_id)
            .single();

          const { data: challenge } = await supabase
            .from('challenges')
            .select('name')
            .eq('id', payload.new.challenge_id)
            .single();

          if (sender?.name && challenge?.name) {
            await sendChallengeInvitationNotification(sender.name, challenge.name);
          }
        } catch (error) {
          console.error('Error handling challenge invitation notification:', error);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
}; 

const shouldShowHabitOnDate = (habit: HabitData, date: Date): boolean => {
  if (habit.status === "deleted" || habit.status !== "active") {
    return false;
  }

  const habitStartDate = new Date(habit.startDate + "T00:00:00");
  const habitEndDate = habit.endDate
    ? new Date(habit.endDate + "T00:00:00")
    : null;
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (normalizedDate < habitStartDate) {
    return false;
  }

  if (habitEndDate && normalizedDate > habitEndDate) {
    return false;
  }

  const dayOfWeek = getDay(date);

  switch (habit.frequency) {
    case "daily":
      return true;

    case "weekly":
      const weekOfYear = getWeek(date);
      const yearOfYear = getYear(date);
      const habitStartWeek = getWeek(habitStartDate);
      const habitStartYear = getYear(habitStartDate);
      return weekOfYear === habitStartWeek && yearOfYear === habitStartYear;

    case "selected_days":
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const currentDayName = dayNames[dayOfWeek];
      return habit.selectedDays.includes(currentDayName);

    default:
      return true;
  }
};

const isHabitCompletedForDate = (habit: HabitData, date: Date): boolean => {
  const dateString = format(date, 'yyyy-MM-dd');
  return habit.completionDates.includes(dateString);
};

const checkIncompleteHabitsForToday = async (userId: string): Promise<boolean> => {
  try {
    const habits = await fetchUserHabits(userId);
    const today = new Date();
    
    const todayHabits = habits.filter(habit => shouldShowHabitOnDate(habit, today));
    const incompleteHabits = todayHabits.filter(habit => !isHabitCompletedForDate(habit, today));
    
    return incompleteHabits.length > 0;
  } catch (error) {
    console.error('Error checking incomplete habits:', error);
    return false;
  }
};

const checkCompletedChallengesYesterday = async (userId: string): Promise<Array<{id: string, name: string}>> => {
  try {
    const { data: challenges } = await supabase
      .from('challenges')
      .select('id, name, end_date')
      .contains('participants', [userId]);

    if (!challenges) return [];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const completedYesterday = challenges.filter(challenge => {
      const endDate = new Date(challenge.end_date);
      const endDateString = format(endDate, 'yyyy-MM-dd');
      return endDateString === yesterdayString;
    });

    return completedYesterday.map(challenge => ({
      id: challenge.id,
      name: challenge.name
    }));
  } catch (error) {
    console.error('Error checking completed challenges:', error);
    return [];
  }
};

export const sendDailyReminderNotification = async (): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const hasIncompleteHabits = await checkIncompleteHabitsForToday(user.id);
    
    if (hasIncompleteHabits) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t('daily_reminder_notification_title'),
          body: t('daily_reminder_notification_body'),
          data: { type: 'daily_reminder' },
          sound: 'default',
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error('Error sending daily reminder notification:', error);
  }
};

export const sendChallengeCompletionNotification = async (): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const completedChallenges = await checkCompletedChallengesYesterday(user.id);
    
    if (completedChallenges.length > 0) {
      const challengeNames = completedChallenges.map(c => c.name).join(', ');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t('challenge_completion_notification_title'),
          body: t('challenge_completion_notification_body').replace('{{challengeNames}}', challengeNames),
          data: { 
            type: 'challenge_completion',
            challengeIds: completedChallenges.map(c => c.id)
          },
          sound: 'default',
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error('Error sending challenge completion notification:', error);
  }
};



export const scheduleDailyReminderNotification = async (): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    await cancelDailyReminderNotifications();

    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });

    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    
    if (now.getHours() >= 18) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const delayInSeconds = Math.floor((targetTime.getTime() - now.getTime()) / 1000);

    if (delayInSeconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Reminder Check',
          body: 'Checking for incomplete habits...',
          data: { type: 'scheduled_check', checkType: 'daily_reminder' },
          sound: 'default',
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error('Error scheduling daily reminder notification:', error);
  }
};

export const cancelDailyReminderNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'scheduled_check') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error canceling daily reminder notifications:', error);
  }
};

 