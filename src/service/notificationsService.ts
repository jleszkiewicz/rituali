import * as Notifications from 'expo-notifications';
import { supabase } from './supabaseClient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const sendPokeNotification = async (senderName: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Poke!',
      body: `${senderName} poked you!`,
    },
    trigger: null,
  });
};

interface PokePayload {
  new: {
    sender_id: string;
  };
}


export const subscribeToPokeNotifications = (userId: string) => {
  const channel = supabase
    .channel('poke_notifications')
    // @ts-ignore - Supabase types are not properly defined for postgres_changes
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'friend_pokes',
        filter: `receiver_id=eq.${userId}`,
      },
      async (payload: PokePayload) => {
        const senderId = payload.new.sender_id;
        const { data: senderData } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', senderId)
          .single();

        if (senderData?.name) {
          await sendPokeNotification(senderData.name);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}; 