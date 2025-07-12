import * as Notifications from 'expo-notifications';
import { sendDailyReminderNotification, sendChallengeCompletionNotification } from './notificationsService';

export const registerDailyReminderTask = async (): Promise<void> => {
  try {
    await scheduleDailyReminders();
  } catch (error) {
    console.error('Error registering daily reminder task:', error);
  }
};

export const unregisterDailyReminderTask = async (): Promise<void> => {
  try {
    await cancelAllScheduledReminders();
  } catch (error) {
    console.error('Error unregistering daily reminder task:', error);
  }
};

const scheduleDailyReminders = async (): Promise<void> => {
  try {
    await cancelAllScheduledReminders();

    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });

    const now = new Date();
    const today8am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
    const today6pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

    if (now < today8am) {
      await scheduleNotification(today8am, 'challenge_completion');
    }
    if (now < today6pm) {
      await scheduleNotification(today6pm, 'daily_reminder');
    }
  } catch (error) {
    console.error('Error scheduling daily reminders:', error);
  }
};

const scheduleNotification = async (date: Date, type: string): Promise<void> => {
  const delayInSeconds = Math.floor((date.getTime() - new Date().getTime()) / 1000);
  
  if (delayInSeconds > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: type === 'challenge_completion' ? 'Challenge Completion Check' : 'Daily Reminder Check',
        body: 'Checking for notifications...',
        data: { type: 'scheduled_check', checkType: type },
        sound: 'default',
      },
      trigger: null,
    });
  }
};

const cancelAllScheduledReminders = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'scheduled_check') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error canceling scheduled reminders:', error);
  }
};

export const getBackgroundTaskStatus = async (): Promise<string> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const hasScheduledReminders = scheduledNotifications.some(
      notification => notification.content.data?.type === 'scheduled_check'
    );
    return hasScheduledReminders ? 'active' : 'inactive';
  } catch (error) {
    console.error('Error getting background task status:', error);
    return 'unknown';
  }
}; 