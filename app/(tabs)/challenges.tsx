import React, { useState, useEffect, useCallback } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store";
import { setActiveChallengesTab } from "@/src/store/tabsSlice";
import {
  fetchRecommendedChallenges,
  getActiveChallenges,
  getCompletedChallenges,
  fetchFriends,
  Friend,
} from "@/src/service/apiService";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { RecommendedChallengeData } from "@/components/AddHabitModal/types";
import { t } from "@/src/service/translateService";
import Loading from "@/components/Commons/Loading";
import { Colors } from "@/constants/Colors";
import { StartChallengeModal } from "@/components/ChallengesScreen/StartChallengeModal";
import YourChallengesTab from "@/components/ChallengesScreen/YourChallengesTab";
import DiscoverChallengesTab from "@/components/ChallengesScreen/DiscoverChallengesTab";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

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
  const userId = useSelector((state: RootState) => state.user.userId);

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
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleChallengeDeleted = useCallback(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleChallengePress = (challenge: RecommendedChallengeData) => {
    setSelectedChallenge(challenge);
    setIsStartModalVisible(true);
  };

  const handleCloseStartModal = () => {
    setIsStartModalVisible(false);
    setSelectedChallenge(null);
  };

  const handleTabPress = (tab: "your" | "discover") => {
    dispatch(setActiveChallengesTab(tab));
  };

  const renderContent = () => {
    if (isLoading || !isDataLoaded) {
      return <Loading />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "your" && styles.activeTabButton,
                ]}
                onPress={() => handleTabPress("your")}
              >
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === "your" && styles.activeTabButtonText,
                  ]}
                  bold={activeTab === "your"}
                >
                  {t("your_challenges")}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "discover" && styles.activeTabButton,
                ]}
                onPress={() => handleTabPress("discover")}
              >
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === "discover" && styles.activeTabButtonText,
                  ]}
                  bold={activeTab === "discover"}
                >
                  {t("discover")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === "your" ? (
            <YourChallengesTab
              activeChallenges={activeChallenges}
              completedChallenges={completedChallenges}
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
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      {renderContent()}

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
  tabContainer: {
    marginBottom: 20,
  },
  tabButtons: {
    flexDirection: "row",
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: Colors.White,
  },
  tabButtonText: {
    fontSize: 14,
    color: Colors.White,
  },
  activeTabButtonText: {
    color: Colors.HotPink,
  },
});

export default ChallengesScreen;
