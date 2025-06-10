import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  fetchRecommendedChallenges,
  getActiveChallenges,
  getCompletedChallenges,
  fetchFriends,
  Friend,
} from "@/src/service/apiService";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { RecommendedChallengeData } from "@/components/AddHabitModal/types";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { RootState } from "@/src/store";
import { setActiveChallengesTab } from "@/src/store/tabsSlice";
import TabNavigator from "@/components/Commons/TabNavigator";
import Loading from "@/components/Commons/Loading";
import YourChallengesTab from "@/components/ChallengesScreen/YourChallengesTab";
import DiscoverChallengesTab from "@/components/ChallengesScreen/DiscoverChallengesTab";
import { StartChallengeModal } from "@/components/ChallengesScreen/StartChallengeModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 20;
const ITEM_MARGIN = 10;
const SCREEN_WRAPPER_PADDING = 20;

const ChallengesScreen = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(
    (state: RootState) => state.tabs.activeChallengesTab
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<ChallengeData[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<
    ChallengeData[]
  >([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<
    RecommendedChallengeData[]
  >([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedChallenge, setSelectedChallenge] =
    useState<RecommendedChallengeData | null>(null);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const userId = useSelector(selectUserId);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [
        activeChallengesData,
        completedChallengesData,
        recommendedChallengesData,
        friendsData,
      ] = await Promise.all([
        getActiveChallenges(userId),
        getCompletedChallenges(userId),
        fetchRecommendedChallenges(userId),
        fetchFriends(userId),
      ]);

      setActiveChallenges(activeChallengesData);
      setCompletedChallenges(completedChallengesData);
      setRecommendedChallenges(recommendedChallengesData);
      setFriends(friendsData);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChallengeDeleted = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleChallengePress = (challenge: RecommendedChallengeData) => {
    setSelectedChallenge(challenge);
    setIsStartModalVisible(true);
  };

  const handleCloseStartModal = () => {
    setIsStartModalVisible(false);
    setSelectedChallenge(null);
  };

  const handleTabPress = (tabId: string) => {
    dispatch(setActiveChallengesTab(tabId as "your" | "discover"));
  };

  const tabs = [
    { id: "your", label: t("your_challenges") },
    { id: "discover", label: t("discover") },
  ];

  if (isLoading || !isDataLoaded || !userId) {
    return <Loading />;
  }

  return (
    <ScreenWrapper showOfflineScreen={false}>
      <ScreenHeader title={t("challenges")} />
      <View style={styles.container}>
        <TabNavigator
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
        {activeTab === "your" ? (
          <YourChallengesTab
            activeChallenges={[...activeChallenges, ...completedChallenges]}
            friends={friends}
            userId={userId}
            isLoading={isLoading}
            onInvitationHandled={loadData}
            onChallengeDeleted={handleChallengeDeleted}
            PAGE_WIDTH={PAGE_WIDTH}
            ITEM_MARGIN={ITEM_MARGIN}
          />
        ) : (
          <DiscoverChallengesTab
            recommendedChallenges={recommendedChallenges}
            isLoading={isLoading}
            onChallengePress={handleChallengePress}
            SCREEN_WIDTH={SCREEN_WIDTH}
            SCREEN_WRAPPER_PADDING={SCREEN_WRAPPER_PADDING}
          />
        )}
      </View>

      {selectedChallenge && (
        <StartChallengeModal
          isVisible={isStartModalVisible}
          onClose={handleCloseStartModal}
          challenge={selectedChallenge}
          refreshChallenges={loadData}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChallengesScreen;
