import * as Notifications from 'expo-notifications';
import { supabase } from './supabaseClient';
import { t } from './translateService';

// Konfiguracja powiadomień
export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Funkcja do wysyłania powiadomienia o poke'u
export const sendPokeNotification = (senderName: string) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: t("poke_received_title"),
      body: t("poke_received_message").replace("{name}", senderName),
      sound: true,
    },
    trigger: null,
  });
};

// Funkcja do nasłuchiwania na poke'ów
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
          // Pobierz imię wysyłającego
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