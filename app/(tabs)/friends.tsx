import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { fetchFriends } from "@/src/service/apiService";
import { subscribeToPokeNotifications } from "@/src/service/notificationsService";
import FriendRequestForm from "@/components/FriendsScreen/FriendRequestForm";
import PendingFriendRequests from "@/components/FriendsScreen/PendingFriendRequests";
import FriendsList from "@/components/FriendsScreen/FriendsList";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";
import Loading from "@/components/Commons/Loading";
import { useSubscription } from "@/src/hooks/useSubscription";
import { Colors } from "@/constants/Colors";
import { RootState } from "@/src/store";
import { setActiveFriendsTab } from "@/src/store/tabsSlice";
import TabNavigator from "@/components/Commons/TabNavigator";
import CompetitionOptionsList from "@/components/CompetitionScreen/CompetitionOptionsList";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

const FriendsTab = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const { isSubscribed } = useSubscription();

  const fetchFriendsList = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [friendsData] = await Promise.all([fetchFriends(userId)]);
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

  const handleRefresh = async () => {
    await fetchFriendsList();
  };

  const handleFriendRemoved = () => {
    fetchFriendsList();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ConditionalRenderer condition={isSubscribed}>
        <PendingFriendRequests onRequestHandled={handleRefresh} />
      </ConditionalRenderer>
      <FriendRequestForm onRequestSent={handleRefresh} />
      <ConditionalRenderer condition={friends.length > 0 && isSubscribed}>
        <FriendsList friends={friends} onFriendRemoved={handleFriendRemoved} />
      </ConditionalRenderer>
    </ScrollView>
  );
};

const CompetitionTab = () => {
  const handleOptionPress = (optionId: string) => {
    // TODO: Implement competition option selection
    console.log("Selected competition option:", optionId);
  };

  return (
    <View style={styles.tabContent}>
      <CompetitionOptionsList onOptionPress={handleOptionPress} />
    </View>
  );
};

const FriendsScreen = () => {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const activeTab = useSelector(
    (state: RootState) => state.tabs.activeFriendsTab
  );
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) return;

    const unsubscribe = subscribeToPokeNotifications(userId);
    isSubscribedRef.current = true;

    return () => {
      unsubscribe();
      isSubscribedRef.current = false;
    };
  }, [userId]);

  const handleTabPress = (tabId: string) => {
    dispatch(setActiveFriendsTab(tabId as "friends" | "competition"));
  };

  const tabs = [
    { id: "friends", label: t("friends") },
    { id: "competition", label: t("competition") },
  ];

  return (
    <ScreenWrapper showOfflineScreen={false}>
      <ScreenHeader title={t("friends")} />
      <View style={styles.container}>
        <TabNavigator
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
        {activeTab === "friends" ? <FriendsTab /> : <CompetitionTab />}
      </View>
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
  competitionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  comingSoonDescription: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
  tabContent: {
    flex: 1,
  },
});

export default FriendsScreen;
