import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { fetchFriends } from "@/src/service/apiService";
import { subscribeToPokeNotifications } from "@/src/service/notificationsService";
import FriendRequestForm from "@/components/FriendsScreen/FriendRequestForm";
import PendingFriendRequests from "@/components/FriendsScreen/PendingFriendRequests";
import FriendsList from "@/components/FriendsScreen/FriendsList";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

const FriendsScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFriendsList = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const friendsData = await fetchFriends(userId);
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendsList();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToPokeNotifications(userId);

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFriendsList();
    setRefreshing(false);
  };

  const handleFriendRemoved = () => {
    fetchFriendsList();
  };

  if (isLoading) {
    return (
      <ScreenWrapper showOfflineScreen={false}>
        <ScreenHeader title={t("friends")} />
        <View style={styles.loadingContainer}>
          <ThemedText>{t("loading")}</ThemedText>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showOfflineScreen={false}>
      <ScreenHeader title={t("friends")} />
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FriendRequestForm onRequestSent={handleRefresh} />
        <PendingFriendRequests onRequestHandled={handleRefresh} />
        <ConditionalRenderer condition={friends.length > 0}>
          <FriendsList
            friends={friends}
            onFriendRemoved={handleFriendRemoved}
          />
        </ConditionalRenderer>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsScreen;
