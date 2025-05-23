import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import FriendRequestForm from "@/components/FriendsScreen/FriendRequestForm";
import FriendsList from "@/components/FriendsScreen/FriendsList";
import PendingFriendRequests from "@/components/FriendsScreen/PendingFriendRequests";
import { fetchFriends } from "@/src/service/apiService";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

const FriendsScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector(selectUserId);

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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FriendRequestForm onRequestSent={fetchFriendsList} />
        <PendingFriendRequests onRequestHandled={fetchFriendsList} />
        <FriendsList friends={friends} onFriendRemoved={handleFriendRemoved} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsScreen;
